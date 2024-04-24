import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      // manually update the anecdotes data
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))

      notificationDispatch({
        type: 'SET',
        data: { content: `anecdote '${newAnecdote.content}' created` },
      })
      setTimeout(() => {
        notificationDispatch({ type: 'SET', data: { content: '' } })
      }, 5 * 1000)
      // queryClient.invalidateQueries('anecdotes')
    },
    onError: (error) => {
      notificationDispatch({
        type: 'SET',
        data: {
          content: `too short anecdote, must have length of 5 characters`,
        },
      })
      setTimeout(() => {
        notificationDispatch({ type: 'SET', data: { content: '' } })
      }, 5 * 1000)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('content length ', content.length)
    newMutation.mutate({ content })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' minLength='5' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
