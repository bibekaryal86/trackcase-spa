import {
  COLLECTION_METHOD_CREATE_SUCCESS,
  COLLECTION_METHOD_DELETE_SUCCESS,
  COLLECTION_METHOD_UPDATE_SUCCESS,
  COLLECTION_METHODS_RETRIEVE_SUCCESS,
} from '../types/ref_types.action.types'
import { CollectionMethodAction, CollectionMethodState } from '../types/ref_types.data.types'

export const DefaultCollectionMethodState: CollectionMethodState = {
  collection_methods: [],
}

export default function collectionMethods(
  state = DefaultCollectionMethodState,
  action: CollectionMethodAction,
): CollectionMethodState {
  switch (action.type) {
    case COLLECTION_METHODS_RETRIEVE_SUCCESS:
      return {
        collection_methods: action.collection_methods,
      }
    case COLLECTION_METHOD_CREATE_SUCCESS:
    case COLLECTION_METHOD_UPDATE_SUCCESS:
    case COLLECTION_METHOD_DELETE_SUCCESS:
      return {
        collection_methods: [], // so that it will fetch
      }
    default:
      return state
  }
}
