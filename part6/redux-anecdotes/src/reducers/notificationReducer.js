import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Nothing in initial notification'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
  },
})

export const { setNotification } = notificationSlice.actions
export const setNotificationFunc = (content, timeDelay) => {
  return async (dispatch) => {
    dispatch(setNotification(content))
    setTimeout(() => {
      dispatch(setNotification(''))
    }, timeDelay*1000)
  }
}
export default notificationSlice.reducer
