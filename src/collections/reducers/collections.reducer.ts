import {
  CASE_COLLECTIONS_RETRIEVE_REQUEST,
  CASE_COLLECTIONS_RETRIEVE_SUCCESS,
  CASE_COLLECTIONS_UNMOUNT,
  CASH_COLLECTIONS_RETRIEVE_REQUEST,
  CASH_COLLECTIONS_UNMOUNT,
  COLLECTIONS_UNMOUNT,
  SET_SELECTED_CASE_COLLECTION,
  SET_SELECTED_CASH_COLLECTION,
} from '../types/collections.action.types'
import {
  CollectionsAction,
  CollectionsState,
  DefaultCaseCollectionSchema,
  DefaultCashCollectionSchema,
  DefaultCollectionsState,
} from '../types/collections.data.types'
import { getCashCollections } from '../utils/collections.utils'

export default function collections(state = DefaultCollectionsState, action: CollectionsAction): CollectionsState {
  const matchesRequestCase = /^CASE_COLLECTION_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  const matchesRequestCash = /^CASH_COLLECTION_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  if (
    matchesRequestCase ||
    matchesRequestCash ||
    [CASE_COLLECTIONS_RETRIEVE_REQUEST, CASH_COLLECTIONS_RETRIEVE_REQUEST].includes(action.type)
  ) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  const matchesSuccessCase = /^CASE_COLLECTION_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)
  const matchesSuccessCash = /^CASH_COLLECTION_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)

  if (matchesSuccessCase || matchesSuccessCash) {
    return {
      isCloseModal: true,
      caseCollections: [],
      cashCollections: [],
      selectedCaseCollection: DefaultCaseCollectionSchema,
      selectedCashCollection: DefaultCashCollectionSchema,
    }
  }

  switch (action.type) {
    case CASE_COLLECTIONS_RETRIEVE_SUCCESS:
      return {
        ...state,
        isCloseModal: true,
        caseCollections: action.caseCollections,
        cashCollections: getCashCollections(action.caseCollections),
      }
    case SET_SELECTED_CASE_COLLECTION:
      return {
        ...state,
        selectedCaseCollection: action.selectedCaseCollection,
      }
    case SET_SELECTED_CASH_COLLECTION:
      return {
        ...state,
        selectedCashCollection: action.selectedCashCollection,
      }
    case CASE_COLLECTIONS_UNMOUNT:
    case CASH_COLLECTIONS_UNMOUNT:
    case COLLECTIONS_UNMOUNT:
      return {
        ...state,
        selectedCaseCollection: DefaultCaseCollectionSchema,
        selectedCashCollection: DefaultCashCollectionSchema,
      }
    default:
      return state
  }
}
