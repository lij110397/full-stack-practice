import React from 'react'
import '../index.css'

const Notification = ({ message, type }) => {
  if (message === null) return null
  if (type === 'right') {
    return (<div className='right'>{message}</div>)
  } else {
    return (<div className='error'>{message}</div>)
  }
}

export default Notification
