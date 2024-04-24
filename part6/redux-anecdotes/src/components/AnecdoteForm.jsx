import { useDispatch } from 'react-redux'
import { addAnecdoteFunc } from '../reducers/anecdoteReducer'
const getId = () => (100000 * Math.random()).toFixed(0)

const NEWAnecdote = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    const newObject = {
      content:content,
      id: getId(),
      votes: 0
    }
     
    dispatch(addAnecdoteFunc(newObject))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default NEWAnecdote
