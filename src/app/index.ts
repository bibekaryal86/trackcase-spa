// actions
import { getStatusesList } from './actions/statuses.action'
import { testDatabase } from './actions/testDatabase.action'
// components
import {
  addModalComponent,
  deleteModalComponent,
  handleFormChange,
  handleFormDateChange,
  hardDeleteCheckboxComponent,
  pageActionButtonsComponent,
  pageNotSelectedComponent,
  pageTitleComponent,
  pageTopLinksComponent,
  resetButtonCallback,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  tableAddButtonComponent,
  updateModalComponent,
} from './components/CommonComponents'
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
import { Modal, Modal2 } from './components/Modal'
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
  ModalState,
  NameDescBaseSchema,
  ResponseBase,
  ResponseMetadata,
  StatusBaseSchema,
  StatusSchema,
  TableData,
  TableHeaderData,
  TableOrder,
  TableRowsPerPage,
} from './types/app.data.types'
// utils
import { resetAlert, setAlert } from './utils/alerts.utils'
import { useModal } from './utils/app.hooks'
import {
  clearMessages,
  convertDateToLocaleString,
  convertToCamelCase,
  convertToTitleCase,
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
  isNumericOnly,
  isValidId,
  unmountPage,
  validateAddress,
  validateEmailAddress,
  validatePhoneNumber,
} from './utils/app.utils'
import { Async, FetchOptions, FetchRequestMetadata, FetchResponse } from './utils/fetch.utils'
import { resetSpinner, setSpinner } from './utils/spinner.utils'
import { LocalStorage, SessionStorage } from './utils/storage.utils'

// EXPORTS
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
export {
  addModalComponent,
  updateModalComponent,
  deleteModalComponent,
  handleFormChange,
  handleFormDateChange,
  hardDeleteCheckboxComponent,
  pageActionButtonsComponent,
  pageNotSelectedComponent,
  pageTitleComponent,
  pageTopLinksComponent,
  resetButtonCallback,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  tableAddButtonComponent,
}
export { Link }
export { Modal, Modal2 }
export { Switch }
export { Table }
export type { GlobalDispatch, GlobalState }
export { RESET_ALERT, RESET_SPINNER, SET_ALERT, SET_SPINNER }
export type {
  AddressBaseSchema,
  BaseModelSchema,
  ErrorDetail,
  ErrorSuccessSchema,
  ModalState,
  NameDescBaseSchema,
  ResponseBase,
  ResponseMetadata,
  StatusBaseSchema,
  StatusSchema,
  TableData,
  TableHeaderData,
  TableOrder,
  TableRowsPerPage,
}
export { DefaultErrorDetail }
export { resetAlert, setAlert }
export { useModal }
export {
  clearMessages,
  convertDateToLocaleString,
  convertToCamelCase,
  convertToTitleCase,
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
  isNumericOnly,
  isValidId,
  unmountPage,
  validateAddress,
  validateEmailAddress,
  validatePhoneNumber,
}
export { Async }
export type { FetchOptions, FetchRequestMetadata, FetchResponse }
export { resetSpinner, setSpinner }
export { LocalStorage, SessionStorage }
