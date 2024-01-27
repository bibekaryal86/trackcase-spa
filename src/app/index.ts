// actions
import { userLogout } from './actions/logout.action'
import { addNote, deleteNote, editNote } from './actions/notes.action'
import { getStatusesList } from './actions/statuses.action'
import { testDatabase } from './actions/testDatabase.action'
// components
import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStateField,
  FormSelectStatusField,
  FormTextDateField,
  FormTextField,
  GridFormWrapper,
} from './components/FormComponents'
import Link from './components/Link'
import Modal from './components/Modal'
import Notes from './components/Notes'
import Switch from './components/Switch'
import Table from './components/Table'
// action types
import { GlobalDispatch, GlobalState } from './store/redux'
import { RESET_ALERT, RESET_SPINNER, SET_ALERT, SET_SPINNER } from './types/app.action.types'
// data types
import {
  AddressBaseSchema,
  BaseModelSchema,
  ErrorSuccessSchema,
  NameDescBaseSchema,
  NoteBaseSchema,
  NoteResponse,
  NoteSchema,
  ResponseBase,
  StatusBaseSchema,
  StatusSchema,
  TableData,
  TableHeaderData,
  TableOrder,
  TableRowsPerPage,
  UserDetails,
} from './types/app.data.types'
// utils
import { resetAlert, setAlert } from './utils/alerts.utils'
import { useStateData } from './utils/app.hooks'
import {
  clearMessages,
  convertDateToLocaleString,
  convertNotesToNotesList,
  getDate,
  getDateString,
  getEndpoint,
  getErrMsg,
  getFullAddress,
  getNumber,
  getNumericOnly,
  getStartOfTheMonth,
  getStartOfTheYear,
  isLoggedIn,
  isNumericOnly,
  unmountPage,
  validateAddress,
  validateEmailAddress,
} from './utils/app.utils'
import { Async, FetchOptions, FetchResponse } from './utils/fetch.utils'
import { resetSpinner, setSpinner } from './utils/spinner.utils'
import { LocalStorage, SessionStorage } from './utils/storage.utils'

// EXPORTS
export { userLogout }
export { addNote, editNote, deleteNote }
export { getStatusesList }
export { testDatabase }
export {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStateField,
  FormSelectStatusField,
  FormTextDateField,
  FormTextField,
  GridFormWrapper,
}
export { Link }
export { Modal }
export { Notes }
export { Switch}
export {Table}
export type { GlobalDispatch, GlobalState }
export { RESET_ALERT, RESET_SPINNER, SET_ALERT, SET_SPINNER }
export type {
  AddressBaseSchema,
  BaseModelSchema,
  ErrorSuccessSchema,
  NameDescBaseSchema,
  NoteBaseSchema,
  NoteResponse,
  NoteSchema,
  ResponseBase,
  StatusBaseSchema,
  StatusSchema,
  TableData,
  TableHeaderData,
  TableOrder,
  TableRowsPerPage,
  UserDetails,
}
export { resetAlert, setAlert }
export { useStateData }
export {
  clearMessages,
  convertDateToLocaleString,
  convertNotesToNotesList,
  getDate,
  getDateString,
  getEndpoint,
  getErrMsg,
  getFullAddress,
  getNumber,
  getNumericOnly,
  getStartOfTheMonth,
  getStartOfTheYear,
  isLoggedIn,
  isNumericOnly,
  unmountPage,
  validateAddress,
  validateEmailAddress,
}
export { Async }
export type { FetchOptions, FetchResponse}
export { resetSpinner, setSpinner }
export { LocalStorage, SessionStorage }
