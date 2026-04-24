import {
  COURT_CASES_CREATE_SUCCESS,
  COURT_CASES_DELETE_SUCCESS,
  COURT_CASES_READ_SUCCESS,
  COURT_CASES_UPDATE_SUCCESS,
} from '@cases/types/courtCases.action.types.ts'
import { CourtCasesAction, CourtCasesState, DefaultCourtCaseState } from '@cases/types/courtCases.data.types.ts'

export default function courtCases(state = DefaultCourtCaseState, action: CourtCasesAction): CourtCasesState {
  switch (action.type) {
    case COURT_CASES_READ_SUCCESS:
      return {
        courtCases: action.courtCases,
        requestMetadata: action.requestMetadata,
      }
    case COURT_CASES_CREATE_SUCCESS:
    case COURT_CASES_UPDATE_SUCCESS:
    case COURT_CASES_DELETE_SUCCESS:
      return {
        ...state,
        courtCases: [],
      }
    default:
      return state
  }
}
