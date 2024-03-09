import {
  CASE_TYPE_CREATE_SUCCESS,
  CASE_TYPE_DELETE_SUCCESS,
  CASE_TYPE_UPDATE_SUCCESS,
  CASE_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { CaseTypeAction, CaseTypeState } from '../types/refTypes.data.types'

export const DefaultCaseTypeState: CaseTypeState = {
  data: [],
}

export default function caseTypes(state = DefaultCaseTypeState, action: CaseTypeAction): CaseTypeState {
  switch (action.type) {
    case CASE_TYPES_RETRIEVE_SUCCESS:
      return {
        data: action.data,
      }
    case CASE_TYPE_CREATE_SUCCESS:
    case CASE_TYPE_UPDATE_SUCCESS:
    case CASE_TYPE_DELETE_SUCCESS:
      return {
        data: [], // so that it will fetch
      }
    default:
      return state
  }
}
