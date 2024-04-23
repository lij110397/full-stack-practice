import { createSlice } from '@reduxjs/toolkit'
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  }
}

const initialState = anecdotesAtStart.map(asObject)
const sortAnecdotes = (anecdote) => {
  return anecdote.slice().sort((a, b) => b.votes - a.votes)
}

const anecdoteSlice = createSlice({
  name:'anecdote',
  initialState,
  reducers: {
    createAnecdote(state,action) {
      const content = action.payload
      state.anecdotes.push({
        content
      })
    },
    voteAnecdote(state, action) {
      const index = state.findIndex((item)=>item.id === action.payload)
      const updatedItem = {...state[index], votes:state[index].votes + 1}
      return sortAnecdotes([...state.slice(0, index), updatedItem, ...state.slice(index + 1)])
    }
  }
})

// const reducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)
//   let index
//   switch (action.type) {
//     case 'VOTE': {
//       index = state.findIndex((item) => item.id === action.data.id)
//       const updatedItem = { ...state[index], votes: state[index].votes + 1 } // 更新 votes 属性
//       return sortAnecdotes([...state.slice(0, index), updatedItem, ...state.slice(index + 1)])
//     }
//     case 'CREATE': {
//       return sortAnecdotes([...state, action.data])
//     }
//     default:
//       return state;
//   }
// }

// export const voteAnecdote = (id) => {
//   return {
//     type: 'VOTE',
//     data: { id },
//   }
// }

// export const createAnecdote = (content) => {
//   return {
//     type: 'CREATE',
//     data: {
//       content,
//       id: getId(),
//       votes: 0,
//     },
//   }
// }

export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
