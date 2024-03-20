import {
  CALENDARS_READ_REQUEST,
  CALENDARS_READ_SUCCESS,
  HEARING_CALENDARS_READ_REQUEST,
  HEARING_CALENDARS_READ_SUCCESS,
  HEARING_CALENDARS_UNMOUNT,
  SET_SELECTED_HEARING_CALENDAR,
  SET_SELECTED_TASK_CALENDAR,
  TASK_CALENDARS_READ_REQUEST,
  TASK_CALENDARS_READ_SUCCESS,
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
    [CALENDARS_READ_REQUEST, HEARING_CALENDARS_READ_REQUEST, TASK_CALENDARS_READ_REQUEST].includes(action.type)
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
      isCloseModal: true,
      calendarEvents: [],
      hearingCalendars: [],
      taskCalendars: [],
      selectedHearingCalendar: DefaultHearingCalendarSchema,
      selectedTaskCalendar: DefaultTaskCalendarSchema,
    }
  }

  switch (action.type) {
    case CALENDARS_READ_SUCCESS:
      return {
        ...state,
        isCloseModal: true,
        calendarEvents: action.calendarEvents,
        hearingCalendars: action.hearingCalendars,
        taskCalendars: action.taskCalendars,
      }
    case HEARING_CALENDARS_READ_SUCCESS:
      return {
        ...state,
        isCloseModal: true,
        hearingCalendars: action.hearingCalendars,
      }
    case TASK_CALENDARS_READ_SUCCESS:
      return {
        ...state,
        isCloseModal: true,
        taskCalendars: action.taskCalendars,
      }
    case SET_SELECTED_HEARING_CALENDAR:
      return {
        ...state,
        selectedHearingCalendar: action.selectedHearingCalendar,
      }
    case SET_SELECTED_TASK_CALENDAR:
      return {
        ...state,
        selectedTaskCalendar: action.selectedTaskCalendar,
      }
    case TASK_CALENDARS_UNMOUNT:
    case HEARING_CALENDARS_UNMOUNT:
      return {
        ...state,
        selectedHearingCalendar: DefaultHearingCalendarSchema,
        selectedTaskCalendar: DefaultTaskCalendarSchema,
      }
    default:
      return state
  }
}
