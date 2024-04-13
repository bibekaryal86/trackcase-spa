import React from 'react'

import { GlobalDispatch, GlobalState } from '@app/store/redux'
import { getEndpoint, getErrMsg } from '@app/utils/app.utils'
import { Async, FetchOptions, FetchRequestMetadata } from '@app/utils/fetch.utils'
import {
  ACTION_SUCCESS,
  ACTION_TYPES,
  ActionTypes,
  CALENDAR_TYPES,
  HTTP_METHODS,
  ID_DEFAULT,
  SOMETHING_WENT_WRONG,
  TYPE_IS_INCORRECT,
  TYPE_IS_MISSING,
} from '@constants/index'

import {
  CALENDARS_COMPLETE,
  CALENDARS_READ_FAILURE,
  CALENDARS_READ_REQUEST,
  CALENDARS_READ_SUCCESS,
  HEARING_CALENDARS_COMPLETE,
  HEARING_CALENDARS_READ_FAILURE,
  HEARING_CALENDARS_READ_REQUEST,
  TASK_CALENDARS_COMPLETE,
  TASK_CALENDARS_READ_FAILURE,
  TASK_CALENDARS_READ_REQUEST,
} from '../types/calendars.action.types'
import {
  CalendarResponse,
  HearingCalendarBase,
  HearingCalendarResponse,
  HearingCalendarSchema,
  TaskCalendarBase,
  TaskCalendarResponse,
  TaskCalendarSchema,
} from '../types/calendars.data.types'
import { calendarDispatch, checkCorrectCalendarTypes } from '../utils/calendars.utils'

