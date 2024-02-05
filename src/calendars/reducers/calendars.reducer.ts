import {
  HEARING_CALENDARS_RETRIEVE_REQUEST,
  HEARING_CALENDARS_RETRIEVE_SUCCESS,
  HEARING_CALENDARS_UNMOUNT,
  SET_SELECTED_HEARING_CALENDAR,
  SET_SELECTED_TASK_CALENDAR,
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

  const matchesSuccessHc = /^HEARING_CALENDAR_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)
  const matchesSuccessTc = /^TASK_CALENDAR_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)

  if (matchesSuccessHc || matchesSuccessTc) {
    return {
        ...state,
        isForceFetch: true,
        isCloseModal: true,
        hearingCalendars: [],
        taskCalendars: [],
        selectedHearingCalendar: DefaultHearingCalendarSchema,
        selectedTaskCalendar: DefaultTaskCalendarSchema,
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
