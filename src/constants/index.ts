// NOT RECOMMENDED HARD CODED IDS:
// ids are 1 because inserted during migration
export const DUE_AT_HEARING_ID = 1

export const USE_MEDIA_QUERY_INPUT = '(max-width: 600px)'

export const REGEX_LOGIN_INPUT_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/
export const REGEX_LOGIN_PASSWORD_PATTERN = /^[A-Za-z0-9]+$/
export const REGEX_DATE_FORMAT = new RegExp('[0-9]{4}\\-[0-9]{2}\\-[0-9]{2}')
export const REGEX_CURRENCY_FORMAT = new RegExp('^\\$|\\-\\$(\\d{1,3}(\\,\\d{3})*|(\\d+))(\\.\\d{1,2})?$')

export const DATE_FORMAT = 'YYYY-MM-DD'

export const ACTION_ADD = 'add'
export const ACTION_UPDATE = 'update'
export const ACTION_DELETE = 'delete'

export const BUTTON_ADD = 'Add'
export const BUTTON_UPDATE = 'Update'
export const BUTTON_DELETE = 'Delete'
export const BUTTON_CANCEL = 'Cancel'
export const BUTTON_RESET = 'Reset'

export const ALERT_TYPE_SUCCESS = 'success'
export const ALERT_TYPE_FAILURE = 'error'
export const ALERT_TYPE_INFO = 'info'
export const ALERT_TYPE_WARNING = 'warning'

export const AMOUNT_DEFAULT = -1.0
export const ID_DEFAULT = -1
export const ID_ACTION_BUTTON = -2

export const CHECK_BOX_OPTIONS_YES_NO = [
  { value: 'YES', text: 'YES' },
  { value: 'NO', text: 'NO' },
]

// BROWSER STORAGE
export const IS_DARK_MODE = 'isDarkMode'
export const FORCE_LOGOUT = 'forceLogout'

// ALERT MESSAGES
export const SOMETHING_WENT_WRONG = 'Something went wrong, please try again...'
export const INVALID_INPUT = 'Required inputs are invalid/empty, please try again...'
export const INVALID_PASSWORD = 'Passwords do not match, please try again...'
export const SIGNIN_FIRST = 'Please sign in first...'
export const INVALID_SESSION = 'Session invalidated due to inactivity/expiry, please sign in again to continue...'
export const INCOMPLETE_PERMISSION = 'Incomplete permission, redirected to home...'
export const SIGNUP_SUCCESS =
  'Signup successful, please check your inbox to validate your account. Account can only be used after validation...'
export const VALIDATE_SUCCESS = 'Email validation successful, please sign in to continue...'
export const VALIDATE_FAILURE = 'Email validation failure, link may have expired, please try again...'
export const RESET_INIT_SUCCESS = 'Reset email sent, please check your inbox to reset your account...'
export const RESET_INIT_FAILURE = 'Account reset failure, link may have expired, please try again...'
export const RESET_EXIT_SUCCESS = 'Account reset successful, please sign in to continue...'

export const CREATE_SUCCESS = (what: string) => `Add ${what} Success!`
export const UPDATE_SUCCESS = (what: string) => `Edit ${what} Success!`
export const DELETE_SUCCESS = (what: string) => `Delete ${what} Success!`

// user signin/signup/reset/validate page
export const LOGIN_SHOW_FORM_TYPE = Object.freeze({
  SIGNIN: 'SIGNIN',
  SIGNUP: 'SIGNUP',
  RESET_INIT: 'RESET_INIT',
  RESET_EXIT: 'RESET_EXIT',
  VALIDATE: 'VALIDATE',
})
export type LoginShowFormType = keyof typeof LOGIN_SHOW_FORM_TYPE

// actions
export const ACTION_TYPES = Object.freeze({
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
  GET: 'GET',
})
export type ActionTypes = keyof typeof ACTION_TYPES

// buttons
export const BUTTON_TYPES = Object.freeze({
  Add: 'Add',
  Update: 'Update',
  Delete: 'Delete',
  Reset: 'Reset',
  Cancel: 'Cancel',
  Restore: 'Restore',
})
export type ButtonTypes = keyof typeof BUTTON_TYPES

// REF TYPES
export const REF_TYPES_REGISTRY = Object.freeze({
  COMPONENT_STATUS: 'COMPONENT_STATUS',
  CASE_TYPE: 'CASE_TYPE',
  COLLECTION_METHOD: 'COLLECTION_METHOD',
  FILING_TYPE: 'FILING_TYPE',
  HEARING_TYPE: 'HEARING_TYPE',
  TASK_TYPE: 'TASK_TYPE',
})
export type RefTypesRegistry = keyof typeof REF_TYPES_REGISTRY

export const COMPONENT_STATUS_NAME = Object.freeze({
  CALENDAR: 'CALENDAR',
  COURT_CASE: 'COURT_CASE',
  CLIENT: 'CLIENT',
  COLLECTION: 'COLLECTION',
  COURT: 'COURT',
  FILING: 'FILING',
  JUDGE: 'JUDGE',
  APP_USER: 'APP_USER',
  APP_ROLE: 'APP_ROLE',
})
export type ComponentStatusName = keyof typeof COMPONENT_STATUS_NAME

export const COMPONENT_STATUS_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DISABLED: 'DISABLED',
  CLOSED: 'CLOSED',
  RETIRED: 'RETIRED',
  FILING: 'COMPLETED',
  JUDGE: 'TRANSFERRED',
  APP_USER: 'CLOSED',
  APP_ROLE: 'PROCESSING',
  PAST_DUE: 'PAST_DUE',
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  EVIDENCE: 'EVIDENCE',
  CREATED: 'CREATED',
  RECEIVED: 'RECEIVED',
  WAIVED: 'WAIVED',
})
export type ComponentStatusStatus = keyof typeof COMPONENT_STATUS_STATUS

// CALENDAR TYPES
export const CALENDAR_TYPES = Object.freeze({
  HEARING_CALENDAR: 'HEARING_CALENDAR',
  TASK_CALENDAR: 'TASK_CALENDAR',
})
export type CalendarTypesRegistry = keyof typeof CALENDAR_TYPES

// COLLECTION TYPES
export const COLLECTION_TYPES = Object.freeze({
  CASE_COLLECTION: 'CASE_COLLECTION',
  CASH_COLLECTION: 'CASH_COLLECTION',
})
export type CollectionTypesRegistry = keyof typeof COLLECTION_TYPES

// CASE PAGE TABS
export const CASE_TABS = Object.freeze({
  FORMS: 'FORMS',
  CALENDARS: 'CALENDARS',
  COLLECTIONS: 'COLLECTIONS',
})

// USER ADMIN TABS
export const USER_ADMIN_REGISTRY = Object.freeze({
  APP_USERS: 'APP_USERS',
  APP_ROLES: 'APP_ROLES',
  APP_PERMISSIONS: 'APP_PERMISSIONS',
  APP_USERS_ROLES: 'APP_USERS_ROLES',
  APP_ROLES_PERMISSIONS: 'APP_ROLES_PERMISSIONS',
})
export type UserAdminRegistry = keyof typeof USER_ADMIN_REGISTRY

// STATES
export const STATES_LIST = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
]
