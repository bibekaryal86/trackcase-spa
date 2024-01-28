import { FORM_CREATE_SUCCESS, FORM_DELETE_SUCCESS, FORM_UPDATE_SUCCESS } from '../../forms'
import {
  COURT_CASE_CREATE_SUCCESS,
  COURT_CASE_DELETE_SUCCESS,
  COURT_CASE_NOTE_SUCCESS,
  COURT_CASE_UPDATE_SUCCESS,
  COURT_CASES_RETRIEVE_REQUEST,
  COURT_CASES_RETRIEVE_SUCCESS,
  COURT_CASES_UNMOUNT,
  SET_SELECTED_COURT_CASE,
} from '../types/courtCases.action.types'
import {
  CourtCasesAction,
  CourtCasesState,
  DefaultCourtCaseSchema,
  DefaultCourtCaseState,
} from '../types/courtCases.data.types'

export default function courtCases(state = DefaultCourtCaseState, action: CourtCasesAction): CourtCasesState {
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
        isForceFetch: false,
        isCloseModal: true,
        courtCases: action.courtCases,
      }
    case COURT_CASE_CREATE_SUCCESS:
    case COURT_CASE_UPDATE_SUCCESS:
    case COURT_CASE_DELETE_SUCCESS:
      return {
        isForceFetch: true,
        isCloseModal: true,
        courtCases: [],
        selectedCourtCase: DefaultCourtCaseSchema,
      }
    case SET_SELECTED_COURT_CASE:
      return {
        ...state,
        isForceFetch: false,
        selectedCourtCase: action.selectedCourtCase,
      }
    case COURT_CASE_NOTE_SUCCESS:
    case FORM_CREATE_SUCCESS:
    case FORM_UPDATE_SUCCESS:
    case FORM_DELETE_SUCCESS:
      return {
        ...state,
        isForceFetch: true,
        selectedCourtCase: DefaultCourtCaseSchema,
      }
    case COURT_CASES_UNMOUNT:
      return {
        ...state,
        isForceFetch: true,
        selectedCourtCase: DefaultCourtCaseSchema,
      }
    default:
      return state
  }
}