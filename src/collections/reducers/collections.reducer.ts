import { CASE_COLLECTIONS_READ_SUCCESS } from '../types/collections.action.types'
import { CollectionsAction, CollectionsState, DefaultCollectionsState } from '../types/collections.data.types'

export default function collections(state = DefaultCollectionsState, action: CollectionsAction): CollectionsState {
  const matchesSuccessCase = /^CASE_COLLECTIONS_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)
  const matchesSuccessCash = /^CASH_COLLECTIONS_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)

  if (matchesSuccessCase || matchesSuccessCash) {
    return {
      ...state,
      caseCollections: [],
      cashCollections: [],
    }
  }

  switch (action.type) {
    case CASE_COLLECTIONS_READ_SUCCESS:
      return {
        caseCollections: action.caseCollections,
        cashCollections: action.cashCollections,
        requestMetadata: action.requestMetadata,
      }
    default:
      return state
  }
}
