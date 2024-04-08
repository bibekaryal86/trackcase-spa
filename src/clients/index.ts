// actions
import { clientsAction, getClient, getClients } from './actions/clients.action'
// components
import Client from './components/Client'
import Clients from './components/Clients'
import ClientTable from './components/ClientTable'
// reducers
import clients from './reducers/clients.reducer'
// data types
import {
  ClientFormData,
  ClientFormErrorData,
  ClientResponse,
  ClientsAction,
  ClientSchema,
  ClientsState,
} from './types/clients.data.types'

export { getClient, getClients, clientsAction }
export { Client, Clients, ClientTable }
export { clients }
export type { ClientResponse, ClientsAction, ClientSchema, ClientsState, ClientFormData, ClientFormErrorData }
