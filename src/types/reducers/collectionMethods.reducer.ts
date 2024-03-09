import {
  COLLECTION_METHOD_CREATE_SUCCESS,
  COLLECTION_METHOD_DELETE_SUCCESS,
  COLLECTION_METHOD_UPDATE_SUCCESS,
  COLLECTION_METHODS_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { CollectionMethodAction, CollectionMethodState } from '../types/refTypes.data.types'

export const DefaultCollectionMethodState: CollectionMethodState = {
  data: [],
}

export default function collectionMethods(
  state = DefaultCollectionMethodState,
  action: CollectionMethodAction,
): CollectionMethodState {
  switch (action.type) {
    case COLLECTION_METHODS_RETRIEVE_SUCCESS:
      return {
        data: action.data,
      }
    case COLLECTION_METHOD_CREATE_SUCCESS:
    case COLLECTION_METHOD_UPDATE_SUCCESS:
    case COLLECTION_METHOD_DELETE_SUCCESS:
      return {
        data: [], // so that it will fetch
      }
    default:
      return state
  }
}
