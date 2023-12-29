import React from 'react'

import { RESET_ALERT, SET_ALERT } from '../types/app.action.types'
import { AlertAction } from '../types/app.data.types'

export const resetAlert = () => {
  return (dispatch: React.Dispatch<Partial<AlertAction>>): void => {
    dispatch({
      type: RESET_ALERT,
    })
  }
}

export const setAlert = (type: string, messageText: string, messageBody?: string | React.ReactElement) => {
  return (dispatch: React.Dispatch<AlertAction>): void => {
    dispatch({
      type: SET_ALERT,
      messageType: type,
      messageText: messageBody ? messageBody : messageText,
    })
  }
}
