import {
  HEARING_TYPE_CREATE_SUCCESS,
  HEARING_TYPE_DELETE_SUCCESS,
  HEARING_TYPE_RETRIEVE_SUCCESS,
  HEARING_TYPE_UPDATE_SUCCESS,
} from '../types/refTypes.action.types'
import { HearingTypeAction, HearingTypeState } from '../types/refTypes.data.types'

export const DefaultHearingTypeState: HearingTypeState = {
  data: [],
}

export default function hearingTypes(state = DefaultHearingTypeState, action: HearingTypeAction): HearingTypeState {
  switch (action.type) {
    case HEARING_TYPE_RETRIEVE_SUCCESS:
      return {
        data: action.data,
      }
    case HEARING_TYPE_CREATE_SUCCESS:
    case HEARING_TYPE_UPDATE_SUCCESS:
    case HEARING_TYPE_DELETE_SUCCESS:
      return {
        data: [], // so that it will fetch
      }
    default:
      return state
  }
}
