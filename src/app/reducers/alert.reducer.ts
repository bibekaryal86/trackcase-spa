import { ALERT_TYPE_FAILURE, ALERT_TYPE_SUCCESS } from '../../constants'
import { RESET_ALERT, SET_ALERT } from '../types/app.action.types'
import { AlertAction, AlertState } from '../types/app.data.types'

const initialState: AlertState = {
  messageType: '',
  messageText: '',
}

export default function alert(state = initialState, action: AlertAction): AlertState {
  const { type } = action
  const matchesSuccess = /(.*)_(SUCCESS)/.exec(type)
  const matchesFailure = /(.*)_(FAILURE)/.exec(type)
  const matchesUnmount = /(.*)_(UNMOUNT)/.exec(type)

  if (type === SET_ALERT) {
    return {
      messageType: action.messageType,
      messageText: action.messageText,
    }
  }

  if (type === RESET_ALERT || matchesUnmount) {
    return initialState
  }

  if (matchesFailure && action.error) {
    return {
      messageType: ALERT_TYPE_FAILURE,
      messageText: action.error,
    }
  }

  if (matchesSuccess && action.success) {
    return {
      messageType: ALERT_TYPE_SUCCESS,
      messageText: action.success,
    }
  }

  return state
}
