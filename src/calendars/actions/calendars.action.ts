import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import {
  CALENDAR_OBJECT_TYPES,
  CREATE_SUCCESS,
  DELETE_SUCCESS,
  SOMETHING_WENT_WRONG,
  UPDATE_SUCCESS,
} from '../../constants'
import { SET_SELECTED_HEARING_CALENDAR, SET_SELECTED_TASK_CALENDAR } from '../types/calendars.action.types'
import {
  HearingCalendarResponse,
  HearingCalendarSchema,
  TaskCalendarResponse,
  TaskCalendarSchema,
} from '../types/calendars.data.types'
import { isHearingCalendar, validateCalendar } from '../utils/calendars.utils'

export const addCalendar = (calendar: HearingCalendarSchema | TaskCalendarSchema, calendarType: string) => {
  const isHearingCalendarRequest = isHearingCalendar(calendarType)
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateCalendar(calendarType, calendar)
    if (validationErrors) {
      dispatch(calendarsFailure(`${calendarType}_CREATE_FAILURE`, validationErrors))
      return
    }

    dispatch(calendarsRequest(`${calendarType}_CREATE_REQUEST`))

    try {
      let calendarResponse: HearingCalendarResponse | TaskCalendarResponse
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: getRequestBody(calendar, isHearingCalendarRequest),
      }
      if (isHearingCalendarRequest) {
        const urlPath = getEndpoint(process.env.HEARING_CALENDAR_CREATE_ENDPOINT as string)
        calendarResponse = (await Async.fetch(urlPath, options)) as HearingCalendarResponse
      } else {
        const urlPath = getEndpoint(process.env.TASK_CALENDAR_CREATE_ENDPOINT as string)
        calendarResponse = (await Async.fetch(urlPath, options)) as TaskCalendarResponse
      }

      if (calendarResponse.detail) {
        dispatch(calendarsFailure(`${calendarType}_CREATE_FAILURE`, getErrMsg(calendarResponse.detail)))
      } else {
        dispatch(calendarsSuccess(`${calendarType}_CREATE_SUCCESS`, CREATE_SUCCESS(calendarType), calendarType, []))
      }
    } catch (error) {
      console.log(`Add ${calendarType} Error: `, error)
      dispatch(calendarsFailure(`${calendarType}_CREATE_FAILURE`, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(calendarsComplete(`${calendarType}S_COMPLETE`))
    }
  }
}

