import {
  COURT_CASE_CREATE_SUCCESS,
  COURT_CASE_DELETE_SUCCESS,
  COURT_CASE_NOTE_SUCCESS,
  COURT_CASE_UPDATE_SUCCESS,
  COURT_CASES_RETRIEVE_REQUEST,
  COURT_CASES_RETRIEVE_SUCCESS,
  COURT_CASES_UNMOUNT,
  SET_SELECTED_COURT_CASE,
} from '../types/court_cases.action.types'
import {
  CourtCasesAction,
  CourtCasesState,
  DefaultCourtCaseSchema,
  DefaultCourtCaseState,
} from '../types/court_cases.data.types'

export default function court_cases(state = DefaultCourtCaseState, action: CourtCasesAction): CourtCasesState {
  const matchesRequest = /^COURT_CASE_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  if (matchesRequest || action.type === COURT_CASES_RETRIEVE_REQUEST) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  switch (action.type) {
    case COURT_CASES_RETRIEVE_SUCCESS:
      return {
        ...state,
        isCloseModal: true,
        court_cases: action.court_cases,
      }
    case COURT_CASE_CREATE_SUCCESS:
    case COURT_CASE_UPDATE_SUCCESS:
    case COURT_CASE_DELETE_SUCCESS:
      return {
        isCloseModal: true,
        court_cases: [], // so that it will fetch
        selectedCourtCase: DefaultCourtCaseSchema, // so that it will fetch
      }
    case SET_SELECTED_COURT_CASE:
      return {
        ...state,
        selectedCourtCase: action.selectedCourtCase,
      }
    case COURT_CASE_NOTE_SUCCESS:
      return {
        ...state,
        selectedCourtCase: DefaultCourtCaseSchema, // so that it will fetch
      }
    case COURT_CASES_UNMOUNT:
      return {
        ...state,
        selectedCourtCase: DefaultCourtCaseSchema,
      }
    default:
      return state
  }
}
