import React from 'react'

import {
  ACTION_SUCCESS,
  ACTION_TYPES,
  ActionTypes,
  COLLECTION_TYPES,
  HTTP_METHODS,
  ID_DEFAULT,
  SOMETHING_WENT_WRONG,
  TYPE_IS_INCORRECT,
  TYPE_IS_MISSING,
} from '@constants/index'

import {
  Async,
  FetchOptions,
  FetchRequestMetadata,
  getEndpoint,
  getErrMsg,
  GlobalDispatch,
  GlobalState,
} from '../../app'
import {
  CASE_COLLECTIONS_COMPLETE,
  CASE_COLLECTIONS_READ_FAILURE,
  CASE_COLLECTIONS_READ_REQUEST,
  CASE_COLLECTIONS_READ_SUCCESS,
  CASH_COLLECTIONS_COMPLETE,
  CASH_COLLECTIONS_READ_FAILURE,
  CASH_COLLECTIONS_READ_REQUEST,
} from '../types/collections.action.types'
import {
  CaseCollectionBase,
  CaseCollectionResponse,
  CaseCollectionSchema,
  CashCollectionBase,
  CashCollectionResponse,
  CashCollectionSchema,
} from '../types/collections.data.types'
import { checkCorrectCollectionTypes, collectionDispatch } from '../utils/collections.utils'

