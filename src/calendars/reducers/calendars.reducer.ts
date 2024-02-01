import {
  HEARING_CALENDAR_CREATE_SUCCESS,
  HEARING_CALENDAR_DELETE_SUCCESS,
  HEARING_CALENDAR_UPDATE_SUCCESS,
  HEARING_CALENDARS_RETRIEVE_REQUEST,
  HEARING_CALENDARS_RETRIEVE_SUCCESS,
  HEARING_CALENDARS_UNMOUNT,
  SET_SELECTED_HEARING_CALENDAR,
  SET_SELECTED_TASK_CALENDAR,
  TASK_CALENDAR_CREATE_SUCCESS,
  TASK_CALENDAR_DELETE_SUCCESS,
  TASK_CALENDAR_UPDATE_SUCCESS,
  TASK_CALENDARS_RETRIEVE_REQUEST,
  TASK_CALENDARS_RETRIEVE_SUCCESS,
  TASK_CALENDARS_UNMOUNT,
} from '../types/calendars.action.types'
import {
  CalendarsAction,
  CalendarsState,
  DefaultCalendarsState,
  DefaultHearingCalendarSchema,
  DefaultTaskCalendarSchema,
} from '../types/calendars.data.types'

export default function calendars(state = DefaultCalendarsState, action: CalendarsAction): CalendarsState {
  const matchesRequestHc = /^HEARING_CALENDAR_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  const matchesRequestTc = /^TASK_CALENDAR_(CREATE|UPDATE|DELETE)_REQUEST$/.exec(action.type)
  if (
    matchesRequestHc ||
    matchesRequestTc ||
    [HEARING_CALENDARS_RETRIEVE_REQUEST, TASK_CALENDARS_RETRIEVE_REQUEST].includes(action.type)
  ) {
    return {
      ...state,
      isCloseModal: false,
    }
  }

  switch (action.type) {
    case HEARING_CALENDARS_RETRIEVE_SUCCESS:
      return {
        ...state,
        isForceFetch: false,
        isCloseModal: true,
        hearingCalendars: action.hearingCalendars,
      }
    case TASK_CALENDARS_RETRIEVE_SUCCESS:
      return {
        ...state,
        isForceFetch: false,
        isCloseModal: true,
        taskCalendars: action.taskCalendars,
      }
    case HEARING_CALENDAR_CREATE_SUCCESS:
    case HEARING_CALENDAR_UPDATE_SUCCESS:
    case HEARING_CALENDAR_DELETE_SUCCESS:
      return {
        ...state,
        isForceFetch: true,
        isCloseModal: true,
        hearingCalendars: [],
        selectedHearingCalendar: DefaultHearingCalendarSchema,
      }
    case TASK_CALENDAR_CREATE_SUCCESS:
    case TASK_CALENDAR_UPDATE_SUCCESS:
    case TASK_CALENDAR_DELETE_SUCCESS:
      return {
        ...state,
        isForceFetch: true,
        isCloseModal: true,
        taskCalendars: [],
        selectedTaskCalendar: DefaultTaskCalendarSchema,
      }
    case SET_SELECTED_HEARING_CALENDAR:
      return {
        ...state,
        isForceFetch: false,
        selectedHearingCalendar: action.selectedHearingCalendar,
      }
    case SET_SELECTED_TASK_CALENDAR:
      return {
        ...state,
        isForceFetch: false,
        selectedTaskCalendar: action.selectedTaskCalendar,
      }
    case TASK_CALENDARS_UNMOUNT:
    case HEARING_CALENDARS_UNMOUNT:
      return {
        ...state,
        isForceFetch: true,
        selectedHearingCalendar: DefaultHearingCalendarSchema,
        selectedTaskCalendar: DefaultTaskCalendarSchema,
      }
    default:
      return state
  }
}
