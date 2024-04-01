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
import {
  ACTION_SUCCESS,
  ACTION_TYPES,
  ActionTypes,
  HTTP_METHODS,
  ID_DEFAULT,
  SOMETHING_WENT_WRONG,
} from '../../constants'
import {
  COURTS_COMPLETE,
  COURTS_READ_FAILURE,
  COURTS_READ_REQUEST,
  COURTS_READ_SUCCESS,
} from '../types/courts.action.types'
import { CourtBase, CourtResponse, CourtSchema } from '../types/courts.data.types'
import { courtDispatch } from '../utils/courts.utils'

export const courtsAction = ({
  action,
  courtsRequest,
  id,
  isRestore,
  isHardDelete,
}: {
  action: ActionTypes
  courtsRequest?: CourtBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<CourtResponse> => {
    if (action === ACTION_TYPES.RESTORE) {
      action = ACTION_TYPES.UPDATE
    }
    const typeRequest = `COURTS_${action}_REQUEST`
    const typeSuccess = `COURTS_${action}_SUCCESS`
    const typeFailure = `COURTS_${action}_FAILURE`
    dispatch(courtDispatch({ type: typeRequest }))

    let endpoint = ''
    let options: Partial<FetchOptions> = {}

    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.COURT_CREATE as string)
      options = {
        method: HTTP_METHODS.POST,
        requestBody: { ...courtsRequest },
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint = getEndpoint(process.env.COURT_UPDATE as string)
      options = {
        method: HTTP_METHODS.PUT,
        requestBody: courtsRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { court_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.COURT_DELETE as string)
      options = {
        method: HTTP_METHODS.DELETE,
        pathParams: { court_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    try {
      const courtResponse = (await Async.fetch(endpoint, options)) as CourtResponse
      if (courtResponse.detail) {
        dispatch(courtDispatch({ type: typeFailure, error: getErrMsg(courtResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          dispatch(courtDispatch({ type: typeSuccess, courts: courtResponse.data }))
        } else {
          dispatch(courtDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'COURT') }))
        }
      }
      return courtResponse
    } catch (error) {
      console.log(`Court ${action} Error: `, error)
      dispatch(courtDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(courtDispatch({ type: COURTS_COMPLETE }))
    }
  }
}

export const getCourts = (requestMetadata?: Partial<FetchRequestMetadata>) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, store: GlobalState): Promise<void> => {
    dispatch(courtDispatch({ type: COURTS_READ_REQUEST }))

    let courtResponse: CourtResponse = { data: [] }

    if (requestMetadata === store.courts.requestMetadata) {
      // no need to fetch request, metadata is same
      courtResponse.data = store.courts.courts
    }
    const endpoint = getEndpoint(process.env.COURT_READ as string)
    const options: Partial<FetchOptions> = {
      method: HTTP_METHODS.GET,
      metadataParams: requestMetadata,
    }

    try {
      if (courtResponse.data.length <= 0) {
        courtResponse = (await Async.fetch(endpoint, options)) as CourtResponse
      }
      if (courtResponse.detail) {
        dispatch(courtDispatch({ type: COURTS_READ_FAILURE, error: getErrMsg(courtResponse.detail) }))
      } else {
        dispatch(
          courtDispatch({ type: COURTS_READ_SUCCESS, courts: courtResponse.data, requestMetadata: requestMetadata }),
        )
      }
    } catch (error) {
      console.log(`Get Courts Error: `, error)
      dispatch(courtDispatch({ type: COURTS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(courtDispatch({ type: COURTS_COMPLETE }))
    }
  }
}

export const getCourt = (courtId: number, isIncludeExtra?: boolean) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, state: GlobalState): Promise<CourtSchema | undefined> => {
    dispatch(courtDispatch({ type: COURTS_READ_REQUEST }))
    let oneCourt = undefined

    try {
      const courtsInStore = state.courts.courts
      if (courtsInStore) {
        oneCourt = courtsInStore.find((x) => x.id === courtId)

        if (isIncludeExtra && oneCourt && (!oneCourt.judges || !oneCourt.judges.length)) {
          oneCourt = undefined
        }
      }

      if (oneCourt) {
        return oneCourt
      } else {
        const endpoint = getEndpoint(process.env.COURT_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: courtId,
          isIncludeExtra: isIncludeExtra === true,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const courtResponse = (await Async.fetch(endpoint, options)) as CourtResponse
        if (courtResponse.detail) {
          dispatch(courtDispatch({ type: COURTS_READ_FAILURE, error: getErrMsg(courtResponse.detail) }))
        } else {
          oneCourt = courtResponse.data.find((x) => x.id === courtId)
        }
      }
      return oneCourt
    } catch (error) {
      console.log(`Get Court Error: `, error)
      dispatch(courtDispatch({ type: COURTS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneCourt
    } finally {
      dispatch(courtDispatch({ type: COURTS_COMPLETE }))
    }
  }
}
