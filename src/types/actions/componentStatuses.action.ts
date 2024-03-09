import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  COMPONENT_STATUS_CREATE_FAILURE,
  COMPONENT_STATUS_CREATE_REQUEST,
  COMPONENT_STATUS_CREATE_SUCCESS,
  COMPONENT_STATUS_DELETE_FAILURE,
  COMPONENT_STATUS_DELETE_REQUEST,
  COMPONENT_STATUS_DELETE_SUCCESS,
  COMPONENT_STATUS_UPDATE_FAILURE,
  COMPONENT_STATUS_UPDATE_REQUEST,
  COMPONENT_STATUS_UPDATE_SUCCESS,
  COMPONENT_STATUSES_COMPLETE,
  COMPONENT_STATUSES_RETRIEVE_FAILURE,
  COMPONENT_STATUSES_RETRIEVE_REQUEST,
  COMPONENT_STATUSES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { ComponentStatusResponse, ComponentStatusSchema } from '../types/refTypes.data.types'

export const addComponentStatus = (name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(componentStatusesRequest(COMPONENT_STATUS_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COMPONENT_STATUS_CREATE as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: {
          name,
          description,
        },
      }

      const componentStatusResponse = (await Async.fetch(urlPath, options)) as ComponentStatusResponse

      if (componentStatusResponse.detail) {
        dispatch(componentStatusesFailure(COMPONENT_STATUS_CREATE_FAILURE, getErrMsg(componentStatusResponse.detail)))
      } else {
        dispatch(componentStatusesSuccess(COMPONENT_STATUS_CREATE_SUCCESS, CREATE_SUCCESS('Component Status'), []))
      }
    } catch (error) {
      console.log('Add ComponentStatus Error: ', error)
      dispatch(componentStatusesFailure(COMPONENT_STATUS_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(componentStatusesComplete())
    }
  }
}

export const getComponentStatuses = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(componentStatusesRequest(COMPONENT_STATUSES_RETRIEVE_REQUEST))

    try {
      let componentStatusResponse: ComponentStatusResponse
      const componentStatusesInStore: ComponentStatusSchema[] = getStore().componentStatuses.data

      if (isForceFetch || componentStatusesInStore.length === 0) {
        const urlPath = getEndpoint(process.env.COMPONENT_STATUS_READ as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        componentStatusResponse = (await Async.fetch(urlPath, options)) as ComponentStatusResponse

        if (componentStatusResponse.detail) {
          dispatch(
            componentStatusesFailure(COMPONENT_STATUSES_RETRIEVE_FAILURE, getErrMsg(componentStatusResponse.detail)),
          )
        } else {
          dispatch(componentStatusesSuccess(COMPONENT_STATUSES_RETRIEVE_SUCCESS, '', componentStatusResponse.data))
        }
      } else {
        dispatch(componentStatusesSuccess(COMPONENT_STATUSES_RETRIEVE_SUCCESS, '', componentStatusesInStore))
      }
    } catch (error) {
      console.log('Get ComponentStatuses Error: ', error)
      dispatch(componentStatusesFailure(COMPONENT_STATUSES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(componentStatusesComplete())
    }
  }
}

export const editComponentStatus = (id: number, name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(componentStatusesRequest(COMPONENT_STATUS_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COMPONENT_STATUS_UPDATE as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { component_status_id: id },
        requestBody: {
          name,
          description,
        },
      }

      const componentStatusResponse = (await Async.fetch(urlPath, options)) as ComponentStatusResponse

      if (componentStatusResponse.detail) {
        dispatch(componentStatusesFailure(COMPONENT_STATUS_UPDATE_FAILURE, getErrMsg(componentStatusResponse.detail)))
      } else {
        dispatch(componentStatusesSuccess(COMPONENT_STATUS_UPDATE_SUCCESS, UPDATE_SUCCESS('Component Status'), []))
      }
    } catch (error) {
      console.log('Edit ComponentStatus Error: ', error)
      dispatch(componentStatusesFailure(COMPONENT_STATUS_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(componentStatusesComplete())
    }
  }
}

export const deleteComponentStatus = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(componentStatusesRequest(COMPONENT_STATUS_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COMPONENT_STATUS_DELETE as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { component_status_id: id },
      }

      const componentStatusResponse = (await Async.fetch(urlPath, options)) as ComponentStatusResponse

      if (componentStatusResponse.detail) {
        dispatch(componentStatusesFailure(COMPONENT_STATUS_DELETE_FAILURE, getErrMsg(componentStatusResponse.detail)))
      } else {
        dispatch(componentStatusesSuccess(COMPONENT_STATUS_DELETE_SUCCESS, DELETE_SUCCESS('Component Status'), []))
      }
    } catch (error) {
      console.log('Delete ComponentStatus Error: ', error)
      dispatch(componentStatusesFailure(COMPONENT_STATUS_DELETE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(componentStatusesComplete())
    }
  }
}

const componentStatusesRequest = (type: string) => ({
  type: type,
})

const componentStatusesSuccess = (type: string, success: string, componentStatuses: ComponentStatusSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      componentStatuses: componentStatuses,
    }
  }
}

const componentStatusesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const componentStatusesComplete = () => ({
  type: COMPONENT_STATUSES_COMPLETE,
})
