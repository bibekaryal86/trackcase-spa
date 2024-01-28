import {
  FORM_CREATE_SUCCESS,
  FORM_DELETE_SUCCESS,
  FORM_NOTE_SUCCESS,
  FORM_UPDATE_SUCCESS,
  FORMS_RETRIEVE_REQUEST,
  FORMS_RETRIEVE_SUCCESS,
  FORMS_UNMOUNT,
  SET_SELECTED_FORM,
} from '../types/forms.action.types'
import { DefaultFormSchema, DefaultFormState, FormsAction, FormsState } from '../types/forms.data.types'

export default function forms(state = DefaultFormState, action: FormsAction): FormsState {
  const matchesRequest = /^FORM_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  if (matchesRequest || action.type === FORMS_RETRIEVE_REQUEST) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  switch (action.type) {
    case FORMS_RETRIEVE_SUCCESS:
      return {
        ...state,
        isForceFetch: false,
        isCloseModal: true,
        forms: action.forms,
      }
    case FORM_CREATE_SUCCESS:
    case FORM_UPDATE_SUCCESS:
    case FORM_DELETE_SUCCESS:
      return {
        isForceFetch: true,
        isCloseModal: true,
        forms: [],
        selectedForm: DefaultFormSchema,
      }
    case SET_SELECTED_FORM:
      return {
        ...state,
        isForceFetch: false,
        selectedForm: action.selectedForm,
      }
    case FORM_NOTE_SUCCESS:
      return {
        ...state,
        isForceFetch: true,
        selectedForm: DefaultFormSchema,
      }
    case FORMS_UNMOUNT:
      return {
        ...state,
        isForceFetch: true,
        selectedForm: DefaultFormSchema,
      }
    default:
      return state
  }
}