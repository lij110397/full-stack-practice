import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import PropTypes from 'prop-types'
import { setNotificationFunc } from '../reducers/notificationReducer'
const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </div>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  // const anecdotes = useSelector((state) => state.anecdotes)
  const anecdotes = useSelector((state) =>
    state.anecdotes.filter((anecdote) =>
      anecdote.content.includes(state.filter)
    )
  )

  const voteFunc = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(
      setNotificationFunc(
        `you voted '${anecdote.content}', do it more often`,
        5
      )
    )
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => voteFunc(anecdote)}
        />
      ))}
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
  }).isRequired,
  handleVote: PropTypes.func.isRequired,
}

export default Anecdotes
