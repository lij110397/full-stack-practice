const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

blogsRouter.get('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  console.log('user ', user)

  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.hasOwnProperty('title') || !body.hasOwnProperty('url')) {
    return response.status(400).end()
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  console.log('user ', user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  })

  const saveBlog = await blog.save()
  user.blogs = user.blogs.concat(saveBlog._id)
  await user.save()

  response.status(201).json(saveBlog)

  // blog.save().then((saveBlog) => {
  //   response.status(201).json(saveBlog)
  // }).catch(error=> next(error))
})

blogsRouter.delete('/:id', async (request, response) => {
  // token verified
  const blog = await Blog.findById(request.params.id)
  console.log('blog to delete ', blog)
  if (!blog) response.status(404).end()

  // 使一个博客只能由添加该博客的用户删除。只有当与请求一起发送的令牌与博客创建者的令牌相同时，删除博客才有可能
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  const user = request.user
  if (!user) response.status(404).json({ error: 'there is no user valid' })()
  // console.log('request.user ', user)
  if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  // the update blog data existed in database
  const blog = await Blog.findById(request.params.id)
  console.log('blog to update ', blog)
  if (!blog) response.status(404).end()

  // find the user 
  const user = request.user
  if (!user) response.status(404).json({ error: 'there is no user valid' })()
  // console.log('request.user ', user)
  if (blog.user.toString() === request.user.id.toString()) {
    console.log('blog from request ', request.body)
    const updateBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes: request.body.likes },
      { new: true }
    )
    console.log('blog in backend ', updateBlog)
    response.status(202).json(updateBlog)
  } else {
    response.status(404).end()
  }

})

blogsRouter.get('/:id', async (request, response) => {
  const returnBlog = await Blog.findById(request.params.id)
  if (!returnBlog) {
    return response.status(404).end()
  }
  response.json(returnBlog)
})

module.exports = blogsRouter
