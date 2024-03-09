import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  COLLECTION_METHOD_CREATE_FAILURE,
  COLLECTION_METHOD_CREATE_REQUEST,
  COLLECTION_METHOD_CREATE_SUCCESS,
  COLLECTION_METHOD_DELETE_FAILURE,
  COLLECTION_METHOD_DELETE_REQUEST,
  COLLECTION_METHOD_DELETE_SUCCESS,
  COLLECTION_METHOD_UPDATE_FAILURE,
  COLLECTION_METHOD_UPDATE_REQUEST,
  COLLECTION_METHOD_UPDATE_SUCCESS,
  COLLECTION_METHODS_COMPLETE,
  COLLECTION_METHODS_RETRIEVE_FAILURE,
  COLLECTION_METHODS_RETRIEVE_REQUEST,
  COLLECTION_METHODS_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { CollectionMethodResponse, CollectionMethodSchema } from '../types/refTypes.data.types'

export const addCollectionMethod = (name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(collectionMethodsRequest(COLLECTION_METHOD_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COLLECTION_METHOD_CREATE as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: {
          name,
          description,
        },
      }

      const collectionMethodResponse = (await Async.fetch(urlPath, options)) as CollectionMethodResponse

      if (collectionMethodResponse.detail) {
        dispatch(collectionMethodsFailure(COLLECTION_METHOD_CREATE_FAILURE, getErrMsg(collectionMethodResponse.detail)))
      } else {
        dispatch(collectionMethodsSuccess(COLLECTION_METHOD_CREATE_SUCCESS, CREATE_SUCCESS('Collection Method'), []))
      }
    } catch (error) {
      console.log('Add CollectionMethod Error: ', error)
      dispatch(collectionMethodsFailure(COLLECTION_METHOD_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(collectionMethodsComplete())
    }
  }
}

export const getCollectionMethods = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(collectionMethodsRequest(COLLECTION_METHODS_RETRIEVE_REQUEST))

    try {
      let collectionMethodResponse: CollectionMethodResponse
      const collectionMethodsInStore: CollectionMethodSchema[] = getStore().collectionMethods.data

      if (isForceFetch || collectionMethodsInStore.length === 0) {
        const urlPath = getEndpoint(process.env.COLLECTION_METHOD_READ as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        collectionMethodResponse = (await Async.fetch(urlPath, options)) as CollectionMethodResponse

        if (collectionMethodResponse.detail) {
          dispatch(
            collectionMethodsFailure(COLLECTION_METHODS_RETRIEVE_FAILURE, getErrMsg(collectionMethodResponse.detail)),
          )
        } else {
          dispatch(collectionMethodsSuccess(COLLECTION_METHODS_RETRIEVE_SUCCESS, '', collectionMethodResponse.data))
        }
      } else {
        dispatch(collectionMethodsSuccess(COLLECTION_METHODS_RETRIEVE_SUCCESS, '', collectionMethodsInStore))
      }
    } catch (error) {
      console.log('Get CollectionMethods Error: ', error)
      dispatch(collectionMethodsFailure(COLLECTION_METHODS_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(collectionMethodsComplete())
    }
  }
}

export const editCollectionMethod = (id: number, name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(collectionMethodsRequest(COLLECTION_METHOD_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COLLECTION_METHOD_UPDATE as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { collection_method_id: id },
        requestBody: {
          name,
          description,
        },
      }

      const collectionMethodResponse = (await Async.fetch(urlPath, options)) as CollectionMethodResponse

      if (collectionMethodResponse.detail) {
        dispatch(collectionMethodsFailure(COLLECTION_METHOD_UPDATE_FAILURE, getErrMsg(collectionMethodResponse.detail)))
      } else {
        dispatch(collectionMethodsSuccess(COLLECTION_METHOD_UPDATE_SUCCESS, UPDATE_SUCCESS('Collection Method'), []))
      }
    } catch (error) {
      console.log('Edit CollectionMethod Error: ', error)
      dispatch(collectionMethodsFailure(COLLECTION_METHOD_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(collectionMethodsComplete())
    }
  }
}

export const deleteCollectionMethod = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(collectionMethodsRequest(COLLECTION_METHOD_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COLLECTION_METHOD_DELETE as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { collection_method_id: id },
      }

      const collectionMethodResponse = (await Async.fetch(urlPath, options)) as CollectionMethodResponse

      if (collectionMethodResponse.detail) {
        dispatch(collectionMethodsFailure(COLLECTION_METHOD_DELETE_FAILURE, getErrMsg(collectionMethodResponse.detail)))
      } else {
        dispatch(collectionMethodsSuccess(COLLECTION_METHOD_DELETE_SUCCESS, DELETE_SUCCESS('Collection Method'), []))
      }
    } catch (error) {
      console.log('Delete CollectionMethod Error: ', error)
      dispatch(collectionMethodsFailure(COLLECTION_METHOD_DELETE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(collectionMethodsComplete())
    }
  }
}

const collectionMethodsRequest = (type: string) => ({
  type: type,
})

const collectionMethodsSuccess = (type: string, success: string, collectionMethods: CollectionMethodSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      collectionMethods: collectionMethods,
    }
  }
}

const collectionMethodsFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const collectionMethodsComplete = () => ({
  type: COLLECTION_METHODS_COMPLETE,
})
