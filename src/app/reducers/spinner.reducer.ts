import { RESET_SPINNER, SET_SPINNER } from '../types/app.action.types'
import { SpinnerAction, SpinnerState } from '../types/app.data.types'

const initialState: SpinnerState = {
  isLoading: false,
  spinRequests: new Set<string>(),
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
    const requestModule: string = type.split('_')[0]
    const spinRequests = new Set(state.spinRequests)
    spinRequests.add(requestModule)
    return {
      isLoading: true,
      spinRequests: spinRequests,
    }
  }

  if (matchesResponse) {
    const responseModule: string = type.split('_')[0]
    const spinRequests = new Set(state.spinRequests)
    spinRequests.delete(responseModule)

    return {
      isLoading: spinRequests.size > 0,
      spinRequests: spinRequests,
    }
  }

  return state
}
