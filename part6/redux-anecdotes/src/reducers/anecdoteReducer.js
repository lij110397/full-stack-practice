import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdote'

const sortAnecdotes = (anecdote) => {
  return anecdote.slice().sort((a, b) => b.votes - a.votes)
}

const anecdoteSlice = createSlice({
  name:'anecdote',
  initialState:[],
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      return [...state, content]
    },
    voteAnecdote(state, action) {
      const index = state.findIndex((item)=>item.id === action.payload)
      const updatedItem = {...state[index], votes:state[index].votes + 1}
      return sortAnecdotes([...state.slice(0, index), updatedItem, ...state.slice(index + 1)])
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  }
})

export const { createAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const addAnecdoteFunc = newObject => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(newObject)
    dispatch(createAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer
