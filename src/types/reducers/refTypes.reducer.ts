import { RefTypesAction, RefTypesState } from '../types/refTypes.data.types'

const initialState: RefTypesState = {
  isCloseModal: true,
}

export default function refTypes(state = initialState, action: RefTypesAction): RefTypesState {
  const { type } = action
  const matchesRequest = /(.*)_(REQUEST)/.exec(type)
  const matchesSuccess = /(.*)_(SUCCESS)/.exec(type)

  if (matchesRequest) {
    return {
      isCloseModal: false,
    }
  }

  if (matchesSuccess) {
    return {
      isCloseModal: true,
    }
  }

  return state
}
