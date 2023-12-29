import {
  CASE_TYPE_CREATE_SUCCESS,
  CASE_TYPE_DELETE_SUCCESS,
  CASE_TYPE_UPDATE_SUCCESS,
  CASE_TYPES_RETRIEVE_SUCCESS,
} from '../types/ref_types.action.types'
import { CaseTypeAction, CaseTypeState } from '../types/ref_types.data.types'

export const DefaultCaseTypeState: CaseTypeState = {
  case_types: [],
}

export default function caseTypes(state = DefaultCaseTypeState, action: CaseTypeAction): CaseTypeState {
  switch (action.type) {
    case CASE_TYPES_RETRIEVE_SUCCESS:
      return {
        case_types: action.case_types,
      }
    case CASE_TYPE_CREATE_SUCCESS:
    case CASE_TYPE_UPDATE_SUCCESS:
    case CASE_TYPE_DELETE_SUCCESS:
      return {
        case_types: [], // so that it will fetch
      }
    default:
      return state
  }
}
