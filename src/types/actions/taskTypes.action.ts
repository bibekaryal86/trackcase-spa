import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  TASK_TYPE_CREATE_FAILURE,
  TASK_TYPE_CREATE_REQUEST,
  TASK_TYPE_CREATE_SUCCESS,
  TASK_TYPE_DELETE_FAILURE,
  TASK_TYPE_DELETE_REQUEST,
  TASK_TYPE_DELETE_SUCCESS,
  TASK_TYPE_UPDATE_FAILURE,
  TASK_TYPE_UPDATE_REQUEST,
  TASK_TYPE_UPDATE_SUCCESS,
  TASK_TYPES_COMPLETE,
  TASK_TYPES_RETRIEVE_FAILURE,
  TASK_TYPES_RETRIEVE_REQUEST,
  TASK_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { TaskTypeResponse, TaskTypeSchema } from '../types/refTypes.data.types'

export const addTaskType = (name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(taskTypesRequest(TASK_TYPE_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.TASK_TYPE_CREATE as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: {
          name,
          description,
        },
      }

      const taskTypeResponse = (await Async.fetch(urlPath, options)) as TaskTypeResponse

      if (taskTypeResponse.detail) {
        dispatch(taskTypesFailure(TASK_TYPE_CREATE_FAILURE, getErrMsg(taskTypeResponse.detail)))
      } else {
        dispatch(taskTypesSuccess(TASK_TYPE_CREATE_SUCCESS, CREATE_SUCCESS('Task Type'), []))
      }
    } catch (error) {
      console.log('Add TaskType Error: ', error)
      dispatch(taskTypesFailure(TASK_TYPE_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(taskTypesComplete())
    }
  }
}

export const getTaskTypes = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(taskTypesRequest(TASK_TYPES_RETRIEVE_REQUEST))

    try {
      let taskTypeResponse: TaskTypeResponse
      const taskTypesInStore: TaskTypeSchema[] = getStore().taskTypes.data

      if (isForceFetch || taskTypesInStore.length === 0) {
        const urlPath = getEndpoint(process.env.TASK_TYPES_READ as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        taskTypeResponse = (await Async.fetch(urlPath, options)) as TaskTypeResponse

        if (taskTypeResponse.detail) {
          dispatch(taskTypesFailure(TASK_TYPES_RETRIEVE_FAILURE, getErrMsg(taskTypeResponse.detail)))
        } else {
          dispatch(taskTypesSuccess(TASK_TYPES_RETRIEVE_SUCCESS, '', taskTypeResponse.data))
        }
      } else {
        dispatch(taskTypesSuccess(TASK_TYPES_RETRIEVE_SUCCESS, '', taskTypesInStore))
      }
    } catch (error) {
      console.log('Get TaskTypes Error: ', error)
      dispatch(taskTypesFailure(TASK_TYPES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(taskTypesComplete())
    }
  }
}

export const editTaskType = (id: number, name: string, description: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(taskTypesRequest(TASK_TYPE_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.TASK_TYPE_UPDATE as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { task_type_id: id },
        requestBody: {
          name,
          description,
        },
      }

      const taskTypeResponse = (await Async.fetch(urlPath, options)) as TaskTypeResponse

      if (taskTypeResponse.detail) {
        dispatch(taskTypesFailure(TASK_TYPE_UPDATE_FAILURE, getErrMsg(taskTypeResponse.detail)))
      } else {
        dispatch(taskTypesSuccess(TASK_TYPE_UPDATE_SUCCESS, UPDATE_SUCCESS('Task Type'), []))
      }
    } catch (error) {
      console.log('Edit TaskType Error: ', error)
      dispatch(taskTypesFailure(TASK_TYPE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(taskTypesComplete())
    }
  }
}

export const deleteTaskType = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(taskTypesRequest(TASK_TYPE_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.TASK_TYPE_DELETE as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { task_type_id: id },
      }

      const taskTypeResponse = (await Async.fetch(urlPath, options)) as TaskTypeResponse

      if (taskTypeResponse.detail) {
        dispatch(taskTypesFailure(TASK_TYPE_DELETE_FAILURE, getErrMsg(taskTypeResponse.detail)))
      } else {
        dispatch(taskTypesSuccess(TASK_TYPE_DELETE_SUCCESS, DELETE_SUCCESS('Task Type'), []))
      }
    } catch (error) {
      console.log('Delete TaskType Error: ', error)
      dispatch(taskTypesFailure(TASK_TYPE_DELETE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(taskTypesComplete())
    }
  }
}

const taskTypesRequest = (type: string) => ({
  type: type,
})

const taskTypesSuccess = (type: string, success: string, taskTypes: TaskTypeSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      taskTypes: taskTypes,
    }
  }
}

const taskTypesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const taskTypesComplete = () => ({
  type: TASK_TYPES_COMPLETE,
})
