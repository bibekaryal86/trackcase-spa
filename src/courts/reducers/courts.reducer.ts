import {
  COURTS_CREATE_SUCCESS,
  COURTS_DELETE_SUCCESS,
  COURTS_READ_SUCCESS,
  COURTS_UPDATE_SUCCESS,
} from '@courts/types/courts.action.types.ts'
import { CourtsAction, CourtsState, DefaultCourtState } from '@courts/types/courts.data.types.ts'

export default function courts(state = DefaultCourtState, action: CourtsAction): CourtsState {
  switch (action.type) {
    case COURTS_READ_SUCCESS:
      return {
        courts: action.courts,
        requestMetadata: action.requestMetadata,
      }
    case COURTS_CREATE_SUCCESS:
    case COURTS_UPDATE_SUCCESS:
    case COURTS_DELETE_SUCCESS:
      return {
        ...state,
        courts: [],
      }
    default:
      return state
  }
}
