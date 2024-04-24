import { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import { useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      // console.log('action', action.data.content)
      return action.data.content
    default:
      return ''
  }
}

const NotificationContext = createContext()
export const useNotificationValue = () => {
  const notificationContext = useContext(NotificationContext)
  return notificationContext[0]
}
export const useNotificationDispatch = () => {
  const notificationContext = useContext(NotificationContext)
  return notificationContext[1]
}
export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NotificationContext
