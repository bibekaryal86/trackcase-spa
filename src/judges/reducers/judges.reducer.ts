import {
  JUDGES_CREATE_SUCCESS,
  JUDGES_DELETE_SUCCESS,
  JUDGES_READ_SUCCESS,
  JUDGES_UPDATE_SUCCESS,
} from '@judges/types/judges.action.types.ts'
import { DefaultJudgeState, JudgesAction, JudgesState } from '@judges/types/judges.data.types.ts'

export default function judges(state = DefaultJudgeState, action: JudgesAction): JudgesState {
  switch (action.type) {
    case JUDGES_READ_SUCCESS:
      return {
        judges: action.judges,
        requestMetadata: action.requestMetadata,
      }
    case JUDGES_CREATE_SUCCESS:
    case JUDGES_UPDATE_SUCCESS:
    case JUDGES_DELETE_SUCCESS:
      return {
        ...state,
        judges: [],
      }
    default:
      return state
  }
}
