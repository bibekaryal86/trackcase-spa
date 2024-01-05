import {
  FORM_TYPE_CREATE_SUCCESS,
  FORM_TYPE_DELETE_SUCCESS,
  FORM_TYPE_UPDATE_SUCCESS,
  FORM_TYPES_RETRIEVE_SUCCESS,
} from '../types/refTypes.action.types'
import { FormTypeAction, FormTypeState } from '../types/refTypes.data.types'

export const DefaultFormTypeState: FormTypeState = {
  formTypes: [],
}

export default function collectionMethods(state = DefaultFormTypeState, action: FormTypeAction): FormTypeState {
  switch (action.type) {
    case FORM_TYPES_RETRIEVE_SUCCESS:
      return {
        formTypes: action.formTypes,
      }
    case FORM_TYPE_CREATE_SUCCESS:
    case FORM_TYPE_UPDATE_SUCCESS:
    case FORM_TYPE_DELETE_SUCCESS:
      return {
        formTypes: [], // so that it will fetch
      }
    default:
      return state
  }
}
