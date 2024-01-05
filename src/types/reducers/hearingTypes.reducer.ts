import {
  HEARING_TYPE_CREATE_SUCCESS,
  HEARING_TYPE_DELETE_SUCCESS,
  HEARING_TYPE_UPDATE_SUCCESS,
  HEARING_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { HearingTypeAction, HearingTypeState } from '../types/refTypes.data.types'

export const DefaultHearingTypeState: HearingTypeState = {
  hearingTypes: [],
}

export default function collectionMethods(
  state = DefaultHearingTypeState,
  action: HearingTypeAction,
): HearingTypeState {
  switch (action.type) {
    case HEARING_TYPES_RETRIEVE_SUCCESS:
      return {
        hearingTypes: action.hearingTypes,
      }
    case HEARING_TYPE_CREATE_SUCCESS:
    case HEARING_TYPE_UPDATE_SUCCESS:
    case HEARING_TYPE_DELETE_SUCCESS:
      return {
        hearingTypes: [], // so that it will fetch
      }
    default:
      return state
  }
}
