// actions
import { getClient, getClients, getOneClient } from './actions/clients.action'
// components
import Client from './components/Client'
import Clients from './components/Clients'
// reducers
import clients from './reducers/clients.reducer'
// action types
import { CLIENT_CREATE_SUCCESS, CLIENT_DELETE_SUCCESS, CLIENT_UPDATE_SUCCESS } from './types/clients.action.types'
// data types
import {
  ClientResponse,
  ClientsAction,
  ClientSchema,
  ClientsState,
  HistoryClientSchema,
  NoteClientSchema,
} from './types/clients.data.types'

export { getClient, getClients, getOneClient }
export { Client, Clients }
export { clients }
export { CLIENT_CREATE_SUCCESS, CLIENT_UPDATE_SUCCESS, CLIENT_DELETE_SUCCESS }
export type { ClientResponse,
  ClientsAction,
  ClientSchema,
  ClientsState,
  HistoryClientSchema,
  NoteClientSchema, }
