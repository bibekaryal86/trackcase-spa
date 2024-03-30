import {
  FILINGS_CREATE_SUCCESS,
  FILINGS_DELETE_SUCCESS,
  FILINGS_READ_SUCCESS,
  FILINGS_UPDATE_SUCCESS,
} from '../types/filings.action.types'
import { DefaultFilingState, FilingsAction, FilingsState } from '../types/filings.data.types'

export default function filings(state = DefaultFilingState, action: FilingsAction): FilingsState {
  switch (action.type) {
    case FILINGS_READ_SUCCESS:
      return {
        filings: action.filings,
        requestMetadata: action.requestMetadata,
      }
    case FILINGS_CREATE_SUCCESS:
    case FILINGS_UPDATE_SUCCESS:
    case FILINGS_DELETE_SUCCESS:
      return {
        ...state,
        filings: [],
      }
    default:
      return state
  }
}
