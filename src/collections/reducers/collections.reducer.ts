import { CASE_COLLECTIONS_READ_SUCCESS } from '@collections/types/collections.action.types.ts'
import {
  CollectionsAction,
  CollectionsState,
  DefaultCollectionsState,
} from '@collections/types/collections.data.types.ts'

export default function collections(state = DefaultCollectionsState, action: CollectionsAction): CollectionsState {
  const matchesSuccessCase = /^CASE_COLLECTIONS_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)
  const matchesSuccessCash = /^CASH_COLLECTIONS_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)

  if (matchesSuccessCase || matchesSuccessCash) {
    return {
      ...state,
      caseCollections: [],
    }
  }

  switch (action.type) {
    case CASE_COLLECTIONS_READ_SUCCESS:
      return {
        caseCollections: action.caseCollections,
        requestMetadata: action.requestMetadata,
      }
    default:
      return state
  }
}
