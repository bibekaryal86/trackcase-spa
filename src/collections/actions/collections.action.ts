import React from 'react'

import { Async, FetchOptions, getCurrency, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import {
  COLLECTION_TYPES,
  CREATE_SUCCESS,
  DELETE_SUCCESS,
  SOMETHING_WENT_WRONG,
  UPDATE_SUCCESS,
} from '../../constants'
import { SET_SELECTED_CASE_COLLECTION, SET_SELECTED_CASH_COLLECTION } from '../types/collections.action.types'
import {
  CaseCollectionResponse,
  CaseCollectionSchema,
  CashCollectionResponse,
  CashCollectionSchema,
} from '../types/collections.data.types'
import { isCaseCollection, validateCollection } from '../utils/collections.utils'

export const addCollection = (collection: CaseCollectionSchema | CashCollectionSchema, collectionType: string) => {
  const isCaseCollectionRequest = collectionType === COLLECTION_TYPES.CASE
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateCollection(collectionType, collection)
    if (validationErrors) {
      dispatch(collectionsFailure(`${collectionType}_CREATE_FAILURE`, validationErrors))
      return
    }

    dispatch(collectionsRequest(`${collectionType}_CREATE_REQUEST`))

    try {
      let collectionResponse: CaseCollectionResponse | CashCollectionResponse
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: getRequestBody(collection, isCaseCollectionRequest),
      }
      if (isCaseCollectionRequest) {
        const urlPath = getEndpoint(process.env.CASE_COLLECTION_CREATE_ENDPOINT as string)
        collectionResponse = (await Async.fetch(urlPath, options)) as CaseCollectionResponse
      } else {
        const urlPath = getEndpoint(process.env.CASH_COLLECTION_CREATE_ENDPOINT as string)
        collectionResponse = (await Async.fetch(urlPath, options)) as CashCollectionResponse
      }

      if (collectionResponse.detail) {
        dispatch(collectionsFailure(`${collectionType}_CREATE_FAILURE`, getErrMsg(collectionResponse.detail)))
      } else {
        dispatch(
          collectionsSuccess(`${collectionType}_CREATE_SUCCESS`, CREATE_SUCCESS(collectionType), collectionType, []),
        )
      }
    } catch (error) {
      console.log(`Add ${collectionType} Error: `, error)
      dispatch(collectionsFailure(`${collectionType}_CREATE_FAILURE`, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(collectionsComplete(`${collectionType}S_COMPLETE`))
    }
  }
}

export const getCollections = (collectionType: string, isForceFetch: boolean = false) => {
  const isCaseCollectionRequest = isCaseCollection(collectionType)
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(collectionsRequest(`${collectionType}S_RETRIEVE_REQUEST`))

    try {
      let collectionResponse: CaseCollectionResponse | CashCollectionResponse
      const options: Partial<FetchOptions> = {
        method: 'GET',
      }

      if (isCaseCollectionRequest) {
        options['extraParams'] = {
          isIncludeExtra: true,
        }
      }

      const collectionsInStore: CaseCollectionSchema[] | CashCollectionSchema[] = isCaseCollectionRequest
        ? getStore().collections.caseCollections
        : getStore().collections.cashCollections

      if (isForceFetch || collectionsInStore.length === 0) {
        if (isCaseCollectionRequest) {
          const urlPath = getEndpoint(process.env.CASE_COLLECTIONS_RETRIEVE_ENDPOINT as string)
          collectionResponse = (await Async.fetch(urlPath, options)) as CaseCollectionResponse
        } else {
          const urlPath = getEndpoint(process.env.CASH_COLLECTIONS_RETRIEVE_ENDPOINT as string)
          collectionResponse = (await Async.fetch(urlPath, options)) as CashCollectionResponse
        }

        if (collectionResponse.detail) {
          dispatch(collectionsFailure(`${collectionType}S_RETRIEVE_FAILURE`, getErrMsg(collectionResponse.detail)))
        } else {
          const collections =
            'caseCollections' in collectionResponse
              ? collectionResponse.caseCollections
              : collectionResponse.cashCollections
          dispatch(collectionsSuccess(`${collectionType}S_RETRIEVE_SUCCESS`, '', collectionType, collections))
        }
      } else {
        dispatch(collectionsSuccess(`${collectionType}S_RETRIEVE_SUCCESS`, '', collectionType, collectionsInStore))
      }
    } catch (error) {
      console.log(`Get ${collectionType}S Error: `, error)
      dispatch(collectionsFailure(`${collectionType}S_RETRIEVE_FAILURE`, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(collectionsComplete(`${collectionType}S_COMPLETE`))
    }
  }
}

export const getOneCollection = async (collectionId: number, collectionType: string) => {
  const isCaseCollectionRequest = isCaseCollection(collectionType)
  try {
    let urlPath: string
    const options: Partial<FetchOptions> = {
      method: 'GET',
      extraParams: {
        isIncludeExtra: true,
        isIncludeHistory: true,
      },
    }

    if (isCaseCollectionRequest) {
      urlPath = getEndpoint(process.env.CASE_COLLECTION_RETRIEVE_ENDPOINT as string)
      options['pathParams'] = { case_collection_id: collectionId }
    } else {
      urlPath = getEndpoint(process.env.CASH_COLLECTION_RETRIEVE_ENDPOINT as string)
      options['pathParams'] = { cash_collection_id: collectionId }
    }

    return Async.fetch(urlPath, options)
  } catch (error) {
    console.log(`Get One ${collectionType} Error: `, error)
    const errorResponse: CaseCollectionResponse | CashCollectionResponse = {
      caseCollections: [],
      cashCollections: [],
      detail: { error: error as string },
    }
    return Promise.resolve(errorResponse)
  }
}

export const getCollection = (collectionId: number, collectionType: string) => {
  const isCaseCollectionRequest = isCaseCollection(collectionType)
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(collectionsRequest(`${collectionType}_RETRIEVE_REQUEST`))

    // call api, if it fails fallback to store
    try {
      let collectionResponse: CaseCollectionResponse | CashCollectionResponse
      if (isCaseCollectionRequest) {
        collectionResponse = (await getOneCollection(collectionId, collectionType)) as CaseCollectionResponse
      } else {
        collectionResponse = (await getOneCollection(collectionId, collectionType)) as CashCollectionResponse
      }

      if (collectionResponse.detail) {
        dispatch(collectionsFailure(`${collectionType}_RETRIEVE_FAILURE`, getErrMsg(collectionResponse.detail)))
        setSelectedCollectionFromStore(getStore(), dispatch, collectionId, collectionType)
      } else {
        const collection: CaseCollectionSchema | CashCollectionSchema =
          'caseCollections' in collectionResponse
            ? collectionResponse.caseCollections[0]
            : collectionResponse.cashCollections[0]
        dispatch(collectionSelect(collection, collectionType))
      }
    } finally {
      dispatch(collectionsComplete(`${collectionType}S_COMPLETE`))
    }
  }
}

export const editCollection = (
  id: number,
  collectionType: string,
  collection: CaseCollectionSchema | CashCollectionSchema,
) => {
  const isCaseCollectionRequest = isCaseCollection(collectionType)
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateCollection(collectionType, collection)
    if (validationErrors) {
      dispatch(collectionsFailure(`${collectionType}_UPDATE_FAILURE`, validationErrors))
      return
    }

    dispatch(collectionsRequest(`${collectionType}_UPDATE_REQUEST`))

    try {
      let collectionResponse: CaseCollectionResponse | CashCollectionResponse
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        requestBody: getRequestBody(collection, isCaseCollectionRequest),
      }
      if (isCaseCollectionRequest) {
        const urlPath = getEndpoint(process.env.CASE_COLLECTION_UPDATE_ENDPOINT as string)
        options['pathParams'] = { case_collection_id: id }
        collectionResponse = (await Async.fetch(urlPath, options)) as CaseCollectionResponse
      } else {
        const urlPath = getEndpoint(process.env.CASH_COLLECTION_UPDATE_ENDPOINT as string)
        options['pathParams'] = { cash_collection_id: id }
        collectionResponse = (await Async.fetch(urlPath, options)) as CashCollectionResponse
      }

      if (collectionResponse.detail) {
        dispatch(collectionsFailure(`${collectionType}_UPDATE_FAILURE`, getErrMsg(collectionResponse.detail)))
      } else {
        dispatch(
          collectionsSuccess(`${collectionType}_UPDATE_SUCCESS`, UPDATE_SUCCESS(collectionType), collectionType, []),
        )
      }
    } catch (error) {
      console.log(`Edit ${collectionType} Error: `, error)
      dispatch(collectionsFailure(`${collectionType}_UPDATE_FAILURE`, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(collectionsComplete(`${collectionType}S_COMPLETE`))
    }
  }
}

export const deleteCollection = (id: number, collectionType: string) => {
  const isCaseCollectionRequest = isCaseCollection(collectionType)
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(collectionsRequest(`${collectionType}_DELETE_REQUEST`))

    try {
      let collectionResponse: CaseCollectionResponse | CashCollectionResponse
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
      }

      if (isCaseCollectionRequest) {
        const urlPath = getEndpoint(process.env.CASE_COLLECTION_DELETE_ENDPOINT as string)
        options['pathParams'] = { case_collection_id: id }
        collectionResponse = (await Async.fetch(urlPath, options)) as CaseCollectionResponse
      } else {
        const urlPath = getEndpoint(process.env.CASH_COLLECTION_DELETE_ENDPOINT as string)
        options['pathParams'] = { cash_collection_id: id }
        collectionResponse = (await Async.fetch(urlPath, options)) as CashCollectionResponse
      }

      if (collectionResponse.detail) {
        dispatch(collectionsFailure(`${collectionType}_DELETE_FAILURE`, getErrMsg(collectionResponse.detail)))
      } else {
        dispatch(
          collectionsSuccess(`${collectionType}_DELETE_SUCCESS`, DELETE_SUCCESS(collectionType), collectionType, []),
        )
      }
    } catch (error) {
      console.log(`Delete ${collectionType} Error: `, error)
      dispatch(collectionsFailure(`${collectionType}_DELETE_FAILURE`, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(collectionsComplete(`${collectionType}S_COMPLETE`))
    }
  }
}

const collectionsRequest = (type: string) => ({
  type: type,
})

const collectionsSuccess = (
  type: string,
  success: string,
  collectionType: string,
  collections: CaseCollectionSchema[] | CashCollectionSchema[],
) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else if (collectionType === COLLECTION_TYPES.CASE) {
    return {
      type: type,
      caseCollections: collections,
    }
  } else if (collectionType === COLLECTION_TYPES.CASH) {
    return {
      type: type,
      cashCollections: collections,
    }
  } else {
    return collectionsFailure(type, 'Something went wrong! Went from Success to failure!!')
  }
}

const collectionsFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const collectionsComplete = (type: string) => ({
  type: type,
})

const collectionSelect = (selectedCollection: CaseCollectionSchema | CashCollectionSchema, collectionType: string) => ({
  type: isCaseCollection(collectionType) ? SET_SELECTED_CASE_COLLECTION : SET_SELECTED_CASH_COLLECTION,
  selectedCollection,
})

const setSelectedCollectionFromStore = (
  store: GlobalState,
  dispatch: React.Dispatch<GlobalDispatch>,
  collectionId: number,
  collectionType: string,
) => {
  const collectionsInStore: CaseCollectionSchema[] | CashCollectionSchema[] = isCaseCollection(collectionType)
    ? store.collections.caseCollections
    : store.collections.cashCollections
  const collectionInStore: CaseCollectionSchema | CashCollectionSchema | undefined = collectionsInStore.find(
    (collection) => collection.id === collectionId,
  )
  if (collectionInStore) {
    dispatch(collectionSelect(collectionInStore, collectionType))
  }
}

const getRequestBody = (collection: CaseCollectionSchema | CashCollectionSchema, isCaseCollectionRequest: boolean) => {
  return {
    // case collection
    status: isCaseCollectionRequest && 'status' in collection ? collection.status : undefined,
    comments: isCaseCollectionRequest && 'comments' in collection ? collection.comments : undefined,
    court_case_id: isCaseCollectionRequest && 'courtCaseId' in collection ? collection.courtCaseId : undefined,
    quote_amount:
      isCaseCollectionRequest && 'quoteAmount' in collection
        ? getCurrency(collection.quoteAmount, false, true)
        : undefined,
    // cash collection
    collection_date: !isCaseCollectionRequest && 'collectionDate' in collection ? collection.collectionDate : undefined,
    collectedAmount:
      !isCaseCollectionRequest && 'collectedAmount' in collection
        ? getCurrency(collection.collectedAmount, false, true)
        : undefined,
    waivedAmount:
      !isCaseCollectionRequest && 'waivedAmount' in collection
        ? getCurrency(collection.waivedAmount, false, true)
        : undefined,
    memo: !isCaseCollectionRequest && 'memo' in collection ? collection.memo : undefined,
    case_collection_id:
      !isCaseCollectionRequest && 'caseCollectionId' in collection ? collection.caseCollectionId : undefined,
    collection_method_id:
      !isCaseCollectionRequest && 'collectionMethodId' in collection ? collection.collectionMethodId : undefined,
  }
}
