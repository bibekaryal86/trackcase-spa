import {
  CLIENT_CREATE_SUCCESS,
  CLIENT_DELETE_SUCCESS,
  CLIENT_NOTE_SUCCESS,
  CLIENT_UPDATE_SUCCESS,
  CLIENTS_RETRIEVE_REQUEST,
  CLIENTS_RETRIEVE_SUCCESS,
  CLIENTS_UNMOUNT,
  SET_SELECTED_CLIENT,
} from '../types/clients.action.types'
import { ClientsAction, ClientsState, DefaultClientSchema, DefaultClientState } from '../types/clients.data.types'

export default function clients(state = DefaultClientState, action: ClientsAction): ClientsState {
  const matchesRequest = /^CLIENT_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  if (matchesRequest || action.type === CLIENTS_RETRIEVE_REQUEST) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  switch (action.type) {
    case CLIENTS_RETRIEVE_SUCCESS:
      return {
        ...state,
        isForceFetch: false,
        isCloseModal: true,
        clients: action.clients,
      }
    case CLIENT_CREATE_SUCCESS:
    case CLIENT_UPDATE_SUCCESS:
    case CLIENT_DELETE_SUCCESS:
      return {
        isForceFetch: true,
        isCloseModal: true,
        clients: [],
        selectedClient: DefaultClientSchema,
      }
    case SET_SELECTED_CLIENT:
      return {
        ...state,
        isForceFetch: false,
        selectedClient: action.selectedClient,
      }
    case CLIENT_NOTE_SUCCESS:
      return {
        ...state,
        isForceFetch: true,
        selectedClient: DefaultClientSchema,
      }
    case CLIENTS_UNMOUNT:
      return {
        ...state,
        isForceFetch: true,
        selectedClient: DefaultClientSchema,
      }
    default:
      return state
  }
}
