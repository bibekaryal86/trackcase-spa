import { COURT_CASE_CREATE_SUCCESS, COURT_CASE_DELETE_SUCCESS, COURT_CASE_UPDATE_SUCCESS } from '../../cases'
import {
  CLIENT_CREATE_SUCCESS,
  CLIENT_DELETE_SUCCESS,
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
        isCloseModal: true,
        clients: action.clients,
      }
    case CLIENT_CREATE_SUCCESS:
    case CLIENT_UPDATE_SUCCESS:
    case CLIENT_DELETE_SUCCESS:
      return {
        isCloseModal: true,
        clients: [],
        selectedClient: DefaultClientSchema,
      }
    case SET_SELECTED_CLIENT:
      return {
        ...state,
        selectedClient: action.selectedClient,
      }
    case COURT_CASE_CREATE_SUCCESS:
    case COURT_CASE_UPDATE_SUCCESS:
    case COURT_CASE_DELETE_SUCCESS:
      return {
        ...state,
        selectedClient: DefaultClientSchema,
      }
    case CLIENTS_UNMOUNT:
      return {
        ...state,
        selectedClient: DefaultClientSchema,
      }
    default:
      return state
  }
}