export const calendarsAction = ({
  type,
  action,
  calendarsRequest,
  id,
  isRestore,
  isHardDelete,
}: {
  type?: string
  action: ActionTypes
  calendarsRequest?: HearingCalendarBase | TaskCalendarBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<HearingCalendarResponse | TaskCalendarResponse> => {
    if (!type) {
      return { data: [], detail: { error: TYPE_IS_MISSING } }
    } else if (!checkCorrectCalendarTypes(type)) {
      return { data: [], detail: { error: TYPE_IS_INCORRECT } }
    }

    if (action === ACTION_TYPES.RESTORE) {
      action = ACTION_TYPES.UPDATE
    }
    const typeRequest = `${type}S_${action}_REQUEST`
    const typeSuccess = `${type}S_${action}_SUCCESS`
    const typeFailure = `${type}S_${action}_FAILURE`
    const typeComplete = `${type}S_COMPLETE`
    dispatch(calendarDispatch({ type: typeRequest }))

    let endpoint = ''
    let options: Partial<FetchOptions> = {}

    if (action === ACTION_TYPES.CREATE) {
      endpoint =
        type === CALENDAR_TYPES.HEARING_CALENDAR
          ? getEndpoint(process.env.CALENDAR_HEARING_CREATE as string)
          : getEndpoint(process.env.CALENDAR_TASK_CREATE as string)
      options = {
        method: HTTP_METHODS.POST,
        requestBody: calendarsRequest,
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint =
        type === CALENDAR_TYPES.HEARING_CALENDAR
          ? getEndpoint(process.env.CALENDAR_HEARING_UPDATE as string)
          : getEndpoint(process.env.CALENDAR_TASK_UPDATE as string)
      options = {
        method: HTTP_METHODS.PUT,
        requestBody: calendarsRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { calendar_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint =
        type === CALENDAR_TYPES.HEARING_CALENDAR
          ? getEndpoint(process.env.CALENDAR_HEARING_DELETE as string)
          : getEndpoint(process.env.CALENDAR_TASK_DELETE as string)
      options = {
        method: HTTP_METHODS.DELETE,
        pathParams: { calendar_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    try {
      const calendarResponse = (await Async.fetch(endpoint, options)) as HearingCalendarResponse | TaskCalendarResponse
      if (calendarResponse.detail) {
        dispatch(calendarDispatch({ type: typeFailure, error: getErrMsg(calendarResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          type === CALENDAR_TYPES.HEARING_CALENDAR
            ? dispatch(
                calendarDispatch({
                  type: typeSuccess,
                  hearingCalendars: calendarResponse.data as HearingCalendarSchema[],
                }),
              )
            : dispatch(
                calendarDispatch({ type: typeSuccess, taskCalendars: calendarResponse.data as TaskCalendarSchema[] }),
              )
        } else {
          dispatch(calendarDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'CALENDAR') }))
        }
      }
      return calendarResponse
    } catch (error) {
      console.log(`${type} ${action} Error: `, error)
      dispatch(calendarDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(calendarDispatch({ type: typeComplete }))
    }
  }
}

export const getCalendars = (requestMetadata?: Partial<FetchRequestMetadata>) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(calendarDispatch({ type: CALENDARS_READ_REQUEST }))

    let calendarResponse: CalendarResponse = { data: { calendarEvents: [], hearingCalendars: [], taskCalendars: [] } }

    if (requestMetadata === getStore().calendars.requestMetadata) {
      // no need to fetch request, metadata is same
      calendarResponse.data.calendarEvents = getStore().calendars.calendarEvents
      calendarResponse.data.hearingCalendars = getStore().calendars.hearingCalendars
      calendarResponse.data.taskCalendars = getStore().calendars.taskCalendars
    }
    const endpoint = getEndpoint(process.env.CALENDARS_ALL as string)
    const options: Partial<FetchOptions> = {
      method: HTTP_METHODS.GET,
      metadataParams: requestMetadata,
    }

    try {
      if (calendarResponse.data.calendarEvents.length <= 0) {
        calendarResponse = (await Async.fetch(endpoint, options)) as CalendarResponse
      }
      if (calendarResponse.detail) {
        dispatch(calendarDispatch({ type: CALENDARS_READ_FAILURE, error: getErrMsg(calendarResponse.detail) }))
      } else {
        dispatch(
          calendarDispatch({
            type: CALENDARS_READ_SUCCESS,
            calendarEvents: calendarResponse.data.calendarEvents,
            hearingCalendars: calendarResponse.data.hearingCalendars,
            taskCalendars: calendarResponse.data.taskCalendars,
            requestMetadata: requestMetadata,
          }),
        )
      }
    } catch (error) {
      console.log(`Get Calendars Error: `, error)
      dispatch(calendarDispatch({ type: CALENDARS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(calendarDispatch({ type: CALENDARS_COMPLETE }))
    }
  }
}

export const getHearingCalendar = (calendarId: number, isIncludeExtra?: boolean) => {
  return async (
    dispatch: React.Dispatch<GlobalDispatch>,
    state: GlobalState,
  ): Promise<HearingCalendarSchema | undefined> => {
    dispatch(calendarDispatch({ type: HEARING_CALENDARS_READ_REQUEST }))
    let oneHearingCalendar = undefined

    try {
      const hearingCalendarsInStore = state.calendars.hearingCalendars
      if (hearingCalendarsInStore) {
        oneHearingCalendar = hearingCalendarsInStore.find((x) => x.id === calendarId)

        if (
          isIncludeExtra &&
          oneHearingCalendar &&
          (!oneHearingCalendar.taskCalendars || !oneHearingCalendar.taskCalendars.length)
        ) {
          oneHearingCalendar = undefined
        }
      }

      if (oneHearingCalendar) {
        return oneHearingCalendar
      } else {
        const endpoint = getEndpoint(process.env.CALENDAR_HEARING_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: calendarId,
          isIncludeExtra: isIncludeExtra === true,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const hearingCalendarResponse = (await Async.fetch(endpoint, options)) as HearingCalendarResponse
        if (hearingCalendarResponse.detail) {
          dispatch(
            calendarDispatch({
              type: HEARING_CALENDARS_READ_FAILURE,
              error: getErrMsg(hearingCalendarResponse.detail),
            }),
          )
        } else {
          oneHearingCalendar = hearingCalendarResponse.data.find((x) => x.id === calendarId)
        }
      }
      return oneHearingCalendar
    } catch (error) {
      console.log(`Get Hearing Calendar Error: `, error)
      dispatch(calendarDispatch({ type: HEARING_CALENDARS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneHearingCalendar
    } finally {
      dispatch(calendarDispatch({ type: HEARING_CALENDARS_COMPLETE }))
    }
  }
}

export const getTaskCalendar = (calendarId: number, isIncludeExtra?: boolean) => {
  return async (
    dispatch: React.Dispatch<GlobalDispatch>,
    state: GlobalState,
  ): Promise<TaskCalendarSchema | undefined> => {
    dispatch(calendarDispatch({ type: TASK_CALENDARS_READ_REQUEST }))
    let oneTaskCalendar = undefined

    try {
      const taskCalendarsInStore = state.calendars.taskCalendars
      if (taskCalendarsInStore) {
        oneTaskCalendar = taskCalendarsInStore.find((x) => x.id === calendarId)
      }

      if (oneTaskCalendar) {
        return oneTaskCalendar
      } else {
        const endpoint = getEndpoint(process.env.CALENDAR_TASK_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: calendarId,
          isIncludeExtra: isIncludeExtra === true,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const taskCalendarResponse = (await Async.fetch(endpoint, options)) as TaskCalendarResponse
        if (taskCalendarResponse.detail) {
          dispatch(
            calendarDispatch({ type: TASK_CALENDARS_READ_FAILURE, error: getErrMsg(taskCalendarResponse.detail) }),
          )
        } else {
          oneTaskCalendar = taskCalendarResponse.data.find((x) => x.id === calendarId)
        }
      }
      return oneTaskCalendar
    } catch (error) {
      console.log(`Get Task Calendar Error: `, error)
      dispatch(calendarDispatch({ type: TASK_CALENDARS_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneTaskCalendar
    } finally {
      dispatch(calendarDispatch({ type: TASK_CALENDARS_COMPLETE }))
    }
  }
}
