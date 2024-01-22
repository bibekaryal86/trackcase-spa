// actions
import { userLogout } from './actions/logout.action'
import { addNote, deleteNote, editNote } from './actions/notes.action'
import { getStatusesList } from './actions/statuses.action'
import { testDatabase } from './actions/testDatabase.action'
// components
import {
  FormCommentsField,
  FormSelectField,
  FormSelectState,
  FormSelectStatus,
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
import {
  clearMessages,
  convertDateToLocaleString,
  convertNotesToNotesList,
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
export { testDatabase }
export { userLogout }
export { getStatusesList }
export { addNote, editNote, deleteNote }
export { convertNotesToNotesList }
export {
  GridFormWrapper,
  FormTextField,
  FormSelectField,
  FormSelectState,
  FormSelectStatus,
  FormCommentsField,
  Link,
  Modal,
  Notes,
  Switch,
  Table,
}
export { SET_ALERT, RESET_ALERT, SET_SPINNER, RESET_SPINNER }
export type { GlobalState, GlobalDispatch }
export type {
  UserDetails,
  AddressBaseSchema,
  BaseModelSchema,
  NameDescBaseSchema,
  StatusBaseSchema,
  StatusSchema,
  ErrorSuccessSchema,
  ResponseBase,
  TableData,
  TableHeaderData,
  TableOrder,
  TableRowsPerPage,
  NoteBaseSchema,
  NoteSchema,
  NoteResponse,
  FetchOptions,
  FetchResponse,
}
export { Async }
export { LocalStorage, SessionStorage }
export { setAlert, resetAlert }
export { setSpinner, resetSpinner }
export {
  clearMessages,
  convertDateToLocaleString,
  isLoggedIn,
  getEndpoint,
  getErrMsg,
  getFullAddress,
  getStartOfTheYear,
  getStartOfTheMonth,
  unmountPage,
  validateAddress,
  isNumericOnly,
  validateEmailAddress,
  getNumber,
  getNumericOnly,
}
