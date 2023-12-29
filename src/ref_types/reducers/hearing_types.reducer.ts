import {
  HEARING_TYPE_CREATE_SUCCESS,
  HEARING_TYPE_DELETE_SUCCESS,
  HEARING_TYPE_UPDATE_SUCCESS,
  HEARING_TYPES_RETRIEVE_SUCCESS,
} from '../types/ref_types.action.types'
import { HearingTypeAction, HearingTypeState } from '../types/ref_types.data.types'

export const DefaultHearingTypeState: HearingTypeState = {
  hearing_types: [],
}

export default function collectionMethods(
  state = DefaultHearingTypeState,
  action: HearingTypeAction,
): HearingTypeState {
  switch (action.type) {
    case HEARING_TYPES_RETRIEVE_SUCCESS:
      return {
        hearing_types: action.hearing_types,
      }
    case HEARING_TYPE_CREATE_SUCCESS:
    case HEARING_TYPE_UPDATE_SUCCESS:
    case HEARING_TYPE_DELETE_SUCCESS:
      return {
        hearing_types: [], // so that it will fetch
      }
    default:
      return state
  }
}
