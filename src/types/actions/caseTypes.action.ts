import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  CASE_TYPE_CREATE_FAILURE,
  CASE_TYPE_CREATE_REQUEST,
  CASE_TYPE_CREATE_SUCCESS,
  CASE_TYPE_DELETE_FAILURE,
  CASE_TYPE_DELETE_REQUEST,
  CASE_TYPE_DELETE_SUCCESS,
  CASE_TYPE_UPDATE_FAILURE,
  CASE_TYPE_UPDATE_REQUEST,
  CASE_TYPE_UPDATE_SUCCESS,
  CASE_TYPES_COMPLETE,
  CASE_TYPES_RETRIEVE_FAILURE,
  CASE_TYPES_RETRIEVE_REQUEST,
  CASE_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { CaseTypeResponse, CaseTypeSchema } from '../types/refTypes.data.types'

export const addCaseType = (name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(caseTypesRequest(CASE_TYPE_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.CASE_TYPE_CREATE as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: {
          name,
          description,
        },
      }

      const caseTypeResponse = (await Async.fetch(urlPath, options)) as CaseTypeResponse

      if (caseTypeResponse.detail) {
        dispatch(caseTypesFailure(CASE_TYPE_CREATE_FAILURE, getErrMsg(caseTypeResponse.detail)))
      } else {
        dispatch(caseTypesSuccess(CASE_TYPE_CREATE_SUCCESS, CREATE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Add CaseType Error: ', error)
      dispatch(caseTypesFailure(CASE_TYPE_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(caseTypesComplete())
    }
  }
}

export const getCaseTypes = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(caseTypesRequest(CASE_TYPES_RETRIEVE_REQUEST))

    try {
      let caseTypeResponse: CaseTypeResponse
      const caseTypesInStore: CaseTypeSchema[] = getStore().caseTypes.data

      if (isForceFetch || caseTypesInStore.length === 0) {
        const urlPath = getEndpoint(process.env.CASE_TYPE_READ as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        caseTypeResponse = (await Async.fetch(urlPath, options)) as CaseTypeResponse

        if (caseTypeResponse.detail) {
          dispatch(caseTypesFailure(CASE_TYPES_RETRIEVE_FAILURE, getErrMsg(caseTypeResponse.detail)))
        } else {
          dispatch(caseTypesSuccess(CASE_TYPES_RETRIEVE_SUCCESS, '', caseTypeResponse.data))
        }
      } else {
        dispatch(caseTypesSuccess(CASE_TYPES_RETRIEVE_SUCCESS, '', caseTypesInStore))
      }
    } catch (error) {
      console.log('Get CaseTypes Error: ', error)
      dispatch(caseTypesFailure(CASE_TYPES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(caseTypesComplete())
    }
  }
}

export const editCaseType = (id: number, name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(caseTypesRequest(CASE_TYPE_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.CASE_TYPE_UPDATE as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { case_type_id: id },
        requestBody: {
          name,
          description,
        },
      }

      const caseTypeResponse = (await Async.fetch(urlPath, options)) as CaseTypeResponse

      if (caseTypeResponse.detail) {
        dispatch(caseTypesFailure(CASE_TYPE_UPDATE_FAILURE, getErrMsg(caseTypeResponse.detail)))
      } else {
        dispatch(caseTypesSuccess(CASE_TYPE_UPDATE_SUCCESS, UPDATE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Edit CaseType Error: ', error)
      dispatch(caseTypesFailure(CASE_TYPE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(caseTypesComplete())
    }
  }
}

export const deleteCaseType = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(caseTypesRequest(CASE_TYPE_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.CASE_TYPE_DELETE as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { case_type_id: id },
      }

      const caseTypeResponse = (await Async.fetch(urlPath, options)) as CaseTypeResponse

      if (caseTypeResponse.detail) {
        dispatch(caseTypesFailure(CASE_TYPE_DELETE_FAILURE, getErrMsg(caseTypeResponse.detail)))
      } else {
        dispatch(caseTypesSuccess(CASE_TYPE_DELETE_SUCCESS, DELETE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Delete CaseType Error: ', error)
      dispatch(caseTypesFailure(CASE_TYPE_DELETE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(caseTypesComplete())
    }
  }
}

const caseTypesRequest = (type: string) => ({
  type: type,
})

const caseTypesSuccess = (type: string, success: string, caseTypes: CaseTypeSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      caseTypes: caseTypes,
    }
  }
}

const caseTypesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const caseTypesComplete = () => ({
  type: CASE_TYPES_COMPLETE,
})
