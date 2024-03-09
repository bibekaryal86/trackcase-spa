import React from 'react'

import { Async, FetchOptions, getEndpoint, GlobalDispatch, GlobalState } from '../../app'
import {
  CASE_TYPES_COMPLETE,
  CASE_TYPES_RETRIEVE_REQUEST,
  CASE_TYPES_RETRIEVE_SUCCESS,
  CaseTypeSchema,
  COLLECTION_METHODS_COMPLETE,
  COLLECTION_METHODS_RETRIEVE_REQUEST,
  COLLECTION_METHODS_RETRIEVE_SUCCESS,
  CollectionMethodSchema,
  COMPONENT_STATUSES_COMPLETE,
  COMPONENT_STATUSES_RETRIEVE_REQUEST,
  COMPONENT_STATUSES_RETRIEVE_SUCCESS,
  ComponentStatusSchema,
  FILING_TYPE_RETRIEVE_REQUEST,
  FILING_TYPES_COMPLETE,
  FILING_TYPES_RETRIEVE_SUCCESS,
  FilingTypeSchema,
  HEARING_TYPES_COMPLETE,
  HEARING_TYPES_RETRIEVE_REQUEST,
  HEARING_TYPES_RETRIEVE_SUCCESS,
  HearingTypeSchema,
  TASK_TYPES_COMPLETE,
  TASK_TYPES_RETRIEVE_REQUEST,
  TASK_TYPES_RETRIEVE_SUCCESS,
  TaskTypeSchema,
} from '../../types'
import { RefTypesResponse } from '../types/refTypes.data.types'

export const getRefTypes = () => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(allRefTypesRequest(COMPONENT_STATUSES_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(CASE_TYPES_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(COLLECTION_METHODS_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(FILING_TYPE_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(HEARING_TYPES_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(TASK_TYPES_RETRIEVE_REQUEST))

    try {
      const requestComponents: string[] = []

      if (getStore().componentStatuses.data.length === 0) {
        requestComponents.push('component_status')
      }
      if (getStore().caseTypes.data.length === 0) {
        requestComponents.push('case_type')
      }
      if (getStore().collectionMethods.data.length === 0) {
        requestComponents.push('collection_method')
      }
      if (getStore().filingTypes.data.length === 0) {
        requestComponents.push('filing_type')
      }
      if (getStore().hearingTypes.data.length === 0) {
        requestComponents.push('hearing_type')
      }
      if (getStore().taskTypes.data.length === 0) {
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
            allRefTypesSuccess(
              COMPONENT_STATUSES_RETRIEVE_SUCCESS,
              allRefTypes.data.componentStatuses.data,
            ),
          )
        }
        if (allRefTypes.data?.caseTypes?.data?.length) {
          dispatch(allRefTypesSuccess(CASE_TYPES_RETRIEVE_SUCCESS, allRefTypes.data.caseTypes.data))
        }
        if (allRefTypes.data?.collectionMethods?.data?.length) {
          dispatch(
            allRefTypesSuccess(
              COLLECTION_METHODS_RETRIEVE_SUCCESS,
              allRefTypes.data.collectionMethods.data,
            ),
          )
        }
        if (allRefTypes.data?.filingTypes?.data?.length) {
          dispatch(allRefTypesSuccess(FILING_TYPES_RETRIEVE_SUCCESS, allRefTypes.data.filingTypes.data))
        }
        if (allRefTypes.data?.hearingTypes?.data?.length) {
          dispatch(allRefTypesSuccess(HEARING_TYPES_RETRIEVE_SUCCESS, allRefTypes.data.hearingTypes.data))
        }
        if (allRefTypes.data?.taskTypes?.data?.length) {
          dispatch(allRefTypesSuccess(TASK_TYPES_RETRIEVE_SUCCESS, allRefTypes.data.taskTypes.data))
        }
      }
    } catch (error) {
      console.log('Get All Ref Types Error: ', error)
      // do not dispatch error, when needed dispatched from their respective action components
    } finally {
      dispatch(allRefTypesComplete(COMPONENT_STATUSES_COMPLETE))
      dispatch(allRefTypesComplete(CASE_TYPES_COMPLETE))
      dispatch(allRefTypesComplete(COLLECTION_METHODS_COMPLETE))
      dispatch(allRefTypesComplete(FILING_TYPES_COMPLETE))
      dispatch(allRefTypesComplete(HEARING_TYPES_COMPLETE))
      dispatch(allRefTypesComplete(TASK_TYPES_COMPLETE))
    }
  }
}

const allRefTypesRequest = (type: string) => ({
  type: type,
})

const allRefTypesSuccess = (
  type: string,
  ref_types:
    | ComponentStatusSchema[]
    | CaseTypeSchema[]
    | CollectionMethodSchema[]
    | FilingTypeSchema[]
    | HearingTypeSchema[]
    | TaskTypeSchema[],
) => ({
  type: type,
  data: ref_types,
})

const allRefTypesComplete = (type: string) => ({
  type: type,
})
