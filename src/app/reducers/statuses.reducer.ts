import { STATUSES_RETRIEVE_SUCCESS } from '../types/app.action.types'
import { StatusAction, StatusState } from '../types/app.data.types'

export const DefaultStatusesState: StatusState = {
  statuses: {
    court: {
      active: [],
      inactive: [],
      all: []
    },
    judge: {
      active: [],
      inactive: [],
      all: []
    },
    client: {
      active: [],
      inactive: [],
      all: []
    },
    form: {
      active: [],
      inactive: [],
      all: []
    },
    court_case: {
      active: [],
      inactive: [],
      all: []
    },
    case_collections: {
      active: [],
      inactive: [],
      all: []
    },
    cash_collections: {
      active: [],
      inactive: [],
      all: []
    },
    hearing_calendar: {
      active: [],
      inactive: [],
      all: []
    },
    task_calendar: {
      active: [],
      inactive: [],
      all: []
    },
  },
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
