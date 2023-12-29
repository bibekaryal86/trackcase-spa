import {
  JUDGE_CREATE_SUCCESS,
  JUDGE_DELETE_SUCCESS,
  JUDGE_UPDATE_SUCCESS,
} from '../../judges/types/judges.action.types'
import {
  COURT_CREATE_SUCCESS,
  COURT_DELETE_SUCCESS,
  COURT_NOTE_SUCCESS,
  COURT_UPDATE_SUCCESS,
  COURTS_RETRIEVE_REQUEST,
  COURTS_RETRIEVE_SUCCESS,
  COURTS_UNMOUNT,
  SET_SELECTED_COURT,
} from '../types/courts.action.types'
import { CourtsAction, CourtsState, DefaultCourtSchema, DefaultCourtState } from '../types/courts.data.types'

export default function courts(state = DefaultCourtState, action: CourtsAction): CourtsState {
  const matchesRequest = /^COURT_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  if (matchesRequest || action.type === COURTS_RETRIEVE_REQUEST) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  switch (action.type) {
    case COURTS_RETRIEVE_SUCCESS:
      return {
        ...state,
        isCloseModal: true,
        courts: action.courts,
      }
    case COURT_CREATE_SUCCESS:
    case COURT_UPDATE_SUCCESS:
    case COURT_DELETE_SUCCESS:
      return {
        isCloseModal: true,
        courts: [], // so that it will fetch
        selectedCourt: DefaultCourtSchema, // so that it will fetch
      }
    case SET_SELECTED_COURT:
      return {
        ...state,
        selectedCourt: action.selectedCourt,
      }
    case COURT_NOTE_SUCCESS:
    case JUDGE_CREATE_SUCCESS:
    case JUDGE_UPDATE_SUCCESS:
    case JUDGE_DELETE_SUCCESS:
      return {
        ...state,
        selectedCourt: DefaultCourtSchema, // so that it will fetch
      }
    case COURTS_UNMOUNT:
      return {
        ...state,
        selectedCourt: DefaultCourtSchema,
      }
    default:
      return state
  }
}
