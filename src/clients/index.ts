// actions
import { getClient, getClients, getOneClient } from './actions/clients.action'
// components
import Client from './components/Client'
import Clients from './components/Clients'
// reducers
import clients from './reducers/clients.reducer'
// types
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
export type { ClientSchema, ClientResponse, NoteClientSchema, HistoryClientSchema, ClientsState, ClientsAction }
