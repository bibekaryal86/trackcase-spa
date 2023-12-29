import {
  FORM_TYPE_CREATE_SUCCESS,
  FORM_TYPE_DELETE_SUCCESS,
  FORM_TYPE_UPDATE_SUCCESS,
  FORM_TYPES_RETRIEVE_SUCCESS,
} from '../types/ref_types.action.types'
import { FormTypeAction, FormTypeState } from '../types/ref_types.data.types'

export const DefaultFormTypeState: FormTypeState = {
  form_types: [],
}

export default function collectionMethods(state = DefaultFormTypeState, action: FormTypeAction): FormTypeState {
  switch (action.type) {
    case FORM_TYPES_RETRIEVE_SUCCESS:
      return {
        form_types: action.form_types,
      }
    case FORM_TYPE_CREATE_SUCCESS:
    case FORM_TYPE_UPDATE_SUCCESS:
    case FORM_TYPE_DELETE_SUCCESS:
      return {
        form_types: [], // so that it will fetch
      }
    default:
      return state
  }
}
