const blog = require('../models/blog')

const dummy = (blogs) => {
  // 它接收一个博客文章数组作为参数，并始终返回 1
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length !== 0) {
    const favoriteBlog = blogs.reduce((maxBlog, currentBlog) => {
      return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog
    }, blogs[0])
    return {
        title:favoriteBlog.title,
        author:favoriteBlog.author,
        likes:favoriteBlog.likes
    }
  }
  return null
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
