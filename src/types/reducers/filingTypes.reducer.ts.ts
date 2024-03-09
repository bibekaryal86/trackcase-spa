import {
  FILING_TYPE_CREATE_SUCCESS,
  FILING_TYPE_DELETE_SUCCESS,
  FILING_TYPE_UPDATE_SUCCESS,
  FILING_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { FilingTypeState, FormTypeAction } from '../types/refTypes.data.types'

export const DefaultFilingTypeState: FilingTypeState = {
  data: [],
}

export default function filingTypes(state = DefaultFilingTypeState, action: FormTypeAction): FilingTypeState {
  switch (action.type) {
    case FILING_TYPES_RETRIEVE_SUCCESS:
      return {
        data: action.data,
      }
    case FILING_TYPE_CREATE_SUCCESS:
    case FILING_TYPE_UPDATE_SUCCESS:
    case FILING_TYPE_DELETE_SUCCESS:
      return {
        data: [], // so that it will fetch
      }
    default:
      return state
  }
}
