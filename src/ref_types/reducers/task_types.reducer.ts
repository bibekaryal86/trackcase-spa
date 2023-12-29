import {
  TASK_TYPE_CREATE_SUCCESS,
  TASK_TYPE_DELETE_SUCCESS,
  TASK_TYPE_UPDATE_SUCCESS,
  TASK_TYPES_RETRIEVE_SUCCESS,
} from '../types/ref_types.action.types'
import { TaskTypeAction, TaskTypeState } from '../types/ref_types.data.types'

export const DefaultTaskTypeState: TaskTypeState = {
  task_types: [],
}

export default function collectionMethods(state = DefaultTaskTypeState, action: TaskTypeAction): TaskTypeState {
  switch (action.type) {
    case TASK_TYPES_RETRIEVE_SUCCESS:
      return {
        task_types: action.task_types,
      }
    case TASK_TYPE_CREATE_SUCCESS:
    case TASK_TYPE_UPDATE_SUCCESS:
    case TASK_TYPE_DELETE_SUCCESS:
      return {
        task_types: [], // so that it will fetch
      }
    default:
      return state
  }
}
