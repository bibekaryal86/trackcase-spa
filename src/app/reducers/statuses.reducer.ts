import { STATUSES_RETRIEVE_SUCCESS } from '../types/app.action.types'
import { StatusAction, StatusState } from '../types/app.data.types'

export const DefaultStatusesState: StatusState = {
  statuses: {},
}

export default function statuses(state = DefaultStatusesState, action: StatusAction): StatusState {
  switch (action.type) {
    case STATUSES_RETRIEVE_SUCCESS:
      return {
        statuses: action.statuses,
      }
    default:
      return state
  }
}
