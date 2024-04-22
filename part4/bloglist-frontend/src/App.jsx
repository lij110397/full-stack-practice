import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Create from './components/Create'
import Togglable from './components/Togglable'

const App = () => {
  // basic variables for the app
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('right')

  const blogCreateRef = useRef()

  // renew the blog list when it is changed using effect hook
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [user])

  // when loading the app for the first time, try to get the token and set the user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // handle login event
  const handleLogin = async (event) => {
    event.preventDefault()
    // console.log('login in with ', username, password)
    try {
      // send login in request
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedBloglistappUser', JSON.stringify(user))

      // clear the login in fields
      setUsername('')
      setPassword('')

      // show message
      setMessage('Login in successfully')
      setMessageType('right')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      // show message of wrong login
      setMessage('wrong username or password')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  // handle log out event
  // remove the localStorage for user
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistappUser')
    setUser(null)
  }

  // handle create event
  const handleCreate = async (newBlog) => {
    console.log('create a new blog enter')

    //创建一个新的blog后，通过调用blogCreateRef.current.toggleVisibility()来隐藏这个表单
    blogCreateRef.current.toggleVisibility()
    // check the fields in form are empty or not
    // if (newTitle === '' || newAuthor === '' || newUrl === '') {
    //   event.preventDefault()
    //   setMessage('There are empty values')
    //   setMessageType('error')
    //   setTimeout(() => {
    //     setMessage(null)
    //   }, 5000)
    // }

    // create new Blog according to the input
    // const newBlog = {
    //   title: newTitle,
    //   author: newAuthor,
    //   url: newUrl,
    // }

    // usually the user should be available. Just in case the user is empty and the authentication will be wrong
    if (user === null) {
      setMessage('There is not valid user')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } else {
      try {
        // send create a new blog request
        const returnBlogs = await blogService.create(newBlog)
        setBlogs(blogs.concat(returnBlogs))
        // setMessage(`${newBlog.title} By ${user.username} added`)
        // setMessageType('right')
        // setTimeout(() => {
        //   setMessage(null)
        // }, 5000)
      } catch (exception) {
        setMessage('Something wrong with adding a new blog')
        setMessageType('error')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
  }

  // update blog's likes
  const updateLike = async (newBlog) => {
    if (user === null) {
      setMessage('There is not valid user')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } else {
      try {
        // send update likes request
        const updatedBlog = await blogService.update(newBlog)
        console.log('updatedBlog in app ', updatedBlog)
        setBlogs(
          blogs.map((blog) =>
            blog.id === updatedBlog.id ? { ...blog, ...updatedBlog } : blog
          )
        )
      } catch (exception) {
        setMessage('Something wrong with updating the blog')
        setMessageType('error')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
  }

  const deleteBlog = async (blogToDelete) => {
    if (user === null) {
      setMessage('There is not valid user')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } else {
      if (
        window.confirm(
          `Remove blog "${blogToDelete.title}" by "${blogToDelete.author}"`
        )
      ) {
        try {
          // send delete the blog request
          await blogService.deleteBlog(blogToDelete)
          setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id))
        } catch (exception) {
          setMessage('Something wrong with updating the blog')
          setMessageType('error')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }
      }
    }
  }
  // login Form
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>Login in</button>
    </form>
  )

  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes)
  // blog related form
  const blogForm = () => (
    <div>
      <Togglable buttonLabel='new blog' ref={blogCreateRef}>
        <Create createBlog={handleCreate} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateLike={updateLike}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type={messageType} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name} logged-in <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
        </div>
      )}
    </div>
  )
}
export default App