export const getCalendars = (calendarType: string, isForceFetch: boolean = false) => {
  const isHearingCalendarRequest = isHearingCalendar(calendarType)
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(calendarsRequest(`${calendarType}S_RETRIEVE_REQUEST`))

    try {
      let calendarResponse: HearingCalendarResponse | TaskCalendarResponse
      const options: Partial<FetchOptions> = {
        method: 'GET',
      }
      const calendarsInStore: HearingCalendarSchema[] | TaskCalendarSchema[] = isHearingCalendarRequest
        ? getStore().calendars.hearingCalendars
        : getStore().calendars.taskCalendars

      if (isForceFetch || calendarsInStore.length === 0) {
        if (isHearingCalendarRequest) {
          const urlPath = getEndpoint(process.env.HEARING_CALENDARS_RETRIEVE_ENDPOINT as string)
          calendarResponse = (await Async.fetch(urlPath, options)) as HearingCalendarResponse
        } else {
          const urlPath = getEndpoint(process.env.TASK_CALENDARS_RETRIEVE_ENDPOINT as string)
          calendarResponse = (await Async.fetch(urlPath, options)) as TaskCalendarResponse
        }

        if (calendarResponse.detail) {
          dispatch(calendarsFailure(`${calendarType}S_RETRIEVE_FAILURE`, getErrMsg(calendarResponse.detail)))
        } else {
          const calendars =
            'hearingCalendars' in calendarResponse ? calendarResponse.hearingCalendars : calendarResponse.taskCalendars
          dispatch(calendarsSuccess(`${calendarType}S_RETRIEVE_SUCCESS`, '', calendarType, calendars))
        }
      } else {
        dispatch(calendarsSuccess(`${calendarType}S_RETRIEVE_SUCCESS`, '', calendarType, calendarsInStore))
      }
    } catch (error) {
      console.log(`Get ${calendarType}S Error: `, error)
      dispatch(calendarsFailure(`${calendarType}S_RETRIEVE_FAILURE`, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(calendarsComplete(`${calendarType}S_COMPLETE`))
    }
  }
}

export const getOneCalendar = async (calendarId: number, calendarType: string) => {
  const isHearingCalendarRequest = isHearingCalendar(calendarType)
  try {
    let urlPath: string
    const options: Partial<FetchOptions> = {
      method: 'GET',
      extraParams: {
        isIncludeExtra: true,
        isIncludeHistory: true,
      },
    }

    if (isHearingCalendarRequest) {
      urlPath = getEndpoint(process.env.HEARING_CALENDAR_RETRIEVE_ENDPOINT as string)
      options['pathParams'] = { hearing_calendar_id: calendarId }
    } else {
      urlPath = getEndpoint(process.env.TASK_CALENDAR_RETRIEVE_ENDPOINT as string)
      options['pathParams'] = { task_calendar_id: calendarId }
    }

    return Async.fetch(urlPath, options)
  } catch (error) {
    console.log(`Get One ${calendarType} Error: `, error)
    const errorResponse: HearingCalendarResponse | TaskCalendarResponse = {
      hearingCalendars: [],
      taskCalendars: [],
      detail: { error: error as string },
    }
    return Promise.resolve(errorResponse)
  }
}

export const getCalendar = (calendarId: number, calendarType: string) => {
  const isHearingCalendarRequest = isHearingCalendar(calendarType)
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(calendarsRequest(`${calendarType}_RETRIEVE_REQUEST`))

    // call api, if it fails fallback to store
    try {
      let calendarResponse: HearingCalendarResponse | TaskCalendarResponse
      if (isHearingCalendarRequest) {
        calendarResponse = (await getOneCalendar(calendarId, calendarType)) as HearingCalendarResponse
      } else {
        calendarResponse = (await getOneCalendar(calendarId, calendarType)) as TaskCalendarResponse
      }

      if (calendarResponse.detail) {
        dispatch(calendarsFailure(`${calendarType}_RETRIEVE_FAILURE`, getErrMsg(calendarResponse.detail)))
        setSelectedCalendarFromStore(getStore(), dispatch, calendarId, calendarType)
      } else {
        const calendar: HearingCalendarSchema | TaskCalendarSchema =
          'hearingCalendars' in calendarResponse
            ? calendarResponse.hearingCalendars[0]
            : calendarResponse.taskCalendars[0]
        dispatch(calendarSelect(calendar, calendarType))
      }
    } finally {
      dispatch(calendarsComplete(`${calendarType}S_COMPLETE`))
    }
  }
}

export const editCalendar = (
  id: number,
  calendarType: string,
  calendar: HearingCalendarSchema | TaskCalendarSchema,
) => {
  const isHearingCalendarRequest = isHearingCalendar(calendarType)
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateCalendar(calendarType, calendar)
    if (validationErrors) {
      dispatch(calendarsFailure(`${calendarType}_UPDATE_FAILURE`, validationErrors))
      return
    }

    dispatch(calendarsRequest(`${calendarType}_UPDATE_REQUEST`))

    try {
      let calendarResponse: HearingCalendarResponse | TaskCalendarResponse
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        requestBody: getRequestBody(calendar, isHearingCalendarRequest),
      }
      if (isHearingCalendarRequest) {
        const urlPath = getEndpoint(process.env.HEARING_CALENDAR_UPDATE_ENDPOINT as string)
        options['pathParams'] = { hearing_calendar_id: id }
        calendarResponse = (await Async.fetch(urlPath, options)) as HearingCalendarResponse
      } else {
        const urlPath = getEndpoint(process.env.TASK_CALENDAR_UPDATE_ENDPOINT as string)
        options['pathParams'] = { task_calendar_id: id }
        calendarResponse = (await Async.fetch(urlPath, options)) as TaskCalendarResponse
      }

      if (calendarResponse.detail) {
        dispatch(calendarsFailure(`${calendarType}_UPDATE_FAILURE`, getErrMsg(calendarResponse.detail)))
      } else {
        dispatch(calendarsSuccess(`${calendarType}_UPDATE_SUCCESS`, UPDATE_SUCCESS(calendarType), calendarType, []))
      }
    } catch (error) {
      console.log(`Edit ${calendarType} Error: `, error)
      dispatch(calendarsFailure(`${calendarType}_UPDATE_FAILURE`, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(calendarsComplete(`${calendarType}S_COMPLETE`))
    }
  }
}

