import {
  CLIENTS_CREATE_SUCCESS,
  CLIENTS_DELETE_SUCCESS,
  CLIENTS_READ_SUCCESS,
  CLIENTS_UPDATE_SUCCESS,
} from '@clients/types/clients.action.types.ts'
import { ClientsAction, ClientsState, DefaultClientState } from '@clients/types/clients.data.types.ts'

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
