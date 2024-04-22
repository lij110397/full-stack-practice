import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const TogglableDetail = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <>
      <span style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </span>
      <span style={showWhenVisible}>
        <button onClick={toggleVisibility}>hide</button>
        {props.children}
      </span>
    </>
  )
})

TogglableDetail.displayName = 'TogglableDetail'
TogglableDetail.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default TogglableDetail
