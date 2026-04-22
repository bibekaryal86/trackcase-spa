import { RESET_SPINNER, SET_SPINNER } from '@app/types/app.action.types.ts'
import { SpinnerAction, SpinnerState } from '@app/types/app.data.types.ts'

const initialState: SpinnerState = {
  isLoading: false,
  requestCount: 0,
}

export default function spinner(state = initialState, action: SpinnerAction): SpinnerState {
  const { type } = action
  const matchesRequest = /(.*)_(REQUEST)/.exec(type)
  const matchesComplete = /(.*)_(COMPLETE)/.exec(type)

  if (type === SET_SPINNER) {
    return {
      ...state,
      isLoading: true,
    }
  }

  if (type === RESET_SPINNER) {
    return {
      ...state,
      isLoading: false,
    }
  }

  if (matchesRequest) {
    const requestCount = state.requestCount
    return {
      isLoading: true,
      requestCount: requestCount + 1,
    }
  }

  if (matchesComplete) {
    let requestCount = state.requestCount
    if (requestCount > 0) {
      requestCount = requestCount - 1
    }
    return {
      isLoading: requestCount > 0,
      requestCount: requestCount,
    }
  }

  return state
}
