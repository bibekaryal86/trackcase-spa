import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  HEARING_TYPE_CREATE_FAILURE,
  HEARING_TYPE_CREATE_REQUEST,
  HEARING_TYPE_CREATE_SUCCESS,
  HEARING_TYPE_DELETE_FAILURE,
  HEARING_TYPE_DELETE_REQUEST,
  HEARING_TYPE_DELETE_SUCCESS,
  HEARING_TYPE_UPDATE_FAILURE,
  HEARING_TYPE_UPDATE_REQUEST,
  HEARING_TYPE_UPDATE_SUCCESS,
  HEARING_TYPES_COMPLETE,
  HEARING_TYPES_RETRIEVE_FAILURE,
  HEARING_TYPES_RETRIEVE_REQUEST,
  HEARING_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { HearingTypeResponse, HearingTypeSchema } from '../types/refTypes.data.types'

export const addHearingType = (name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(hearingTypesRequest(HEARING_TYPE_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.HEARING_TYPE_CREATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: {
          name,
          description,
        },
      }

      const hearingTypeResponse = (await Async.fetch(urlPath, options)) as HearingTypeResponse

      if (hearingTypeResponse.detail) {
        dispatch(hearingTypesFailure(HEARING_TYPE_CREATE_FAILURE, getErrMsg(hearingTypeResponse.detail)))
      } else {
        dispatch(hearingTypesSuccess(HEARING_TYPE_CREATE_SUCCESS, CREATE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Add HearingType Error: ', error)
      dispatch(hearingTypesFailure(HEARING_TYPE_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(hearingTypesComplete())
    }
  }
}

export const getHearingTypes = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(hearingTypesRequest(HEARING_TYPES_RETRIEVE_REQUEST))

    try {
      let hearingTypeResponse: HearingTypeResponse
      const hearingTypesInStore: HearingTypeSchema[] = getStore().hearingTypes.hearingTypes

      if (isForceFetch || hearingTypesInStore.length === 0) {
        const urlPath = getEndpoint(process.env.HEARING_TYPES_RETRIEVE_ENDPOINT as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        hearingTypeResponse = (await Async.fetch(urlPath, options)) as HearingTypeResponse

        if (hearingTypeResponse.detail) {
          dispatch(hearingTypesFailure(HEARING_TYPES_RETRIEVE_FAILURE, getErrMsg(hearingTypeResponse.detail)))
        } else {
          dispatch(hearingTypesSuccess(HEARING_TYPES_RETRIEVE_SUCCESS, '', hearingTypeResponse.hearingTypes))
        }
      } else {
        hearingTypeResponse = {
          hearingTypes: hearingTypesInStore,
        }
        dispatch(hearingTypesSuccess(HEARING_TYPES_RETRIEVE_SUCCESS, '', hearingTypeResponse.hearingTypes))
      }
    } catch (error) {
      console.log('Get HearingTypes Error: ', error)
      dispatch(hearingTypesFailure(HEARING_TYPES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(hearingTypesComplete())
    }
  }
}

export const editHearingType = (id: number, name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(hearingTypesRequest(HEARING_TYPE_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.HEARING_TYPE_UPDATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { hearing_type_id: id },
        requestBody: {
          name,
          description,
        },
      }

      const hearingTypeResponse = (await Async.fetch(urlPath, options)) as HearingTypeResponse

      if (hearingTypeResponse.detail) {
        dispatch(hearingTypesFailure(HEARING_TYPE_UPDATE_FAILURE, getErrMsg(hearingTypeResponse.detail)))
      } else {
        dispatch(hearingTypesSuccess(HEARING_TYPE_UPDATE_SUCCESS, UPDATE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Edit HearingType Error: ', error)
      dispatch(hearingTypesFailure(HEARING_TYPE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(hearingTypesComplete())
    }
  }
}

export const deleteHearingType = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(hearingTypesRequest(HEARING_TYPE_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.HEARING_TYPE_DELETE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { hearing_type_id: id },
      }

      const hearingTypeResponse = (await Async.fetch(urlPath, options)) as HearingTypeResponse

      if (hearingTypeResponse.detail) {
        dispatch(hearingTypesFailure(HEARING_TYPE_DELETE_FAILURE, getErrMsg(hearingTypeResponse.detail)))
      } else {
        dispatch(hearingTypesSuccess(HEARING_TYPE_DELETE_SUCCESS, DELETE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Delete HearingType Error: ', error)
      dispatch(hearingTypesFailure(HEARING_TYPE_DELETE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(hearingTypesComplete())
    }
  }
}

const hearingTypesRequest = (type: string) => ({
  type: type,
})

const hearingTypesSuccess = (type: string, success: string, hearingTypes: HearingTypeSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      hearingTypes: hearingTypes,
    }
  }
}

const hearingTypesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const hearingTypesComplete = () => ({
  type: HEARING_TYPES_COMPLETE,
})
