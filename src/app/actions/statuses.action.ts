import React from 'react'

import { SOMETHING_WENT_WRONG } from '../../constants'
import { GlobalDispatch, GlobalState } from '../store/redux'
import {
  STATUSES_COMPLETE,
  STATUSES_RETRIEVE_FAILURE,
  STATUSES_RETRIEVE_REQUEST,
  STATUSES_RETRIEVE_SUCCESS,
} from '../types/app.action.types'
import { StatusSchema } from '../types/app.data.types'
import { getEndpoint } from '../utils/app.utils'
import { Async, FetchOptions } from '../utils/fetch.utils'

export const getStatusesList = () => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(statusesRequest(STATUSES_RETRIEVE_REQUEST))

    try {
      let statusSchema: StatusSchema<string>
      const statusSchemaInStore = getStore().statuses.statuses

      if (Object.keys(statusSchemaInStore).length === 0) {
        const urlPath = getEndpoint(process.env.STATUSES_ENDPOINT as string, false)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        statusSchema = (await Async.fetch(urlPath, options)) as StatusSchema<string>
      } else {
        statusSchema = statusSchemaInStore
      }
      dispatch(statusesSuccess(STATUSES_RETRIEVE_SUCCESS, '', statusSchema))
    } catch (error) {
      console.log('Get Statuses Error: ', error)
      dispatch(statusesFailure(STATUSES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(statusesComplete())
    }
  }
}

const statusesRequest = (type: string) => ({
  type: type,
})

const statusesSuccess = (type: string, success: string, statuses: StatusSchema<string>) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      statuses: statuses,
    }
  }
}

const statusesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const statusesComplete = () => ({
  type: STATUSES_COMPLETE,
})
