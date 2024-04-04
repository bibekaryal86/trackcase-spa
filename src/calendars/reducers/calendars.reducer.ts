import {
  CALENDARS_READ_SUCCESS,
  HEARING_CALENDARS_READ_SUCCESS,
  TASK_CALENDARS_READ_SUCCESS,
} from '../types/calendars.action.types'
import { CalendarsAction, CalendarsState, DefaultCalendarsState } from '../types/calendars.data.types'

export default function calendars(state = DefaultCalendarsState, action: CalendarsAction): CalendarsState {
  const matchesSuccessHc = /^HEARING_CALENDARS_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)
  const matchesSuccessTc = /^TASK_CALENDARS_(CREATE|UPDATE|DELETE)_SUCCESS$/.exec(action.type)

  if (matchesSuccessHc || matchesSuccessTc) {
    return {
      ...state,
      calendarEvents: [],
      hearingCalendars: [],
      taskCalendars: [],
    }
  }

  switch (action.type) {
    case CALENDARS_READ_SUCCESS:
      return {
        ...state,
        calendarEvents: action.calendarEvents,
        hearingCalendars: action.hearingCalendars,
        taskCalendars: action.taskCalendars,
        requestMetadata: action.requestMetadata,
      }
    case HEARING_CALENDARS_READ_SUCCESS:
      return {
        ...state,
        hearingCalendars: action.hearingCalendars,
      }
    case TASK_CALENDARS_READ_SUCCESS:
      return {
        ...state,
        taskCalendars: action.taskCalendars,
      }
    default:
      return state
  }
}
