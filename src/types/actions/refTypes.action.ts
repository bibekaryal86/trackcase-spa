import _ from 'lodash'
import React from 'react'

import {
  Async,
  convertToCamelCase,
  FetchOptions,
  FetchRequestMetadata,
  getEndpoint,
  getErrMsg,
  GlobalDispatch,
  GlobalState,
} from '../../app'
import {
  CREATE_SUCCESS,
  REF_TYPES_REGISTRY,
  RefTypesRegistry,
  SOMETHING_WENT_WRONG,
  UPDATE_SUCCESS,
} from '../../constants'
import {
  CASE_TYPE_COMPLETE,
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
import {
  RefTypeResponse,
  RefTypeSchema,
  RefTypesRequestMetadataState,
  RefTypesResponse,
} from '../types/refTypes.data.types'
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

      if (getStore().refTypes.componentStatus.length === 0) {
        requestComponents.push('component_status')
      }
      if (getStore().refTypes.caseType.length === 0) {
        requestComponents.push('case_type')
      }
      if (getStore().refTypes.collectionMethod.length === 0) {
        requestComponents.push('collection_method')
      }
      if (getStore().refTypes.filingType.length === 0) {
        requestComponents.push('filing_type')
      }
      if (getStore().refTypes.hearingType.length === 0) {
        requestComponents.push('hearing_type')
      }
      if (getStore().refTypes.taskType.length === 0) {
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
          dispatch(
            refTypesDispatch({
              type: COLLECTION_METHOD_RETRIEVE_SUCCESS,
              data: allRefTypes.data.collectionMethods.data,
            }),
          )
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

export const addRefType = (refType: RefTypesRegistry, name: string, description: string, isActive?: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<RefTypeResponse> => {
    dispatch(refTypesDispatch({ type: `${refType}_CREATE_REQUEST` }))

    try {
      const urlPath = getUrlPath(refType, 'CREATE')
      let requestBody
      if (refType === REF_TYPES_REGISTRY.COMPONENT_STATUS) {
        requestBody = {
          componentName: name,
          statusName: description,
          isActive: isActive,
        }
      } else {
        requestBody = {
          name,
          description,
        }
      }
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: requestBody,
      }
      const refTypeResponse = (await Async.fetch(urlPath, options)) as RefTypeResponse

      if (refTypeResponse.detail) {
        dispatch(refTypesDispatch({ type: `${refType}_CREATE_FAILURE`, error: getErrMsg(refTypeResponse.detail) }))
      } else {
        dispatch(refTypesDispatch({ type: `${refType}_CREATE_SUCCESS`, success: CREATE_SUCCESS(refType) }))
      }
      return refTypeResponse
    } catch (error) {
      console.log(`Add ${refType} Error: `, error)
      dispatch(refTypesDispatch({ type: `${refType}_CREATE_FAILURE`, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(refTypesDispatch({ type: `${refType}_COMPLETE` }))
    }
  }
}

export const getRefType = (refType: RefTypesRegistry, requestMetadata?: Partial<FetchRequestMetadata>) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(refTypesDispatch({ type: `${refType}_RETRIEVE_REQUEST` }))

    try {
      let refTypeList: RefTypeSchema[] = []
      const refTypeInStoreName = convertToCamelCase(refType, '_') as keyof RefTypesReduxStoreKeys

      let isRequestMetadataSame = false
      let updatedRequestMetadataState = [] as RefTypesRequestMetadataState[]
      const requestMetadataState: RefTypesRequestMetadataState[] = getStore().refTypes.requestMetadataState

      if (requestMetadata) {
        if (requestMetadataState && requestMetadataState.length) {
          updatedRequestMetadataState = [...requestMetadataState]
          const index = requestMetadataState.findIndex((x) => x.refType === refType)
          if (index !== -1) {
            const requestMetadataInStore = updatedRequestMetadataState[index]
            isRequestMetadataSame = _.isEqual(requestMetadata, requestMetadataInStore.requestMetadata)
            if (!isRequestMetadataSame) {
              updatedRequestMetadataState[index] = {
                ...updatedRequestMetadataState[index],
                requestMetadata: requestMetadata,
              }
            }
          } else {
            updatedRequestMetadataState.push({
              refType,
              requestMetadata,
            })
          }
        } else {
          updatedRequestMetadataState.push({
            refType,
            requestMetadata,
          })
        }
      } else {
        updatedRequestMetadataState = [...requestMetadataState]
      }

      if (
        isRequestMetadataSame &&
        getStore().refTypes[refTypeInStoreName] &&
        getStore().refTypes[refTypeInStoreName].length > 0
      ) {
        refTypeList = getStore().refTypes[refTypeInStoreName]
      }

      if (refTypeList.length === 0) {
        const urlPath = getUrlPath(refType, 'READ')
        const options: Partial<FetchOptions> = {
          method: 'GET',
          metadataParams: requestMetadata,
        }
        const refTypeResponse = (await Async.fetch(urlPath, options)) as RefTypeResponse
        refTypeList = refTypeResponse?.data || []
      }

      dispatch(
        refTypesDispatch({
          type: `${refType}_RETRIEVE_SUCCESS`,
          data: refTypeList,
          metadata: updatedRequestMetadataState,
        }),
      )
    } catch (error) {
      console.log(`Get ${refType} Error: `, error)
      dispatch(refTypesDispatch({ type: `${refType}_RETRIEVE_FAILURE`, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(refTypesDispatch({ type: `${refType}_COMPLETE` }))
    }
  }
}

export const editRefType = (
  refType: RefTypesRegistry,
  id: number,
  name: string,
  description: string,
  isActive?: boolean,
  isRestore?: boolean,
) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<RefTypeResponse> => {
    dispatch(refTypesDispatch({ type: `${refType}_UPDATE_REQUEST` }))

    try {
      const refTypeId = `${refType}_ID`.toLowerCase()
      const urlPath = getUrlPath(refType, 'UPDATE')
      let requestBody
      if (refType === REF_TYPES_REGISTRY.COMPONENT_STATUS) {
        requestBody = {
          componentName: name,
          statusName: description,
          isActive: isActive,
        }
      } else {
        requestBody = {
          name,
          description,
        }
      }
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        queryParams: { is_restore: isRestore || false },
        pathParams: { [refTypeId]: id },
        requestBody: requestBody,
      }
      const refTypeResponse = (await Async.fetch(urlPath, options)) as RefTypeResponse
      if (refTypeResponse.detail) {
        dispatch(refTypesDispatch({ type: `${refType}_UPDATE_FAILURE`, error: getErrMsg(refTypeResponse.detail) }))
      } else {
        dispatch(refTypesDispatch({ type: `${refType}_UPDATE_SUCCESS`, success: UPDATE_SUCCESS(refType) }))
      }
      return refTypeResponse
    } catch (error) {
      console.log(`Edit ${refType} Error: `, error)
      dispatch(refTypesDispatch({ type: `${refType}_UPDATE_FAILURE`, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(refTypesDispatch({ type: `${refType}_COMPLETE` }))
    }
  }
}

export const deleteRefType = (refType: RefTypesRegistry, id: number, isHardDelete: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<RefTypeResponse> => {
    dispatch(refTypesDispatch({ type: `${refType}_DELETE_REQUEST` }))

    try {
      const refTypeId = `${refType}_ID`.toLowerCase()
      const urlPath = getUrlPath(refType, 'DELETE')
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { [refTypeId]: id, is_hard_delete: isHardDelete },
      }
      const refTypeResponse = (await Async.fetch(urlPath, options)) as RefTypeResponse
      if (refTypeResponse.detail) {
        dispatch(refTypesDispatch({ type: `${refType}_DELETE_FAILURE`, error: getErrMsg(refTypeResponse.detail) }))
      } else {
        dispatch(refTypesDispatch({ type: `${refType}_DELETE_SUCCESS`, success: UPDATE_SUCCESS(refType) }))
      }
      return refTypeResponse
    } catch (error) {
      console.log(`Delete ${refType} Error: `, error)
      dispatch(refTypesDispatch({ type: `${refType}_DELETE_FAILURE`, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(refTypesDispatch({ type: `${refType}_COMPLETE` }))
    }
  }
}

// could not make `process.env[variableNameForEndpoint] work when running locally
// hence this workaround
const getUrlPath = (refType: RefTypesRegistry, action: string) => {
  if (refType === REF_TYPES_REGISTRY.COMPONENT_STATUS) {
    if (action === 'CREATE') {
      return getEndpoint(process.env.COMPONENT_STATUS_CREATE as string)
    }
    if (action === 'READ') {
      return getEndpoint(process.env.COMPONENT_STATUS_READ as string)
    }
    if (action === 'UPDATE') {
      return getEndpoint(process.env.COMPONENT_STATUS_UPDATE as string)
    }
    if (action === 'DELETE') {
      return getEndpoint(process.env.COMPONENT_STATUS_DELETE as string)
    }
  }
  if (refType === REF_TYPES_REGISTRY.CASE_TYPE) {
    if (action === 'CREATE') {
      return getEndpoint(process.env.CASE_TYPE_CREATE as string)
    }
    if (action === 'READ') {
      return getEndpoint(process.env.CASE_TYPE_READ as string)
    }
    if (action === 'UPDATE') {
      return getEndpoint(process.env.CASE_TYPE_UPDATE as string)
    }
    if (action === 'DELETE') {
      return getEndpoint(process.env.CASE_TYPE_DELETE as string)
    }
  }
  if (refType === REF_TYPES_REGISTRY.COLLECTION_METHOD) {
    if (action === 'CREATE') {
      return getEndpoint(process.env.COLLECTION_METHOD_CREATE as string)
    }
    if (action === 'READ') {
      return getEndpoint(process.env.COLLECTION_METHOD_READ as string)
    }
    if (action === 'UPDATE') {
      return getEndpoint(process.env.COLLECTION_METHOD_UPDATE as string)
    }
    if (action === 'DELETE') {
      return getEndpoint(process.env.COLLECTION_METHOD_DELETE as string)
    }
  }
  if (refType === REF_TYPES_REGISTRY.FILING_TYPE) {
    if (action === 'CREATE') {
      return getEndpoint(process.env.FILING_TYPE_CREATE as string)
    }
    if (action === 'READ') {
      return getEndpoint(process.env.FILING_TYPE_READ as string)
    }
    if (action === 'UPDATE') {
      return getEndpoint(process.env.FILING_TYPE_UPDATE as string)
    }
    if (action === 'DELETE') {
      return getEndpoint(process.env.FILING_TYPE_DELETE as string)
    }
  }
  if (refType === REF_TYPES_REGISTRY.HEARING_TYPE) {
    if (action === 'CREATE') {
      return getEndpoint(process.env.HEARING_TYPE_CREATE as string)
    }
    if (action === 'READ') {
      return getEndpoint(process.env.HEARING_TYPE_READ as string)
    }
    if (action === 'UPDATE') {
      return getEndpoint(process.env.HEARING_TYPE_UPDATE as string)
    }
    if (action === 'DELETE') {
      return getEndpoint(process.env.HEARING_TYPE_DELETE as string)
    }
  }
  if (refType === REF_TYPES_REGISTRY.TASK_TYPE) {
    if (action === 'CREATE') {
      return getEndpoint(process.env.TASK_TYPE_CREATE as string)
    }
    if (action === 'READ') {
      return getEndpoint(process.env.TASK_TYPE_READ as string)
    }
    if (action === 'UPDATE') {
      return getEndpoint(process.env.TASK_TYPE_UPDATE as string)
    }
    if (action === 'DELETE') {
      return getEndpoint(process.env.TASK_TYPE_DELETE as string)
    }
  }
  return 'something_went_wrong'
}
