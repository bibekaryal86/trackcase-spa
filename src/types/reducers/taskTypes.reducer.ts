import {
  TASK_TYPE_CREATE_SUCCESS,
  TASK_TYPE_DELETE_SUCCESS,
  TASK_TYPE_UPDATE_SUCCESS,
  TASK_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { TaskTypeAction, TaskTypeState } from '../types/refTypes.data.types'

export const DefaultTaskTypeState: TaskTypeState = {
  taskTypes: [],
}

export default function collectionMethods(state = DefaultTaskTypeState, action: TaskTypeAction): TaskTypeState {
  switch (action.type) {
    case TASK_TYPES_RETRIEVE_SUCCESS:
      return {
        taskTypes: action.taskTypes,
      }
    case TASK_TYPE_CREATE_SUCCESS:
    case TASK_TYPE_UPDATE_SUCCESS:
    case TASK_TYPE_DELETE_SUCCESS:
      return {
        taskTypes: [], // so that it will fetch
      }
    default:
      return state
  }
}
