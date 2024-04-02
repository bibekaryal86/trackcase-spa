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
export const SOMETHING_WENT_WRONG = 'SOMETHING WENT WRONG, PLEASE TRY AGAIN...'
export const INVALID_INPUT = 'REQUIRED INPUTS ARE EMPTY/INVALID, PLEASE TRY AGAIN...'
export const INVALID_PASSWORD = 'PASSWORDS DO NOT MATCH, PLEASE TRY AGAIN...'
export const SIGNIN_FIRST = 'PLEASE SIGN IN FIRST...'
export const INVALID_SESSION = 'SESSION INVALIDATED DUE TO INACTIVITY/EXPIRY, PLEASE SIGN IN AGAIN TO CONTINUE...'
export const INCOMPLETE_PERMISSION = 'INCOMPLETE PERMISSION, REDIRECTED TO HOME...'
export const SIGNUP_SUCCESS = 'SIGNUP SUCCESSFUL, PLEASE CHECK YOUR INBOX TO VALIDATE YOUR ACCOUNT...'
export const VALIDATE_SUCCESS = 'EMAIL VALIDATION SUCCESSFUL, PLEASE SIGN IN TO CONTINUE...'
export const VALIDATE_FAILURE = 'EMAIL VALIDATION FAILURE, LINK MAY HAVE EXPIRED, PLEASE TRY AGAIN...'
export const RESET_INIT_SUCCESS = 'RESET EMAIL SENT, PLEASE CHECK YOUR INBOX TO RESET YOUR ACCOUNT...'
export const RESET_INIT_FAILURE = 'ACCOUNT RESET FAILURE, LINK MAY HAVE EXPIRED, PLEASE TRY AGAIN...'
export const RESET_EXIT_SUCCESS = 'ACCOUNT RESET SUCCESSFUL, PLEASE SIGN IN TO CONTINUE...'

export const ACTION_SUCCESS = (action: ActionTypes, what: string) => {
  if (action === ACTION_TYPES.CREATE) {
    return CREATE_SUCCESS(what)
  } else if (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.RESTORE) {
    return UPDATE_SUCCESS(what)
  } else if (action === ACTION_TYPES.DELETE) {
    return DELETE_SUCCESS(what)
  }
  return ''
}
export const CREATE_SUCCESS = (what: string) => `CREATE ${what} SUCCESS!`
export const UPDATE_SUCCESS = (what: string) => `UPDATE ${what} SUCCESS!`
export const DELETE_SUCCESS = (what: string) => `DELETE ${what} SUCCESS!`

export const HTTP_METHODS = Object.freeze({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
})
export type HttpMethods = keyof typeof HTTP_METHODS

export const LOGIN_SHOW_FORM_TYPE = Object.freeze({
  SIGNIN: 'SIGNIN',
  SIGNUP: 'SIGNUP',
  RESET_INIT: 'RESET_INIT',
  RESET_EXIT: 'RESET_EXIT',
  VALIDATE: 'VALIDATE',
})
export type LoginShowFormType = keyof typeof LOGIN_SHOW_FORM_TYPE

export const ALERT_TYPES = Object.freeze({
  SUCCESS: 'SUCCESS',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
})
export type AlertTypes = keyof typeof ALERT_TYPES

export const ACTION_TYPES = Object.freeze({
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
  RESET: 'RESET',
  CANCEL: 'CANCEL',
})
export type ActionTypes = keyof typeof ACTION_TYPES

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
  CALENDARS: 'CALENDARS',
  COURT_CASES: 'COURT_CASES',
  CLIENTS: 'CLIENTS',
  COLLECTIONS: 'COLLECTIONS',
  COURTS: 'COURTS',
  FILINGS: 'FILINGS',
  JUDGES: 'JUDGES',
  APP_USERS: 'APP_USERS',
  REF_TYPES: 'REF_TYPES',
})
export type ComponentStatusName = keyof typeof COMPONENT_STATUS_NAME

export const COMPONENT_STATUS_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  APPROVED: 'APPROVED',
  CLOSED: 'CLOSED',
  COMPLETED: 'COMPLETED',
  CREATED: 'CREATED',
  DENIED: 'DENIED',
  DISABLED: 'DISABLED',
  EVIDENCE: 'EVIDENCE',
  INACTIVE: 'INACTIVE',
  PAST_DUE: 'PAST_DUE',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  RECEIVED: 'RECEIVED',
  RETIRED: 'RETIRED',
  SUBMITTED: 'SUBMITTED',
  TRANSFERRED: 'TRANSFERRED',
  WAIVED: 'WAIVED',
  WITHDRAWN: 'WITHDRAWN',
})
export type ComponentStatusStatus = keyof typeof COMPONENT_STATUS_STATUS

