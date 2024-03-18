import { UserAdminAction, UserAdminState } from '../types/users.data.types'

const DefaultUserAdminState: UserAdminState = {
  requestMetadataState: []
}

export default function users(state = DefaultUserAdminState, action: UserAdminAction): UserAdminState {
  const { type } = action
  const matchesRequest = /(.*)_(REQUEST)/.exec(type)
  const matchesSuccess = /(.*)_(SUCCESS)/.exec(type)

  if (matchesRequest) {
    return state
  }

  if (matchesSuccess) {
    return {
        ...state,
        requestMetadataState: action.metadata,
      }
  }

  return state
}
