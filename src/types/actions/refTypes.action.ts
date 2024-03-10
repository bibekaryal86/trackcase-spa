import React from 'react'

import { Async, convertToCamelCase, FetchOptions, getEndpoint, GlobalDispatch, GlobalState } from '../../app'
import { RefTypeRegistry, SOMETHING_WENT_WRONG } from '../../constants'
import {
  CASE_TYPE_COMPLETE,
  CASE_TYPE_RETRIEVE_FAILURE,
  CASE_TYPE_RETRIEVE_REQUEST,
  CASE_TYPE_RETRIEVE_SUCCESS,
  COLLECTION_METHOD_COMPLETE,
  COLLECTION_METHOD_RETRIEVE_REQUEST,
  COLLECTION_METHOD_RETRIEVE_SUCCESS,
  COMPONENT_STATUS_COMPLETE,
  COMPONENT_STATUS_RETRIEVE_REQUEST,
  COMPONENT_STATUS_RETRIEVE_SUCCESS,
  FILING_TYPE_COMPLETE,
  FILING_TYPE_RETRIEVE_REQUEST,
  FILING_TYPE_RETRIEVE_SUCCESS,
  HEARING_TYPE_COMPLETE,
  HEARING_TYPE_RETRIEVE_REQUEST,
  HEARING_TYPE_RETRIEVE_SUCCESS,
  TASK_TYPE_COMPLETE,
  TASK_TYPE_RETRIEVE_REQUEST,
  TASK_TYPE_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { RefTypeResponse, RefTypesResponse } from '../types/refTypes.data.types'
import { refTypesDispatch, RefTypesReduxStoreKeys } from '../utils/refTypes.utils'

export const getRefTypes = () => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(refTypesDispatch({ type: COMPONENT_STATUS_RETRIEVE_REQUEST }))
    dispatch(refTypesDispatch({ type: CASE_TYPE_RETRIEVE_REQUEST }))
    dispatch(refTypesDispatch({ type: COLLECTION_METHOD_RETRIEVE_REQUEST }))
    dispatch(refTypesDispatch({ type: FILING_TYPE_RETRIEVE_REQUEST }))
    dispatch(refTypesDispatch({ type: HEARING_TYPE_RETRIEVE_REQUEST }))
    dispatch(refTypesDispatch({ type: TASK_TYPE_RETRIEVE_REQUEST }))

    try {
      const requestComponents: string[] = []

      if (getStore().componentStatus.data.length === 0) {
        requestComponents.push('component_status')
      }
      if (getStore().caseType.data.length === 0) {
        requestComponents.push('case_type')
      }
      if (getStore().collectionMethod.data.length === 0) {
        requestComponents.push('collection_method')
      }
      if (getStore().filingType.data.length === 0) {
        requestComponents.push('filing_type')
      }
      if (getStore().hearingType.data.length === 0) {
        requestComponents.push('hearing_type')
      }
      if (getStore().taskType.data.length === 0) {
        requestComponents.push('task_type')
      }

      if (requestComponents.length > 0) {
        const urlPath = getEndpoint(process.env.REF_TYPES as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
          queryParams: {
            components: requestComponents.join(','),
          },
        }
        const allRefTypes = (await Async.fetch(urlPath, options)) as RefTypesResponse

        if (allRefTypes.data?.componentStatuses?.data?.length) {
          dispatch(
            refTypesDispatch({
              type: COMPONENT_STATUS_RETRIEVE_SUCCESS,
              data: allRefTypes.data.componentStatuses.data,
            }),
          )
        }
        if (allRefTypes.data?.caseTypes?.data?.length) {
          dispatch(refTypesDispatch({ type: CASE_TYPE_RETRIEVE_SUCCESS, data: allRefTypes.data.caseTypes.data }))
        }
        if (allRefTypes.data?.collectionMethods?.data?.length) {
          dispatch(refTypesDispatch({ type: COLLECTION_METHOD_RETRIEVE_SUCCESS, data: allRefTypes.data.collectionMethods.data }))
        }
        if (allRefTypes.data?.filingTypes?.data?.length) {
          dispatch(refTypesDispatch({ type: FILING_TYPE_RETRIEVE_SUCCESS, data: allRefTypes.data.filingTypes.data }))
        }
        if (allRefTypes.data?.hearingTypes?.data?.length) {
          dispatch(refTypesDispatch({ type: HEARING_TYPE_RETRIEVE_SUCCESS, data: allRefTypes.data.hearingTypes.data }))
        }
        if (allRefTypes.data?.taskTypes?.data?.length) {
          dispatch(refTypesDispatch({ type: TASK_TYPE_RETRIEVE_SUCCESS, data: allRefTypes.data.taskTypes.data }))
        }
      }
    } catch (error) {
      console.log('Get Ref Types Error: ', error)
      // do not dispatch error, when needed dispatched from their respective action components
    } finally {
      dispatch(refTypesDispatch({ type: COMPONENT_STATUS_COMPLETE }))
      dispatch(refTypesDispatch({ type: CASE_TYPE_COMPLETE }))
      dispatch(refTypesDispatch({ type: COLLECTION_METHOD_COMPLETE }))
      dispatch(refTypesDispatch({ type: FILING_TYPE_COMPLETE }))
      dispatch(refTypesDispatch({ type: HEARING_TYPE_COMPLETE }))
      dispatch(refTypesDispatch({ type: TASK_TYPE_COMPLETE }))
    }
  }
}

export const getRefType = (refType: RefTypeRegistry) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(refTypesDispatch({type: `${refType}_RETRIEVE_REQUEST`}))

    try {
      let refTypeList = []
      const refTypeInStoreName = convertToCamelCase(refType, '_') as keyof RefTypesReduxStoreKeys

      if (getStore()[refTypeInStoreName] && getStore()[refTypeInStoreName].data.length === 0) {
        refTypeList = getStore()[refTypeInStoreName].data
      }

      if (refTypeList.length < 0) {
        const endpointName = `${refType}_READ`
        const urlPath = getEndpoint(process.env[endpointName] as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }

        const refTypeResponse = (await Async.fetch(urlPath, options)) as RefTypeResponse
        refTypeList = refTypeResponse?.data || []
      }
    } catch (error) {
      console.log('Get Ref Types Error: ', error)
      dispatch(refTypesDispatch({ type: CASE_TYPE_RETRIEVE_FAILURE, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(refTypesDispatch({type: `${refType}_COMPLETE`}))
    }
  }
}