// CALENDAR TYPES
export const CALENDAR_TYPES = Object.freeze({
  HEARING_CALENDAR: 'HEARING_CALENDAR',
  TASK_CALENDAR: 'TASK_CALENDAR',
})
export type CalendarTypes = keyof typeof CALENDAR_TYPES

// COLLECTION TYPES
export const COLLECTION_TYPES = Object.freeze({
  CASE_COLLECTION: 'CASE_COLLECTION',
  CASH_COLLECTION: 'CASH_COLLECTION',
})
export type CollectionTypes = keyof typeof COLLECTION_TYPES

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
  { name: 'ALABAMA', abbreviation: 'AL' },
  { name: 'ALASKA', abbreviation: 'AK' },
  { name: 'ARIZONA', abbreviation: 'AZ' },
  { name: 'ARKANSAS', abbreviation: 'AR' },
  { name: 'CALIFORNIA', abbreviation: 'CA' },
  { name: 'COLORADO', abbreviation: 'CO' },
  { name: 'CONNECTICUT', abbreviation: 'CT' },
  { name: 'DELAWARE', abbreviation: 'DE' },
  { name: 'FLORIDA', abbreviation: 'FL' },
  { name: 'GEORGIA', abbreviation: 'GA' },
  { name: 'HAWAII', abbreviation: 'HI' },
  { name: 'IDAHO', abbreviation: 'ID' },
  { name: 'ILLINOIS', abbreviation: 'IL' },
  { name: 'INDIANA', abbreviation: 'IN' },
  { name: 'IOWA', abbreviation: 'IA' },
  { name: 'KANSAS', abbreviation: 'KS' },
  { name: 'KENTUCKY', abbreviation: 'KY' },
  { name: 'LOUISIANA', abbreviation: 'LA' },
  { name: 'MAINE', abbreviation: 'ME' },
  { name: 'MARYLAND', abbreviation: 'MD' },
  { name: 'MASSACHUSETTS', abbreviation: 'MA' },
  { name: 'MICHIGAN', abbreviation: 'MI' },
  { name: 'MINNESOTA', abbreviation: 'MN' },
  { name: 'MISSISSIPPI', abbreviation: 'MS' },
  { name: 'MISSOURI', abbreviation: 'MO' },
  { name: 'MONTANA', abbreviation: 'MT' },
  { name: 'NEBRASKA', abbreviation: 'NE' },
  { name: 'NEVADA', abbreviation: 'NV' },
  { name: 'NEW HAMPSHIRE', abbreviation: 'NH' },
  { name: 'NEW JERSEY', abbreviation: 'NJ' },
  { name: 'NEW MEXICO', abbreviation: 'NM' },
  { name: 'NEW YORK', abbreviation: 'NY' },
  { name: 'NORTH CAROLINA', abbreviation: 'NC' },
  { name: 'NORTH DAKOTA', abbreviation: 'ND' },
  { name: 'OHIO', abbreviation: 'OH' },
  { name: 'OKLAHOMA', abbreviation: 'OK' },
  { name: 'OREGON', abbreviation: 'OR' },
  { name: 'PENNSYLVANIA', abbreviation: 'PA' },
  { name: 'RHODE ISLAND', abbreviation: 'RI' },
  { name: 'SOUTH CAROLINA', abbreviation: 'SC' },
  { name: 'SOUTH DAKOTA', abbreviation: 'SD' },
  { name: 'TENNESSEE', abbreviation: 'TN' },
  { name: 'TEXAS', abbreviation: 'TX' },
  { name: 'UTAH', abbreviation: 'UT' },
  { name: 'VERMONT', abbreviation: 'VT' },
  { name: 'VIRGINIA', abbreviation: 'VA' },
  { name: 'WASHINGTON', abbreviation: 'WA' },
  { name: 'WEST VIRGINIA', abbreviation: 'WV' },
  { name: 'WISCONSIN', abbreviation: 'WI' },
  { name: 'WYOMING', abbreviation: 'WY' },
]
