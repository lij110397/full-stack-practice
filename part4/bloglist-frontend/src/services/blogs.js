import axios from 'axios'
// const baseUrl = '/api/blogs'
const baseUrl = 'http://localhost:3003/api/blogs'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.get(baseUrl, config)
  return request.then((response) => response.data)
}

const create = (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, newBlog, config)
  return request.then((response) => response.data)
}

const update = (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  console.log('newBlog in update request', newBlog)
  const request = axios.put(`${baseUrl}/${newBlog.id}`, newBlog, config)
  return request.then((response) => response.data)
}

const deleteBlog = (blogToDelete) => {
  const config = {
    headers: { Authorization: token },
  }

  console.log('blogToDelete in delete request', blogToDelete)
  const request = axios.delete(`${baseUrl}/${blogToDelete.id}`, config)
  return request.then((response) => response.data)
}
export default { getAll, setToken, create, update, deleteBlog }
