import React from 'react'

import {
  CASE_TYPES_COMPLETE,
  CASE_TYPES_RETRIEVE_REQUEST,
  CASE_TYPES_RETRIEVE_SUCCESS,
  CaseTypeSchema,
  COLLECTION_METHODS_COMPLETE,
  COLLECTION_METHODS_RETRIEVE_REQUEST,
  COLLECTION_METHODS_RETRIEVE_SUCCESS,
  CollectionMethodSchema,
  FORM_TYPES_COMPLETE,
  FORM_TYPES_RETRIEVE_REQUEST,
  FORM_TYPES_RETRIEVE_SUCCESS,
  FormTypeSchema,
  HEARING_TYPES_COMPLETE,
  HEARING_TYPES_RETRIEVE_REQUEST,
  HEARING_TYPES_RETRIEVE_SUCCESS,
  HearingTypeSchema,
  TASK_TYPES_COMPLETE,
  TASK_TYPES_RETRIEVE_REQUEST,
  TASK_TYPES_RETRIEVE_SUCCESS,
  TaskTypeSchema,
} from '../../types'
import { GlobalDispatch, GlobalState } from '../store/redux'
import { STATUSES_COMPLETE, STATUSES_RETRIEVE_SUCCESS } from '../types/app.action.types'
import { AllRefTypesSchema, StatusSchema } from '../types/app.data.types'
import { getEndpoint } from '../utils/app.utils'
import { Async, FetchOptions } from '../utils/fetch.utils'

export const getAllRefTypes = () => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(allRefTypesRequest(CASE_TYPES_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(COLLECTION_METHODS_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(FORM_TYPES_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(HEARING_TYPES_RETRIEVE_REQUEST))
    dispatch(allRefTypesRequest(TASK_TYPES_RETRIEVE_REQUEST))

    try {
      const requestComponents: string[] = []

      if (getStore().statuses.statuses.court.all?.length === 0) {
        requestComponents.push('statuses')
      }
      if (getStore().caseTypes.caseTypes.length === 0) {
        requestComponents.push('case_types')
      }
      if (getStore().collectionMethods.collectionMethods.length === 0) {
        requestComponents.push('collection_methods')
      }
      if (getStore().formTypes.formTypes.length === 0) {
        requestComponents.push('form_types')
      }
      if (getStore().hearingTypes.hearingTypes.length === 0) {
        requestComponents.push('hearing_types')
      }
      if (getStore().taskTypes.taskTypes.length === 0) {
        requestComponents.push('task_types')
      }

      if (requestComponents.length > 0) {
        const urlPath = getEndpoint(process.env.ALL_REF_TYPES_ENDPOINT as string, false)
        const options: Partial<FetchOptions> = {
          method: 'GET',
          queryParams: {
            components: requestComponents.join(','),
          },
        }
        const allRefTypes = (await Async.fetch(urlPath, options)) as AllRefTypesSchema

        if (allRefTypes.statuses) {
          dispatch(allRefTypesSuccess(STATUSES_RETRIEVE_SUCCESS, 'statuses', allRefTypes.statuses))
        }
        if (allRefTypes.case_types?.length) {
          dispatch(allRefTypesSuccess(CASE_TYPES_RETRIEVE_SUCCESS, 'caseTypes', allRefTypes.case_types))
        }
        if (allRefTypes.collection_methods?.length) {
          dispatch(
            allRefTypesSuccess(
              COLLECTION_METHODS_RETRIEVE_SUCCESS,
              'collectionMethods',
              allRefTypes.collection_methods,
            ),
          )
        }
        if (allRefTypes.form_types?.length) {
          dispatch(allRefTypesSuccess(FORM_TYPES_RETRIEVE_SUCCESS, 'formTypes', allRefTypes.form_types))
        }
        if (allRefTypes.hearing_types?.length) {
          dispatch(allRefTypesSuccess(HEARING_TYPES_RETRIEVE_SUCCESS, 'hearingTypes', allRefTypes.hearing_types))
        }
        if (allRefTypes.task_types?.length) {
          dispatch(allRefTypesSuccess(TASK_TYPES_RETRIEVE_SUCCESS, 'taskTypes', allRefTypes.task_types))
        }
      }
    } catch (error) {
      console.log('Get All Ref Types Error: ', error)
      // do not dispatch error, when needed dispatched from their respective action components
    } finally {
      dispatch(allRefTypesComplete(STATUSES_COMPLETE))
      dispatch(allRefTypesComplete(CASE_TYPES_COMPLETE))
      dispatch(allRefTypesComplete(COLLECTION_METHODS_COMPLETE))
      dispatch(allRefTypesComplete(FORM_TYPES_COMPLETE))
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
  ref_type: string,
  ref_types:
    | StatusSchema<string>
    | CaseTypeSchema[]
    | CollectionMethodSchema[]
    | FormTypeSchema[]
    | HearingTypeSchema[]
    | TaskTypeSchema[],
) => ({
  type: type,
  [ref_type]: ref_types,
})

const allRefTypesComplete = (type: string) => ({
  type: type,
})
