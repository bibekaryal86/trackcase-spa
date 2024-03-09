import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  FILING_TYPE_CREATE_FAILURE,
  FILING_TYPE_CREATE_REQUEST,
  FILING_TYPE_CREATE_SUCCESS,
  FILING_TYPE_DELETE_FAILURE,
  FILING_TYPE_DELETE_REQUEST,
  FILING_TYPE_DELETE_SUCCESS,
  FILING_TYPE_RETRIEVE_REQUEST,
  FILING_TYPE_UPDATE_FAILURE,
  FILING_TYPE_UPDATE_REQUEST,
  FILING_TYPE_UPDATE_SUCCESS,
  FILING_TYPES_COMPLETE,
  FILING_TYPES_RETRIEVE_FAILURE,
  FILING_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { FilingTypeResponse, FilingTypeSchema } from '../types/refTypes.data.types'

export const addFilingType = (name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(filingTypesRequest(FILING_TYPE_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FILING_TYPE_CREATE as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: {
          name,
          description,
        },
      }

      const filingTypeResponse = (await Async.fetch(urlPath, options)) as FilingTypeResponse

      if (filingTypeResponse.detail) {
        dispatch(filingTypesFailure(FILING_TYPE_CREATE_FAILURE, getErrMsg(filingTypeResponse.detail)))
      } else {
        dispatch(filingTypesSuccess(FILING_TYPE_CREATE_SUCCESS, CREATE_SUCCESS('Filing Type'), []))
      }
    } catch (error) {
      console.log('Add FilingTypes Error: ', error)
      dispatch(filingTypesFailure(FILING_TYPE_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(filingTypesComplete())
    }
  }
}

export const getFilingType = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(filingTypesRequest(FILING_TYPE_RETRIEVE_REQUEST))

    try {
      let filingTypeResponse: FilingTypeResponse
      const filingTypesInStore: FilingTypeSchema[] = getStore().filingTypes.data

      if (isForceFetch || filingTypesInStore.length === 0) {
        const urlPath = getEndpoint(process.env.FILING_TYPE_READ as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        filingTypeResponse = (await Async.fetch(urlPath, options)) as FilingTypeResponse

        if (filingTypeResponse.detail) {
          dispatch(filingTypesFailure(FILING_TYPES_RETRIEVE_FAILURE, getErrMsg(filingTypeResponse.detail)))
        } else {
          dispatch(filingTypesSuccess(FILING_TYPES_RETRIEVE_SUCCESS, '', filingTypeResponse.data))
        }
      } else {
        dispatch(filingTypesSuccess(FILING_TYPES_RETRIEVE_SUCCESS, '', filingTypesInStore))
      }
    } catch (error) {
      console.log('Get FilingTypes Error: ', error)
      dispatch(filingTypesFailure(FILING_TYPES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(filingTypesComplete())
    }
  }
}

export const editFilingType = (id: number, name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(filingTypesRequest(FILING_TYPE_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FILING_TYPE_UPDATE as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { filing_type_id: id },
        requestBody: {
          name,
          description,
        },
      }

      const filingTypeResponse = (await Async.fetch(urlPath, options)) as FilingTypeResponse

      if (filingTypeResponse.detail) {
        dispatch(filingTypesFailure(FILING_TYPE_UPDATE_FAILURE, getErrMsg(filingTypeResponse.detail)))
      } else {
        dispatch(filingTypesSuccess(FILING_TYPE_UPDATE_SUCCESS, UPDATE_SUCCESS('Filing Type'), []))
      }
    } catch (error) {
      console.log('Edit FilingTypes Error: ', error)
      dispatch(filingTypesFailure(FILING_TYPE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(filingTypesComplete())
    }
  }
}

export const deleteFilingType = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(filingTypesRequest(FILING_TYPE_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FILING_TYPE_DELETE as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { filing_type_id: id },
      }

      const filingTypeResponse = (await Async.fetch(urlPath, options)) as FilingTypeResponse

      if (filingTypeResponse.detail) {
        dispatch(filingTypesFailure(FILING_TYPE_DELETE_FAILURE, getErrMsg(filingTypeResponse.detail)))
      } else {
        dispatch(filingTypesSuccess(FILING_TYPE_DELETE_SUCCESS, DELETE_SUCCESS('Filing Type'), []))
      }
    } catch (error) {
      console.log('Delete FilingTypes Error: ', error)
      dispatch(filingTypesFailure(FILING_TYPE_DELETE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(filingTypesComplete())
    }
  }
}

const filingTypesRequest = (type: string) => ({
  type: type,
})

const filingTypesSuccess = (type: string, success: string, filingTypes: FilingTypeSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      filingTypes: filingTypes,
    }
  }
}

const filingTypesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const filingTypesComplete = () => ({
  type: FILING_TYPES_COMPLETE,
})
