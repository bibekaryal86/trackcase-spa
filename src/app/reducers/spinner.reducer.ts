import { RESET_SPINNER, SET_SPINNER } from '../types/app.action.types'
import { SpinnerAction, SpinnerState } from '../types/app.data.types'

const initialState: SpinnerState = {
  isLoading: false,
  spinRequests: {},
}

export default function spinner(state = initialState, action: SpinnerAction): SpinnerState {
  const { type } = action
  const matchesRequest = /(.*)_(REQUEST)/.exec(type)
  const matchesResponse = /(.*)_(SUCCESS|FAILURE|COMPLETE)/.exec(type)

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
    const requestModule = type.split('_')[0]
    const spinRequests = { ...state.spinRequests }
    const count = spinRequests[requestModule] || 0
    spinRequests[requestModule] = count + 2
    // add by 2 to account for success/failure and complete in matchesResponse
    return {
      isLoading: true,
      spinRequests: spinRequests,
    }
  }

  if (matchesResponse) {
    const responseModule = type.split('_')[0]
    const spinRequests = { ...state.spinRequests }
    const count = spinRequests[responseModule] || 0
    if (count <= 1) {
      delete spinRequests[responseModule]
    } else {
      spinRequests[responseModule] = count - 1
    }

    return {
      isLoading: Object.keys(spinRequests).length > 0,
      spinRequests: spinRequests,
    }
  }

  return state
}
