// actions
import { getAllRefTypes } from './actions/all_ref_types.action'
import { getStatusesList } from './actions/statuses.action'
import { testDatabase } from './actions/testDatabase.action'
// components
import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStateField,
  FormSelectStatusField,
  FormTextField,
  GridFormWrapper,
} from './components/FormFields'
import Link from './components/Link'
import Modal from './components/Modal'
import Switch from './components/Switch'
import Table from './components/Table'
// action types
import { GlobalDispatch, GlobalState } from './store/redux'
import { RESET_ALERT, RESET_SPINNER, SET_ALERT, SET_SPINNER } from './types/app.action.types'
// data types
import {
  AddressBaseSchema,
  BaseModelSchema,
  DefaultErrorDetail,
  ErrorDetail,
  ErrorSuccessSchema,
  NameDescBaseSchema,
  ResponseBase,
  ResponseMetadata,
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
  getComments,
  getCurrency,
  getDayjs,
  getDayjsString,
  getEndpoint,
  getErrMsg,
  getFullAddress,
  getNumber,
  getNumericOnly,
  getStartOfTheMonth,
  getStartOfTheYear,
  getString,
  isGetDarkMode,
  isLoggedIn,
  isNumericOnly,
  unmountPage,
  validateAddress,
  validateEmailAddress,
  validatePhoneNumber,
} from './utils/app.utils'
import { Async, FetchOptions, FetchResponse } from './utils/fetch.utils'
import { resetSpinner, setSpinner } from './utils/spinner.utils'
import { LocalStorage, SessionStorage } from './utils/storage.utils'

// EXPORTS
export { getAllRefTypes }
export { getStatusesList }
export { testDatabase }
export {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStateField,
  FormSelectStatusField,
  FormTextField,
  GridFormWrapper,
}
export { Link }
export { Modal }
export { Switch }
export { Table }
export type { GlobalDispatch, GlobalState }
export { RESET_ALERT, RESET_SPINNER, SET_ALERT, SET_SPINNER }
export type {
  AddressBaseSchema,
  BaseModelSchema,
  ErrorDetail,
  ErrorSuccessSchema,
  NameDescBaseSchema,
  ResponseBase,
  ResponseMetadata,
  StatusBaseSchema,
  StatusSchema,
  TableData,
  TableHeaderData,
  TableOrder,
  TableRowsPerPage,
  UserDetails,
}
export { DefaultErrorDetail }
export { resetAlert, setAlert }
export { useStateData }
export {
  clearMessages,
  convertDateToLocaleString,
  getComments,
  getCurrency,
  getDayjs,
  getDayjsString,
  getEndpoint,
  getErrMsg,
  getFullAddress,
  getNumber,
  getNumericOnly,
  getStartOfTheMonth,
  getStartOfTheYear,
  getString,
  isGetDarkMode,
  isLoggedIn,
  isNumericOnly,
  unmountPage,
  validateAddress,
  validateEmailAddress,
  validatePhoneNumber,
}
export { Async }
export type { FetchOptions, FetchResponse }
export { resetSpinner, setSpinner }
export { LocalStorage, SessionStorage }
