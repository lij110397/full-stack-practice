const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
console.log('app ', app)
const api = supertest(app)
const assert = require('node:assert')
const helper = require('./tests_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({}).maxTimeMS(100000)

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
  // helper.initialBlogs.forEach(async (blog) =>{
  //   let blogObject = new Blog(blog)
  //   await blogObject.save()
  // })
})

// tests
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the blog is about First class tests', async () => {
  const response = await api.get('/api/blogs')

  const title = response.body.map((e) => e.title)
  assert(title.includes('First class tests'))
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    userId: '6624c31e562b27c25990cf32'
  }

  await api
    .post('/api/blogs')
    // .set('Authorization', `Bearer ${token}`)  // 添加 Authorization 头部
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  //const response = await api.get('/api/blogs')
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map((r) => r.title)
  assert(title.includes('Go To Statement Considered Harmful'))
})

test.only('the blog cannot be added because of no token', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    userId: '6624c31e562b27c25990cf32'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  // const response = await api.get('/api/blogs')

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'testBlog',
    author: 'Michael Chan',
    likes: 7,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  // const response = await api.get('/api/blogs')

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('identification attribute should be named id than _id', async () => {
  const blog = new Blog({
    title: 'test',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  })
  const jsonBlog = blog.toJSON()
  assert.strictEqual(jsonBlog.id !== undefined, true) // 验证 id 存在
  assert.strictEqual(jsonBlog._id === undefined, true) // 验证 _id 不存在
})

test('if likes is not defined in the request, then it should be 0 by default', async () => {
  const newBlog = {
    title: 'testBlog',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
  }

  const response = await api.post('/api/blogs').send(newBlog).expect(201)
  assert.strictEqual(response.body.likes, 0)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('update of a blog', () => {
  test('succeeds with an updated blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    // const blogToUpdate = blogsAtStart[0]

    const blogToUpdate = await Blog.findById(blogsAtStart[0].id) // 先查询对应的文档
    if (blogToUpdate) {
      // 找到了对应的文档，可以进行更新操作
      blogToUpdate.likes = 21
      await blogToUpdate.save()
    } else {
      // 没有找到对应的文档
      console.error('Blog not found!')
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const results = blogsAtEnd.map(r => ({ title: r.title, likes: r.likes }))

    const end = results.filter(result => result.title === blogToUpdate.title)
    assert.strictEqual(end[0].likes, 21)
  })
})

// test about user management
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({}).maxTimeMS(100000)

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    console.log('usersAtEnd ', usersAtEnd)
    console.log('something wrong ', result.body.error)
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

})


after(async () => {
  await mongoose.connection.close()
})
