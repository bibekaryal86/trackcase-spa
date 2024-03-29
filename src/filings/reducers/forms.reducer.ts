import {
  FORM_CREATE_SUCCESS,
  FORM_DELETE_SUCCESS,
  FORM_UPDATE_SUCCESS,
  FORMS_READ_REQUEST,
  FORMS_READ_SUCCESS,
  FORMS_UNMOUNT,
  SET_SELECTED_FORM,
} from '../types/forms.action.types'
import { DefaultFormSchema, DefaultFormState, FormsAction, FormsState } from '../types/forms.data.types'

export default function forms(state = DefaultFormState, action: FormsAction): FormsState {
  const matchesRequest = /^FORM_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  if (matchesRequest || action.type === FORMS_READ_REQUEST) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  switch (action.type) {
    case FORMS_READ_SUCCESS:
      return {
        ...state,
        isCloseModal: true,
        forms: action.forms,
      }
    case FORM_CREATE_SUCCESS:
    case FORM_UPDATE_SUCCESS:
    case FORM_DELETE_SUCCESS:
      return {
        isCloseModal: true,
        forms: [],
        selectedForm: DefaultFormSchema,
      }
    case SET_SELECTED_FORM:
      return {
        ...state,
        selectedForm: action.selectedForm,
      }
    case FORMS_UNMOUNT:
      return {
        ...state,
        selectedForm: DefaultFormSchema,
      }
    default:
      return state
  }
}