export const deleteCalendar = (id: number, calendarType: string) => {
  const isHearingCalendarRequest = isHearingCalendar(calendarType)
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(calendarsRequest(`${calendarType}_DELETE_REQUEST`))

    try {
      let calendarResponse: HearingCalendarResponse | TaskCalendarResponse
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
      }

      if (isHearingCalendarRequest) {
        const urlPath = getEndpoint(process.env.HEARING_CALENDAR_DELETE_ENDPOINT as string)
        options['pathParams'] = { hearing_calendar_id: id }
        calendarResponse = (await Async.fetch(urlPath, options)) as HearingCalendarResponse
      } else {
        const urlPath = getEndpoint(process.env.TASK_CALENDAR_DELETE_ENDPOINT as string)
        options['pathParams'] = { task_calendar_id: id }
        calendarResponse = (await Async.fetch(urlPath, options)) as TaskCalendarResponse
      }

      if (calendarResponse.detail) {
        dispatch(calendarsFailure(`${calendarType}_DELETE_FAILURE`, getErrMsg(calendarResponse.detail)))
      } else {
        dispatch(calendarsSuccess(`${calendarType}_DELETE_SUCCESS`, DELETE_SUCCESS(calendarType), calendarType, []))
      }
    } catch (error) {
      console.log(`Delete ${calendarType} Error: `, error)
      dispatch(calendarsFailure(`${calendarType}_DELETE_FAILURE`, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(calendarsComplete(`${calendarType}S_COMPLETE`))
    }
  }
}

const calendarsRequest = (type: string) => ({
  type: type,
})

const calendarsSuccess = (
  type: string,
  success: string,
  calendarType: string,
  calendars: HearingCalendarSchema[] | TaskCalendarSchema[],
) => {
  const isHearingCalendarRequest = isHearingCalendar(calendarType)
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else if (isHearingCalendarRequest) {
    return {
      type: type,
      hearingCalendars: calendars,
    }
  } else if (calendarType === CALENDAR_OBJECT_TYPES.TASK) {
    return {
      type: type,
      taskCalendars: calendars,
    }
  } else {
    return calendarsFailure(type, 'Something went wrong! Went from Success to failure!!')
  }
}

const calendarsFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const calendarsComplete = (type: string) => ({
  type: type,
})

const calendarSelect = (selectedCalendar: HearingCalendarSchema | TaskCalendarSchema, calendarType: string) => ({
  type: isHearingCalendar(calendarType) ? SET_SELECTED_HEARING_CALENDAR : SET_SELECTED_TASK_CALENDAR,
  selectedCalendar,
})

const setSelectedCalendarFromStore = (
  store: GlobalState,
  dispatch: React.Dispatch<GlobalDispatch>,
  calendarId: number,
  calendarType: string,
) => {
  const calendarsInStore: HearingCalendarSchema[] | TaskCalendarSchema[] = isHearingCalendar(calendarType)
    ? store.calendars.hearingCalendars
    : store.calendars.taskCalendars
  const calendarInStore: HearingCalendarSchema | TaskCalendarSchema | undefined = calendarsInStore.find(
    (calendar) => calendar.id === calendarId,
  )
  if (calendarInStore) {
    dispatch(calendarSelect(calendarInStore, calendarType))
  }
}

const getRequestBody = (calendar: HearingCalendarSchema | TaskCalendarSchema, isHearingCalendarRequest: boolean) => {
  return {
    // common
    status: calendar.status,
    comments: calendar.comments,
    // hearing calendar
    court_case_id: isHearingCalendarRequest && 'courtCaseId' in calendar ? calendar.courtCaseId : undefined,
    hearing_date: isHearingCalendarRequest && 'hearingDate' in calendar ? calendar.hearingDate : undefined,
    hearing_type_id: isHearingCalendarRequest && 'hearingTypeId' in calendar ? calendar.hearingTypeId : undefined,
    // task calendar
    task_date: !isHearingCalendarRequest && 'taskDate' in calendar ? calendar.taskDate : undefined,
    task_type_id: !isHearingCalendarRequest && 'taskTypeId' in calendar ? calendar.taskTypeId : undefined,
    hearing_calendar_id:
      !isHearingCalendarRequest &&
      'hearingCalendarId' in calendar &&
      calendar.hearingCalendarId &&
      calendar.hearingCalendarId > 0
        ? calendar.hearingCalendarId
        : undefined,
    form_id:
      !isHearingCalendarRequest && 'formId' in calendar && calendar.formId && calendar.formId > 0
        ? calendar.formId
        : undefined,
  }
}
