import { CLIENT_CREATE_SUCCESS, CLIENT_DELETE_SUCCESS, CLIENT_UPDATE_SUCCESS } from '../../clients'
import {
  JUDGE_CREATE_SUCCESS,
  JUDGE_DELETE_SUCCESS,
  JUDGE_NOTE_SUCCESS,
  JUDGE_UPDATE_SUCCESS,
  JUDGES_RETRIEVE_REQUEST,
  JUDGES_RETRIEVE_SUCCESS,
  JUDGES_UNMOUNT,
  SET_SELECTED_JUDGE,
} from '../types/judges.action.types'
import { DefaultJudgeSchema, DefaultJudgeState, JudgesAction, JudgesState } from '../types/judges.data.types'

export default function judges(state = DefaultJudgeState, action: JudgesAction): JudgesState {
  const matchesRequest = /^JUDGE_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  if (matchesRequest || action.type === JUDGES_RETRIEVE_REQUEST) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  switch (action.type) {
    case JUDGES_RETRIEVE_SUCCESS:
      return {
        ...state,
        isForceFetch: false,
        isCloseModal: true,
        judges: action.judges,
      }
    case JUDGE_CREATE_SUCCESS:
    case JUDGE_UPDATE_SUCCESS:
    case JUDGE_DELETE_SUCCESS:
      return {
        isForceFetch: true,
        isCloseModal: true,
        judges: [],
        selectedJudge: DefaultJudgeSchema,
      }
    case SET_SELECTED_JUDGE:
      return {
        ...state,
        isForceFetch: false,
        selectedJudge: action.selectedJudge,
      }
    case JUDGE_NOTE_SUCCESS:
    case CLIENT_CREATE_SUCCESS:
    case CLIENT_UPDATE_SUCCESS:
    case CLIENT_DELETE_SUCCESS:
      return {
        ...state,
        isForceFetch: true,
        selectedJudge: DefaultJudgeSchema,
      }
    case JUDGES_UNMOUNT:
      return {
        ...state,
        isForceFetch: true,
        selectedJudge: DefaultJudgeSchema,
      }
    default:
      return state
  }
}
