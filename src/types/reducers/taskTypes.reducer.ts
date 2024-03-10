import {
  TASK_TYPE_CREATE_SUCCESS,
  TASK_TYPE_DELETE_SUCCESS,
  TASK_TYPE_RETRIEVE_SUCCESS,
  TASK_TYPE_UPDATE_SUCCESS,
} from '../types/refTypes.action.types'
import { TaskTypeAction, TaskTypeState } from '../types/refTypes.data.types'

export const DefaultTaskTypeState: TaskTypeState = {
  data: [],
}

export default function taskTypes(state = DefaultTaskTypeState, action: TaskTypeAction): TaskTypeState {
  switch (action.type) {
    case TASK_TYPE_RETRIEVE_SUCCESS:
      return {
        data: action.data,
      }
    case TASK_TYPE_CREATE_SUCCESS:
    case TASK_TYPE_UPDATE_SUCCESS:
    case TASK_TYPE_DELETE_SUCCESS:
      return {
        data: [], // so that it will fetch
      }
    default:
      return state
  }
}
