// NOT RECOMMENDED HARD CODED IDS:
// ids are 1 because inserted during migration
export const DUE_AT_HEARING_ID = 1

export const USE_MEDIA_QUERY_INPUT = '(max-width: 600px)'

export const REGEX_LOGIN_INPUT_PATTERN = /^[A-Za-z0-9]+$/
export const REGEX_DATE_FORMAT = new RegExp('[0-9]{4}\\-[0-9]{2}\\-[0-9]{2}')
export const REGEX_CURRENCY_FORMAT = new RegExp('^\\$|\\-\\$(\\d{1,3}(\\,\\d{3})*|(\\d+))(\\.\\d{1,2})?$')

export const DATE_FORMAT = 'YYYY-MM-DD'

export const DRAWER_WIDTH: number = 240

export const ACTION_ADD = 'add'
export const ACTION_UPDATE = 'update'
export const ACTION_DELETE = 'delete'

export const BUTTON_ADD = 'Add'
export const BUTTON_UPDATE = 'Update'
export const BUTTON_DELETE = 'Delete'
export const BUTTON_CANCEL = 'Cancel'
export const BUTTON_RESET = 'Reset'
export const BUTTON_CLOSE = 'Close'

export const ALERT_TYPE_SUCCESS = 'success'
export const ALERT_TYPE_FAILURE = 'error'
export const ALERT_TYPE_INFO = 'info'
export const ALERT_TYPE_WARNING = 'warning'

export const ID_DEFAULT = -1
export const ID_ACTION_BUTTON = -2
export const ID_LIST = -3
export const ID_NUMBER = -4

export const CHECK_BOX_OPTIONS_YES_NO = [
  { value: 'YES', text: 'YES' },
  { value: 'NO', text: 'NO' },
]

// BROWSER STORAGE
export const IS_DARK_MODE = 'isDarkMode'
export const IS_OPEN_DRAWER = 'isOpenDrawer'
export const FORCE_LOGOUT = 'forceLogout'

// ALERT MESSAGES
export const SOMETHING_WENT_WRONG = 'Something Went Wrong! Please Try Again!!'
export const INVALID_SIGNIN = 'Invalid Input! Please Try Again!!'
export const FAIL_SIGNIN = 'Invalid Username and/or Password! Please Try Again!!'
export const SIGNIN_FIRST = 'Please Sign In First!'
export const INVALID_SESSION = 'Session Invalidated Due To Inactivity/Expiry! Please Sign In Again to Continue!!'

export const CREATE_SUCCESS = (what: string) => `Add ${what} Success!`
export const UPDATE_SUCCESS = (what: string) => `Edit ${what} Success!`
export const DELETE_SUCCESS = (what: string) => `Delete ${what} Success!`

// CALENDAR TYPES
export const CALENDAR_OBJECT_TYPES = Object.freeze({
  HEARING: 'HEARING_CALENDAR',
  TASK: 'TASK_CALENDAR',
})

// CALENDAR TYPE EVENTS BG-COLOR MAP
export const CALENDAR_EVENT_BG_COLOR = new Map([
  ['MASTER', '#1976d2'],
  ['MERIT', '#1976d2'],
  ['DUE AT HEARING', '#1976d2'],
  ['DOCUMENT PREPARATION', '#1976d2'],
])

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
