import React from 'react'

import {
  Async,
  FetchOptions,
  FetchRequestMetadata,
  getEndpoint,
  getErrMsg,
  GlobalDispatch,
  GlobalState,
} from '../../app'
import { ACTION_SUCCESS, ACTION_TYPES, ActionTypes, ID_DEFAULT } from '../../constants'
import { COURTS_COMPLETE, COURTS_READ_FAILURE, COURTS_READ_REQUEST } from '../types/courts.action.types'
import { CourtBase, CourtResponse, CourtSchema } from '../types/courts.data.types'
import { courtDispatch } from '../utils/courts.utils'

export const courtsAction = async ({
  action,
  courtsRequest,
  id,
  isRestore,
  isHardDelete,
  requestMetadata,
}: {
  action: ActionTypes
  courtsRequest?: CourtBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
  requestMetadata?: Partial<FetchRequestMetadata>
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    const typeRequest = `COURTS_${action}_REQUEST`
    const typeSuccess = `COURTS_${action}_SUCCESS`
    const typeFailure = `COURTS_${action}_FAILURE`

    let endpoint = ''
    let options: Partial<FetchOptions> = {}
    let courtResponse: CourtResponse = { data: [] }

    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.COURT_CREATE as string)
      options = {
        method: 'POST',
        requestBody: { ...courtsRequest },
      }
    } else if (action === ACTION_TYPES.READ) {
      if (requestMetadata === getStore().courts.requestMetadata) {
        // no need to fetch request, metadata is same
        courtResponse.data = getStore().courts.courts
      }
      endpoint = getEndpoint(process.env.COURT_READ as string)
      options = {
        method: 'GET',
        metadataParams: requestMetadata,
      }
    } else if (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.RESTORE) {
      endpoint = getEndpoint(process.env.COURT_UPDATE as string)
      options = {
        method: 'PUT',
        requestBody: courtsRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { court_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.COURT_DELETE as string)
      options = {
        method: 'DELETE',
        pathParams: { court_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    dispatch(courtDispatch({ type: typeRequest }))

    try {
      if (courtResponse.data.length <= 0) {
        courtResponse = (await Async.fetch(endpoint, options)) as CourtResponse
      }
      if (courtResponse.detail) {
        dispatch(courtDispatch({ type: typeFailure, error: getErrMsg(courtResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          dispatch(courtDispatch({ type: typeSuccess, courts: courtResponse.data }))
        } else {
          dispatch(courtDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'COURT') }))
        }
      }
    } catch (error) {
      console.log(`Court ${action} Error: `, error)
    } finally {
      dispatch(courtDispatch({ type: COURTS_COMPLETE }))
    }
  }
}

export const getCourt = async (courtId: number) => {
  return async (
    dispatch: React.Dispatch<GlobalDispatch>,
    getStore: () => GlobalState,
  ): Promise<CourtSchema | undefined> => {
    dispatch(courtDispatch({ type: COURTS_READ_REQUEST }))

    let courtInStore = undefined
    const courtsInStore = getStore().courts.courts
    if (courtsInStore) {
      courtInStore = courtsInStore.find((x) => x.id === courtId)
    }
    if (courtInStore) {
      return courtInStore
    } else {
      const endpoint = getEndpoint(process.env.COURT_READ as string)
      const requestMetadata: Partial<FetchRequestMetadata> = {
        schemaModelId: courtId,
      }
      const options: Partial<FetchOptions> = {
        method: 'GET',
        metadataParams: requestMetadata,
      }
      const courtResponse = (await Async.fetch(endpoint, options)) as CourtResponse
      if (courtResponse.detail) {
        dispatch(courtDispatch({ type: COURTS_READ_FAILURE, error: getErrMsg(courtResponse.detail) }))
      } else {
        courtInStore = courtResponse.data.find((x) => x.id === courtId)
      }
    }
    return courtInStore
  }
}
