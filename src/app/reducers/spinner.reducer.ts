import { RESET_SPINNER, SET_SPINNER } from '../types/app.action.types'
import { SpinnerAction, SpinnerState } from '../types/app.data.types'

const initialState: SpinnerState = {
  isLoading: false,
}

export default function spinner(state = initialState, action: SpinnerAction): SpinnerState {
  const { type } = action
  const matchesRequest = /(.*)_(REQUEST)/.exec(type)
  const matchesResponse = /(.*)_(SUCCESS|FAILURE|COMPLETE)/.exec(type)

  if (matchesRequest || type === SET_SPINNER) {
    return {
      isLoading: true,
    }
  } else if (matchesResponse || type === RESET_SPINNER) {
    return {
      isLoading: false,
    }
  }

  return state
}
