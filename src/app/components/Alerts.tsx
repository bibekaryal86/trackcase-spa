import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import React, { forwardRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { INVALID_SESSION } from '../../constants'
import { GlobalState } from '../store/redux'
import { AlertState } from '../types/app.data.types'
import { resetAlert } from '../utils/alerts.utils'

interface AlertsProps extends AlertState {
  resetAlert: () => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Alerts = (props: AlertsProps): React.ReactElement => {
  const { messageType, messageText, resetAlert } = props
  const [isOpen, setIsOpen] = useState(false)
  const close = () => {
    setIsOpen(false)
    resetAlert()
  }

  useEffect(() => {
    if (messageType && messageText) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [messageType, messageText])

  return isOpen && messageType && messageText ? (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={isOpen} autoHideDuration={messageText === INVALID_SESSION ? 1000000 : 10000} onClose={close}>
        <Alert onClose={close} severity={messageType as AlertColor} sx={{ width: '100%' }}>
          {messageText}
        </Alert>
      </Snackbar>
    </Stack>
  ) : (
    <React.Fragment />
  )
}

const mapStateToProps = ({ alert }: GlobalState) => {
  return {
    messageType: alert.messageType,
    messageText: alert.messageText,
  }
}

const mapDispatchToProps = {
  resetAlert: () => resetAlert(),
}

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)
