import React from 'react'

import { GlobalDispatch, GlobalState } from '@app/store/redux'
import { getEndpoint, getErrMsg, getNumber } from '@app/utils/app.utils'
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
  CLIENTS_COMPLETE,
  CLIENTS_READ_FAILURE,
  CLIENTS_READ_REQUEST,
  CLIENTS_READ_SUCCESS,
} from '../types/clients.action.types'
import { ClientBase, ClientResponse, ClientSchema } from '../types/clients.data.types'
import { clientDispatch } from '../utils/clients.utils'

export const clientsAction = ({
  action,
  clientsRequest,
  id,
  isRestore,
  isHardDelete,
}: {
  action: ActionTypes
  clientsRequest?: ClientBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<ClientResponse> => {
    if (action === ACTION_TYPES.RESTORE) {
      action = ACTION_TYPES.UPDATE
    }
    const typeRequest = `CLIENTS_${action}_REQUEST`
    const typeSuccess = `CLIENTS_${action}_SUCCESS`
    const typeFailure = `CLIENTS_${action}_FAILURE`
    dispatch(clientDispatch({ type: typeRequest }))

    let endpoint = ''
    let options: Partial<FetchOptions> = {}

    if (clientsRequest && getNumber(clientsRequest.judgeId) <= 0) {
      clientsRequest.judgeId = undefined
    }
    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.CLIENT_CREATE as string)
      options = {
        method: HTTP_METHODS.POST,
        requestBody: clientsRequest,
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint = getEndpoint(process.env.CLIENT_UPDATE as string)
      options = {
        method: HTTP_METHODS.PUT,
        requestBody: clientsRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { client_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.CLIENT_DELETE as string)
      options = {
        method: HTTP_METHODS.DELETE,
        pathParams: { client_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    try {
      const clientResponse = (await Async.fetch(endpoint, options)) as ClientResponse
      if (clientResponse.detail) {
        dispatch(clientDispatch({ type: typeFailure, error: getErrMsg(clientResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          dispatch(clientDispatch({ type: typeSuccess, clients: clientResponse.data }))
        } else {
          dispatch(clientDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'CLIENT') }))
        }
      }
      return clientResponse
    } catch (error) {
      console.log(`Client ${action} Error: `, error)
      dispatch(clientDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(clientDispatch({ type: CLIENTS_COMPLETE }))
    }
  }
}

export const getClients = (requestMetadata?: Partial<FetchRequestMetadata>) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(clientDispatch({ type: CLIENTS_READ_REQUEST }))

    let clientResponse: ClientResponse = { data: [] }

    if (requestMetadata === getStore().clients.requestMetadata) {
      // no need to fetch request, metadata is same
      clientResponse.data = getStore().clients.clients
    }
    const endpoint = getEndpoint(process.env.CLIENT_READ as string)
    const options: Partial<FetchOptions> = {
      method: HTTP_METHODS.GET,
      metadataParams: requestMetadata,
    }

    try {
      if (clientResponse.data.length <= 0) {
        clientResponse = (await Async.fetch(endpoint, options)) as ClientResponse
      }
      if (clientResponse.detail) {
        dispatch(clientDispatch({ type: CLIENTS_READ_FAILURE, error: getErrMsg(clientResponse.detail) }))
      } else {
        dispatch(
          clientDispatch({
            type: CLIENTS_READ_SUCCESS,
            clients: clientResponse.data,
            requestMetadata: requestMetadata,
          }),
        )
      }
    } catch (error) {
      console.log(`Get Clients Error: `, error)
      dispatch(clientDispatch({ type: CLIENTS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(clientDispatch({ type: CLIENTS_COMPLETE }))
    }
  }
}

export const getClient = (clientId: number, isIncludeExtra?: boolean) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, state: GlobalState): Promise<ClientSchema | undefined> => {
    dispatch(clientDispatch({ type: CLIENTS_READ_REQUEST }))
    let oneClient = undefined

    try {
      const clientsInStore = state.clients.clients
      if (clientsInStore) {
        oneClient = clientsInStore.find((x) => x.id === clientId)

        if (isIncludeExtra && oneClient && (!oneClient.courtCases || !oneClient.courtCases.length)) {
          oneClient = undefined
        }
      }

      if (oneClient) {
        return oneClient
      } else {
        const endpoint = getEndpoint(process.env.CLIENT_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: clientId,
          isIncludeExtra: isIncludeExtra === true,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const clientResponse = (await Async.fetch(endpoint, options)) as ClientResponse
        if (clientResponse.detail) {
          dispatch(clientDispatch({ type: CLIENTS_READ_FAILURE, error: getErrMsg(clientResponse.detail) }))
        } else {
          oneClient = clientResponse.data.find((x) => x.id === clientId)
        }
      }
      return oneClient
    } catch (error) {
      console.log(`Get Client Error: `, error)
      dispatch(clientDispatch({ type: CLIENTS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneClient
    } finally {
      dispatch(clientDispatch({ type: CLIENTS_COMPLETE }))
    }
  }
}
