import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const updateMutation = useMutation(updateAnecdote, {
    onSuccess: (newAnecdote) => {
      // queryClient.invalidateQueries('anecdotes')
      const updatedAnecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData(
        'anecdotes',
        updatedAnecdotes.map((updatedAnecdote) =>
          updatedAnecdote.id !== newAnecdote.id ? updatedAnecdote : newAnecdote
        )
      )
    },
  })

  const handleVote = (anecdote) => {
    updateMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    notificationDispatch({
      type: 'SET',
      data: { content: `anecdote '${anecdote.content}' voted` },
    })
    setTimeout(() => {
      notificationDispatch({ type: 'SET', data: { content: '' } })
    }, 5 * 1000)
  }

  const result = useQuery('anecdotes', getAnecdotes, { retry: 1 })
  // console.log('result ', result)
  if (result.isLoading) {
    return <div>loading data</div>
  }
  if (result.isError) {
    return <div>anecdotes service not available due to problems in server</div>
  }

  const anecdotes = result.data
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
