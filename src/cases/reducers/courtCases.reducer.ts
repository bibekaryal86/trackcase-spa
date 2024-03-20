import { FORM_CREATE_SUCCESS, FORM_DELETE_SUCCESS, FORM_UPDATE_SUCCESS } from '../../forms'
import {
  COURT_CASE_CREATE_SUCCESS,
  COURT_CASE_DELETE_SUCCESS,
  COURT_CASE_UPDATE_SUCCESS,
  COURT_CASES_READ_REQUEST,
  COURT_CASES_READ_SUCCESS,
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
  if (matchesRequest || action.type === COURT_CASES_READ_REQUEST) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  switch (action.type) {
    case COURT_CASES_READ_SUCCESS:
      return {
        ...state,
        isCloseModal: true,
        courtCases: action.courtCases,
      }
    case COURT_CASE_CREATE_SUCCESS:
    case COURT_CASE_UPDATE_SUCCESS:
    case COURT_CASE_DELETE_SUCCESS:
      return {
        isCloseModal: true,
        courtCases: [],
        selectedCourtCase: DefaultCourtCaseSchema,
      }
    case SET_SELECTED_COURT_CASE:
      return {
        ...state,
        selectedCourtCase: action.selectedCourtCase,
      }
    case FORM_CREATE_SUCCESS:
    case FORM_UPDATE_SUCCESS:
    case FORM_DELETE_SUCCESS:
      return {
        ...state,
        selectedCourtCase: DefaultCourtCaseSchema,
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
