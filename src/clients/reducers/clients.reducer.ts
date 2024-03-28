import {
  CLIENTS_CREATE_SUCCESS,
  CLIENTS_DELETE_SUCCESS,
  CLIENTS_READ_SUCCESS,
  CLIENTS_UPDATE_SUCCESS,
} from '../types/clients.action.types'
import { ClientsAction, ClientsState, DefaultClientState } from '../types/clients.data.types'

export default function clients(state = DefaultClientState, action: ClientsAction): ClientsState {
  switch (action.type) {
    case CLIENTS_READ_SUCCESS:
      return {
        clients: action.clients,
        requestMetadata: action.requestMetadata,
      }
    case CLIENTS_CREATE_SUCCESS:
    case CLIENTS_UPDATE_SUCCESS:
    case CLIENTS_DELETE_SUCCESS:
      return {
        ...state,
        clients: [],
      }
    default:
      return state
  }
}
