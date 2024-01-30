import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  CLIENT_CREATE_FAILURE,
  CLIENT_CREATE_REQUEST,
  CLIENT_CREATE_SUCCESS,
  CLIENT_DELETE_FAILURE,
  CLIENT_DELETE_REQUEST,
  CLIENT_DELETE_SUCCESS,
  CLIENT_UPDATE_FAILURE,
  CLIENT_UPDATE_REQUEST,
  CLIENT_UPDATE_SUCCESS,
  CLIENTS_COMPLETE,
  CLIENTS_RETRIEVE_FAILURE,
  CLIENTS_RETRIEVE_REQUEST,
  CLIENTS_RETRIEVE_SUCCESS,
  SET_SELECTED_CLIENT,
} from '../types/clients.action.types'
import { ClientResponse, ClientSchema } from '../types/clients.data.types'
import { validateClient } from '../utils/clients.utils'

export const addClient = (client: ClientSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateClient(client)
    if (validationErrors) {
      dispatch(clientsFailure(CLIENT_CREATE_FAILURE, validationErrors))
      return
    }

    dispatch(clientsRequest(CLIENT_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.CLIENT_CREATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: getRequestBody(client),
      }

      const clientResponse = (await Async.fetch(urlPath, options)) as ClientResponse

      if (clientResponse.detail) {
        dispatch(clientsFailure(CLIENT_CREATE_FAILURE, getErrMsg(clientResponse.detail)))
      } else {
        dispatch(clientsSuccess(CLIENT_CREATE_SUCCESS, CREATE_SUCCESS('Client'), []))
      }
    } catch (error) {
      console.log('Add Client Error: ', error)
      dispatch(clientsFailure(CLIENT_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(clientsComplete())
    }
  }
}

export const getClients = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(clientsRequest(CLIENTS_RETRIEVE_REQUEST))

    try {
      let clientResponse: ClientResponse
      const clientsInStore: ClientSchema[] = getStore().clients.clients

      if (isForceFetch || clientsInStore.length === 0) {
        const urlPath = getEndpoint(process.env.CLIENTS_RETRIEVE_ENDPOINT as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        clientResponse = (await Async.fetch(urlPath, options)) as ClientResponse

        if (clientResponse.detail) {
          dispatch(clientsFailure(CLIENTS_RETRIEVE_FAILURE, getErrMsg(clientResponse.detail)))
        } else {
          dispatch(clientsSuccess(CLIENTS_RETRIEVE_SUCCESS, '', clientResponse.clients))
        }
      } else {
        clientResponse = {
          clients: clientsInStore,
        }
        dispatch(clientsSuccess(CLIENTS_RETRIEVE_SUCCESS, '', clientResponse.clients))
      }
    } catch (error) {
      console.log('Get Clients Error: ', error)
      dispatch(clientsFailure(CLIENTS_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(clientsComplete())
    }
  }
}

export const getOneClient = async (clientId: number) => {
  try {
    const urlPath = getEndpoint(process.env.CLIENT_RETRIEVE_ENDPOINT as string)
    const options: Partial<FetchOptions> = {
      method: 'GET',
      pathParams: { client_id: clientId },
      extraParams: {
        isIncludeExtra: true,
        isIncludeHistory: true,
      },
    }

    return Async.fetch(urlPath, options)
  } catch (error) {
    console.log('Get OneClient Error: ', error)
    const errorResponse: ClientResponse = { clients: [], detail: { error: error as string } }
    return Promise.resolve(errorResponse)
  }
}

export const getClient = (clientId: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(clientsRequest(CLIENTS_RETRIEVE_REQUEST))

    // call api, if it fails fallback to store
    try {
      const clientResponse = (await getOneClient(clientId)) as ClientResponse
      if (clientResponse.detail) {
        dispatch(clientsFailure(CLIENTS_RETRIEVE_FAILURE, getErrMsg(clientResponse.detail)))
        setSelectedClientFromStore(getStore(), dispatch, clientId)
      } else {
        dispatch(clientSelect(clientResponse.clients[0]))
      }
    } finally {
      dispatch(clientsComplete())
    }
  }
}

export const editClient = (id: number, client: ClientSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateClient(client)
    if (validationErrors) {
      dispatch(clientsFailure(CLIENT_UPDATE_FAILURE, validationErrors))
      return
    }

    dispatch(clientsRequest(CLIENT_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.CLIENT_UPDATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { client_id: id },
        requestBody: getRequestBody(client),
      }

      const clientResponse = (await Async.fetch(urlPath, options)) as ClientResponse

      if (clientResponse.detail) {
        dispatch(clientsFailure(CLIENT_UPDATE_FAILURE, getErrMsg(clientResponse.detail)))
      } else {
        dispatch(clientsSuccess(CLIENT_UPDATE_SUCCESS, UPDATE_SUCCESS('Client'), []))
      }
    } catch (error) {
      console.log('Edit Client Error: ', error)
      dispatch(clientsFailure(CLIENT_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(clientsComplete())
    }
  }
}

export const deleteClient = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(clientsRequest(CLIENT_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.CLIENT_DELETE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { client_id: id },
      }

      const clientResponse = (await Async.fetch(urlPath, options)) as ClientResponse

      if (clientResponse.detail) {
        dispatch(clientsFailure(CLIENT_DELETE_FAILURE, getErrMsg(clientResponse.detail)))
      } else {
        dispatch(clientsSuccess(CLIENT_DELETE_SUCCESS, DELETE_SUCCESS('Client'), []))
      }
    } catch (error) {
      console.log('Delete Client Error: ', error)
      dispatch(clientsFailure(CLIENT_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(clientsComplete())
    }
  }
}

const clientsRequest = (type: string) => ({
  type: type,
})

const clientsSuccess = (type: string, success: string, clients: ClientSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      clients: clients,
    }
  }
}

const clientsFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const clientSelect = (selectedClient: ClientSchema) => ({
  type: SET_SELECTED_CLIENT,
  selectedClient,
})

const clientsComplete = () => ({
  type: CLIENTS_COMPLETE,
})

const getRequestBody = (client: ClientSchema) => {
  return {
    name: client.name,
    a_number: client.aNumber,
    email: client.email,
    judge_id: client.judgeId,
    street_address: client.streetAddress,
    city: client.city,
    state: client.state,
    zip_code: client.zipCode,
    phone_number: client.phoneNumber,
    status: client.status,
    comments: client.comments,
  }
}

const setSelectedClientFromStore = (store: GlobalState, dispatch: React.Dispatch<GlobalDispatch>, clientId: number) => {
  const clientsInStore: ClientSchema[] = store.clients.clients
  const clientInStore: ClientSchema | undefined = clientsInStore.find((client) => client.id === clientId)
  if (clientInStore) {
    dispatch(clientSelect(clientInStore))
  }
}