export const collectionsAction = ({
  type,
  action,
  collectionsRequest,
  id,
  isRestore,
  isHardDelete,
}: {
  type?: string
  action: ActionTypes
  collectionsRequest?: CaseCollectionBase | CashCollectionBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<CaseCollectionResponse | CashCollectionResponse> => {
    if (!type) {
      return { data: [], detail: { error: TYPE_IS_MISSING } }
    } else if (!checkCorrectCollectionTypes(type)) {
      return { data: [], detail: { error: TYPE_IS_INCORRECT } }
    }
    if (action === ACTION_TYPES.RESTORE) {
      action = ACTION_TYPES.UPDATE
    }
    const typeRequest = `${type}S_${action}_REQUEST`
    const typeSuccess = `${type}S_${action}_SUCCESS`
    const typeFailure = `${type}S_${action}_FAILURE`
    const typeComplete = `${type}S_COMPLETE`
    dispatch(collectionDispatch({ type: typeRequest }))

    let endpoint = ''
    let options: Partial<FetchOptions> = {}

    if (action === ACTION_TYPES.CREATE) {
      endpoint =
        type === COLLECTION_TYPES.CASE_COLLECTION
          ? getEndpoint(process.env.COLLECTION_CASE_CREATE as string)
          : getEndpoint(process.env.COLLECTION_CASH_CREATE as string)
      options = {
        method: HTTP_METHODS.POST,
        requestBody: { ...collectionsRequest },
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint =
        type === COLLECTION_TYPES.CASE_COLLECTION
          ? getEndpoint(process.env.COLLECTION_CASE_UPDATE as string)
          : getEndpoint(process.env.COLLECTION_CASH_UPDATE as string)
      options = {
        method: HTTP_METHODS.PUT,
        requestBody: collectionsRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { collection_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint =
        type === COLLECTION_TYPES.CASE_COLLECTION
          ? getEndpoint(process.env.COLLECTION_CASE_DELETE as string)
          : getEndpoint(process.env.COLLECTION_CASH_DELETE as string)
      options = {
        method: HTTP_METHODS.DELETE,
        pathParams: { collection_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    try {
      const collectionResponse = (await Async.fetch(endpoint, options)) as
        | CaseCollectionResponse
        | CashCollectionResponse
      if (collectionResponse.detail) {
        dispatch(collectionDispatch({ type: typeFailure, error: getErrMsg(collectionResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          dispatch(
            collectionDispatch({
              type: typeSuccess,
              caseCollections: collectionResponse.data as CaseCollectionSchema[],
            }),
          )
        } else {
          dispatch(collectionDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'COLLECTION') }))
        }
      }
      return collectionResponse
    } catch (error) {
      console.log(`${type} ${action} Error: `, error)
      dispatch(collectionDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(collectionDispatch({ type: typeComplete }))
    }
  }
}

export const getCollections = (requestMetadata?: Partial<FetchRequestMetadata>) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(collectionDispatch({ type: CASE_COLLECTIONS_READ_REQUEST }))

    let collectionResponse: CaseCollectionResponse = { data: [] }

    if (requestMetadata === getStore().collections.requestMetadata) {
      // no need to fetch request, metadata is same
      collectionResponse.data = getStore().collections.caseCollections
    }
    const endpoint = getEndpoint(process.env.COLLECTION_CASE_READ as string)
    const options: Partial<FetchOptions> = {
      method: HTTP_METHODS.GET,
      metadataParams: requestMetadata,
    }

    try {
      if (collectionResponse.data.length <= 0) {
        collectionResponse = (await Async.fetch(endpoint, options)) as CaseCollectionResponse
      }
      if (collectionResponse.detail) {
        dispatch(
          collectionDispatch({ type: CASE_COLLECTIONS_READ_FAILURE, error: getErrMsg(collectionResponse.detail) }),
        )
      } else {
        dispatch(
          collectionDispatch({
            type: CASE_COLLECTIONS_READ_SUCCESS,
            caseCollections: collectionResponse.data,
            requestMetadata: requestMetadata,
          }),
        )
      }
    } catch (error) {
      console.log(`Get Collections Error: `, error)
      dispatch(collectionDispatch({ type: CASE_COLLECTIONS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(collectionDispatch({ type: CASE_COLLECTIONS_COMPLETE }))
    }
  }
}

export const getCaseCollection = (collectionId: number, isIncludeExtra?: boolean) => {
  return async (
    dispatch: React.Dispatch<GlobalDispatch>,
    state: GlobalState,
  ): Promise<CaseCollectionSchema | undefined> => {
    dispatch(collectionDispatch({ type: CASE_COLLECTIONS_READ_REQUEST }))
    let oneCaseCollection = undefined

    try {
      const caseCollectionsInStore = state.collections.caseCollections
      if (caseCollectionsInStore) {
        oneCaseCollection = caseCollectionsInStore.find((x) => x.id === collectionId)

        if (
          isIncludeExtra &&
          oneCaseCollection &&
          (!oneCaseCollection.cashCollections || !oneCaseCollection.cashCollections.length)
        ) {
          oneCaseCollection = undefined
        }
      }

      if (oneCaseCollection) {
        return oneCaseCollection
      } else {
        const endpoint = getEndpoint(process.env.COLLECTION_CASE_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: collectionId,
          isIncludeExtra: isIncludeExtra === true,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const caseCollectionResponse = (await Async.fetch(endpoint, options)) as CaseCollectionResponse
        if (caseCollectionResponse.detail) {
          dispatch(
            collectionDispatch({
              type: CASE_COLLECTIONS_READ_FAILURE,
              error: getErrMsg(caseCollectionResponse.detail),
            }),
          )
        } else {
          oneCaseCollection = caseCollectionResponse.data.find((x) => x.id === collectionId)
        }
      }
      return oneCaseCollection
    } catch (error) {
      console.log(`Get Case Collection Error: `, error)
      dispatch(collectionDispatch({ type: CASE_COLLECTIONS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneCaseCollection
    } finally {
      dispatch(collectionDispatch({ type: CASE_COLLECTIONS_COMPLETE }))
    }
  }
}

export const getCashCollection = (collectionId: number, isIncludeExtra?: boolean) => {
  return async (
    dispatch: React.Dispatch<GlobalDispatch>,
    state: GlobalState,
  ): Promise<CashCollectionSchema | undefined> => {
    dispatch(collectionDispatch({ type: CASH_COLLECTIONS_READ_REQUEST }))
    let oneCashCollection = undefined

    try {
      const caseCollectionsInStore = state.collections.caseCollections

      const cashCollectionsInStore = caseCollectionsInStore.flatMap((collection) => collection.cashCollections || [])
      if (cashCollectionsInStore) {
        oneCashCollection = cashCollectionsInStore.find((x) => x.id === collectionId)
      }

      if (oneCashCollection) {
        return oneCashCollection
      } else {
        const endpoint = getEndpoint(process.env.COLLECTION_CASH_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: collectionId,
          isIncludeExtra: isIncludeExtra === true,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const cashCollectionResponse = (await Async.fetch(endpoint, options)) as CashCollectionResponse
        if (cashCollectionResponse.detail) {
          dispatch(
            collectionDispatch({
              type: CASH_COLLECTIONS_READ_FAILURE,
              error: getErrMsg(cashCollectionResponse.detail),
            }),
          )
        } else {
          oneCashCollection = cashCollectionResponse.data.find((x) => x.id === collectionId)
        }
      }
      return oneCashCollection
    } catch (error) {
      console.log(`Get Cash Collection Error: `, error)
      dispatch(collectionDispatch({ type: CASH_COLLECTIONS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneCashCollection
    } finally {
      dispatch(collectionDispatch({ type: CASH_COLLECTIONS_COMPLETE }))
    }
  }
}
