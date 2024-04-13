import React from 'react'

import { GlobalDispatch, GlobalState } from '@app/store/redux'
import { getEndpoint, getErrMsg } from '@app/utils/app.utils'
import { Async, FetchOptions, FetchRequestMetadata } from '@app/utils/fetch.utils'
import {
  ACTION_SUCCESS,
  ACTION_TYPES,
  ActionTypes,
  HTTP_METHODS,
  ID_DEFAULT,
  SOMETHING_WENT_WRONG,
} from '@constants/index'

import {
  FILING_RFES_READ_FAILURE,
  FILING_RFES_READ_REQUEST,
  FILINGS_COMPLETE,
  FILINGS_READ_FAILURE,
  FILINGS_READ_REQUEST,
  FILINGS_READ_SUCCESS,
} from '../types/filings.action.types'
import {
  FilingBase,
  FilingResponse,
  FilingRfeBase,
  FilingRfeResponse,
  FilingRfeSchema,
  FilingSchema,
} from '../types/filings.data.types'
import { filingDispatch, filingRfeDispatch } from '../utils/filings.utils'

export const filingsAction = ({
  action,
  filingsRequest,
  id,
  isRestore,
  isHardDelete,
}: {
  action: ActionTypes
  filingsRequest?: FilingBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<FilingResponse> => {
    if (action === ACTION_TYPES.RESTORE) {
      action = ACTION_TYPES.UPDATE
    }
    const typeRequest = `FILINGS_${action}_REQUEST`
    const typeSuccess = `FILINGS_${action}_SUCCESS`
    const typeFailure = `FILINGS_${action}_FAILURE`
    dispatch(filingDispatch({ type: typeRequest }))

    let endpoint = ''
    let options: Partial<FetchOptions> = {}

    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.FILING_CREATE as string)
      options = {
        method: HTTP_METHODS.POST,
        requestBody: filingsRequest,
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint = getEndpoint(process.env.FILING_UPDATE as string)
      options = {
        method: HTTP_METHODS.PUT,
        requestBody: filingsRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { filing_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.FILING_DELETE as string)
      options = {
        method: HTTP_METHODS.DELETE,
        pathParams: { filing_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    try {
      const filingResponse = (await Async.fetch(endpoint, options)) as FilingResponse
      if (filingResponse.detail) {
        dispatch(filingDispatch({ type: typeFailure, error: getErrMsg(filingResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          dispatch(filingDispatch({ type: typeSuccess, filings: filingResponse.data }))
        } else {
          dispatch(filingDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'FILING') }))
        }
      }
      return filingResponse
    } catch (error) {
      console.log(`Filing ${action} Error: `, error)
      dispatch(filingDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(filingDispatch({ type: FILINGS_COMPLETE }))
    }
  }
}

export const filingRfesAction = ({
  action,
  filingRfesRequest,
  id,
  isRestore,
  isHardDelete,
}: {
  action: ActionTypes
  filingRfesRequest?: FilingRfeBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<FilingRfeResponse> => {
    if (action === ACTION_TYPES.RESTORE) {
      action = ACTION_TYPES.UPDATE
    }
    const typeRequest = `FILING_RFES_${action}_REQUEST`
    const typeSuccess = `FILING_RFES_${action}_SUCCESS`
    const typeFailure = `FILING_RFES_${action}_FAILURE`
    dispatch(filingRfeDispatch({ type: typeRequest }))

    let endpoint = ''
    let options: Partial<FetchOptions> = {}

    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.FILING_RFE_CREATE as string)
      options = {
        method: HTTP_METHODS.POST,
        requestBody: filingRfesRequest,
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint = getEndpoint(process.env.FILING_RFE_UPDATE as string)
      options = {
        method: HTTP_METHODS.PUT,
        requestBody: filingRfesRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { filing_rfe_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.FILING_RFE_DELETE as string)
      options = {
        method: HTTP_METHODS.DELETE,
        pathParams: { filing_rfe_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    try {
      const filingRfeResponse = (await Async.fetch(endpoint, options)) as FilingRfeResponse
      if (filingRfeResponse.detail) {
        dispatch(filingRfeDispatch({ type: typeFailure, error: getErrMsg(filingRfeResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          console.log('filingRfesAction -> this should not be happening')
        } else {
          dispatch(filingRfeDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'FILING RFE') }))
        }
      }
      return filingRfeResponse
    } catch (error) {
      console.log(`Filing RFE ${action} Error: `, error)
      dispatch(filingDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(filingDispatch({ type: FILINGS_COMPLETE }))
    }
  }
}

export const getFilings = (requestMetadata?: Partial<FetchRequestMetadata>) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(filingDispatch({ type: FILINGS_READ_REQUEST }))

    let filingResponse: FilingResponse = { data: [] }

    if (requestMetadata === getStore().filings.requestMetadata) {
      // no need to fetch request, metadata is same
      filingResponse.data = getStore().filings.filings
    }
    const endpoint = getEndpoint(process.env.FILING_READ as string)
    const options: Partial<FetchOptions> = {
      method: HTTP_METHODS.GET,
      metadataParams: requestMetadata,
    }

    try {
      if (filingResponse.data.length <= 0) {
        filingResponse = (await Async.fetch(endpoint, options)) as FilingResponse
      }
      if (filingResponse.detail) {
        dispatch(filingDispatch({ type: FILINGS_READ_FAILURE, error: getErrMsg(filingResponse.detail) }))
      } else {
        dispatch(
          filingDispatch({
            type: FILINGS_READ_SUCCESS,
            filings: filingResponse.data,
            requestMetadata: requestMetadata,
          }),
        )
      }
    } catch (error) {
      console.log(`Get Filings Error: `, error)
      dispatch(filingDispatch({ type: FILINGS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(filingDispatch({ type: FILINGS_COMPLETE }))
    }
  }
}

export const getFiling = (filingId: number, isIncludeExtra?: boolean) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, state: GlobalState): Promise<FilingSchema | undefined> => {
    dispatch(filingDispatch({ type: FILINGS_READ_REQUEST }))
    let oneFiling = undefined

    try {
      const filingsInStore = state.filings.filings
      if (filingsInStore) {
        oneFiling = filingsInStore.find((x) => x.id === filingId)

        if (isIncludeExtra && oneFiling && (!oneFiling.taskCalendars || !oneFiling.taskCalendars.length)) {
          oneFiling = undefined
        }
      }

      if (oneFiling) {
        return oneFiling
      } else {
        const endpoint = getEndpoint(process.env.FILING_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: filingId,
          isIncludeExtra: isIncludeExtra === true,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const filingResponse = (await Async.fetch(endpoint, options)) as FilingResponse
        if (filingResponse.detail) {
          dispatch(filingDispatch({ type: FILINGS_READ_FAILURE, error: getErrMsg(filingResponse.detail) }))
        } else {
          oneFiling = filingResponse.data.find((x) => x.id === filingId)
        }
      }
      return oneFiling
    } catch (error) {
      console.log(`Get Filing Error: `, error)
      dispatch(filingDispatch({ type: FILINGS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneFiling
    } finally {
      dispatch(filingDispatch({ type: FILINGS_COMPLETE }))
    }
  }
}

export const getFilingRfe = (filingRfeId: number, isIncludeExtra?: boolean) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, state: GlobalState): Promise<FilingRfeSchema | undefined> => {
    dispatch(filingDispatch({ type: FILING_RFES_READ_REQUEST }))
    let oneFilingRfe = undefined

    try {
      const filingsInStore = state.filings.filings
      const filingRfesInStore = filingsInStore.flatMap((x) => x.filingRfes || [])
      if (filingRfesInStore) {
        oneFilingRfe = filingRfesInStore.find((x) => x.id === filingRfeId)
      }

      if (oneFilingRfe) {
        return oneFilingRfe
      } else {
        const endpoint = getEndpoint(process.env.FILING_RFE_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: filingRfeId,
          isIncludeExtra: isIncludeExtra === true,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const filingRfeResponse = (await Async.fetch(endpoint, options)) as FilingRfeResponse
        if (filingRfeResponse.detail) {
          dispatch(filingDispatch({ type: FILING_RFES_READ_FAILURE, error: getErrMsg(filingRfeResponse.detail) }))
        } else {
          oneFilingRfe = filingRfeResponse.data.find((x) => x.id === filingRfeId)
        }
      }
      return oneFilingRfe
    } catch (error) {
      console.log(`Get Filing Rfe Error: `, error)
      dispatch(filingRfeDispatch({ type: FILING_RFES_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneFilingRfe
    } finally {
      dispatch(filingRfeDispatch({ type: FILINGS_COMPLETE }))
    }
  }
}
