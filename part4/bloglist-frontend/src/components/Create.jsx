import { useState } from 'react'
import PropTypes from 'prop-types'

const Create = ({ createBlog }) => {
  // state variables for a new blog
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <p>
          title:
          <input
            type='text'
            value={newTitle}
            name='newTitle'
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </p>
        <p>
          author:
          <input
            type='text'
            value={newAuthor}
            name='newAuthor'
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </p>
        <p>
          url:
          <input
            type='text'
            value={newUrl}
            name='newUrl'
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </p>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

Create.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default Create
