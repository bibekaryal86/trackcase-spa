import {
  COMPONENT_STATUS_CREATE_SUCCESS,
  COMPONENT_STATUS_DELETE_SUCCESS,
  COMPONENT_STATUS_UPDATE_SUCCESS,
  COMPONENT_STATUSES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { ComponentStatusAction, ComponentStatusState } from '../types/refTypes.data.types'

export const DefaultComponentStatusState: ComponentStatusState = {
  data: [],
}

export default function componentStatuses(
  state = DefaultComponentStatusState,
  action: ComponentStatusAction,
): ComponentStatusState {
  switch (action.type) {
    case COMPONENT_STATUSES_RETRIEVE_SUCCESS:
      return {
        data: action.data,
      }
    case COMPONENT_STATUS_CREATE_SUCCESS:
    case COMPONENT_STATUS_UPDATE_SUCCESS:
    case COMPONENT_STATUS_DELETE_SUCCESS:
      return {
        data: [], // so that it will fetch
      }
    default:
      return state
  }
}
