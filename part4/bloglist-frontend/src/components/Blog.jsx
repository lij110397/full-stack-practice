import TogglableDetail from './TogglableDetail'
const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const Blog = ({ blog, updateLike, deleteBlog }) => {
  const updateBlogLikes = (event) => {
    event.preventDefault()
    const newBlog = { ...blog, likes: blog.likes + 1 }
    // console.log('newBlog in update blog likes ', newBlog)
    updateLike(newBlog)
  }

  const deleteBlogIn = (event) => {
    event.preventDefault()

    // console.log('newBlog in update blog likes ', newBlog)
    deleteBlog(blog)
  }
  return (
    <div style={blogStyle}>
      <span>{blog.title}</span>
      <TogglableDetail buttonLabel='view'>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes} <button onClick={updateBlogLikes}>like</button>
        </p>
        <p>{blog.author}</p>
        <button onClick={deleteBlogIn}>remove</button>
      </TogglableDetail>
    </div>
  )
}

export default Blog
