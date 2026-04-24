import { RESET_ALERT, SET_ALERT } from '@app/types/app.action.types.ts'
import { AlertAction, AlertState } from '@app/types/app.data.types.ts'
import { ALERT_TYPES } from '@constants/index.ts'

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
      messageType: ALERT_TYPES.ERROR,
      messageText: action.error,
    }
  }

  if (matchesSuccess && action.success) {
    return {
      messageType: ALERT_TYPES.SUCCESS,
      messageText: action.success,
    }
  }

  return state
}
