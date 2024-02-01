import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  FORM_TYPE_CREATE_FAILURE,
  FORM_TYPE_CREATE_REQUEST,
  FORM_TYPE_CREATE_SUCCESS,
  FORM_TYPE_DELETE_FAILURE,
  FORM_TYPE_DELETE_REQUEST,
  FORM_TYPE_DELETE_SUCCESS,
  FORM_TYPE_UPDATE_FAILURE,
  FORM_TYPE_UPDATE_REQUEST,
  FORM_TYPE_UPDATE_SUCCESS,
  FORM_TYPES_COMPLETE,
  FORM_TYPES_RETRIEVE_FAILURE,
  FORM_TYPES_RETRIEVE_REQUEST,
  FORM_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { FormTypeResponse, FormTypeSchema } from '../types/refTypes.data.types'

export const addFormType = (name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(formTypesRequest(FORM_TYPE_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FORM_TYPE_CREATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: {
          name,
          description,
        },
      }

      const formTypeResponse = (await Async.fetch(urlPath, options)) as FormTypeResponse

      if (formTypeResponse.detail) {
        dispatch(formTypesFailure(FORM_TYPE_CREATE_FAILURE, getErrMsg(formTypeResponse.detail)))
      } else {
        dispatch(formTypesSuccess(FORM_TYPE_CREATE_SUCCESS, CREATE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Add FormTypes Error: ', error)
      dispatch(formTypesFailure(FORM_TYPE_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(formTypesComplete())
    }
  }
}

export const getFormTypes = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(formTypesRequest(FORM_TYPES_RETRIEVE_REQUEST))

    try {
      let formTypeResponse: FormTypeResponse
      const formTypesInStore: FormTypeSchema[] = getStore().formTypes.formTypes

      if (isForceFetch || formTypesInStore.length === 0) {
        const urlPath = getEndpoint(process.env.FORM_TYPES_RETRIEVE_ENDPOINT as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        formTypeResponse = (await Async.fetch(urlPath, options)) as FormTypeResponse

        if (formTypeResponse.detail) {
          dispatch(formTypesFailure(FORM_TYPES_RETRIEVE_FAILURE, getErrMsg(formTypeResponse.detail)))
        } else {
          dispatch(formTypesSuccess(FORM_TYPES_RETRIEVE_SUCCESS, '', formTypeResponse.formTypes))
        }
      } else {
        dispatch(formTypesSuccess(FORM_TYPES_RETRIEVE_SUCCESS, '', formTypesInStore))
      }
    } catch (error) {
      console.log('Get FormTypes Error: ', error)
      dispatch(formTypesFailure(FORM_TYPES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(formTypesComplete())
    }
  }
}

export const editFormType = (id: number, name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(formTypesRequest(FORM_TYPE_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FORM_TYPE_UPDATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { form_type_id: id },
        requestBody: {
          name,
          description,
        },
      }

      const formTypeResponse = (await Async.fetch(urlPath, options)) as FormTypeResponse

      if (formTypeResponse.detail) {
        dispatch(formTypesFailure(FORM_TYPE_UPDATE_FAILURE, getErrMsg(formTypeResponse.detail)))
      } else {
        dispatch(formTypesSuccess(FORM_TYPE_UPDATE_SUCCESS, UPDATE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Edit FormTypes Error: ', error)
      dispatch(formTypesFailure(FORM_TYPE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(formTypesComplete())
    }
  }
}

export const deleteFormType = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(formTypesRequest(FORM_TYPE_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FORM_TYPE_DELETE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { form_type_id: id },
      }

      const formTypeResponse = (await Async.fetch(urlPath, options)) as FormTypeResponse

      if (formTypeResponse.detail) {
        dispatch(formTypesFailure(FORM_TYPE_DELETE_FAILURE, getErrMsg(formTypeResponse.detail)))
      } else {
        dispatch(formTypesSuccess(FORM_TYPE_DELETE_SUCCESS, DELETE_SUCCESS('Case Type'), []))
      }
    } catch (error) {
      console.log('Delete FormTypes Error: ', error)
      dispatch(formTypesFailure(FORM_TYPE_DELETE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(formTypesComplete())
    }
  }
}

const formTypesRequest = (type: string) => ({
  type: type,
})

const formTypesSuccess = (type: string, success: string, formTypes: FormTypeSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      formTypes: formTypes,
    }
  }
}

const formTypesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const formTypesComplete = () => ({
  type: FORM_TYPES_COMPLETE,
})
