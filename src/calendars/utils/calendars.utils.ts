import * as colors from '@mui/material/colors'
import dayjs from 'dayjs'

import { FetchRequestMetadata, getDayjs, getNumber } from '../../app'
import { CALENDAR_TYPES, DUE_AT_HEARING_ID, ID_DEFAULT } from '../../constants'
import {
  CalendarEvents,
  DefaultHearingCalendarFormErrorData,
  DefaultTaskCalendarFormErrorData,
  HearingCalendarFormData,
  HearingCalendarFormErrorData,
  HearingCalendarSchema,
  TaskCalendarFormData,
  TaskCalendarFormErrorData,
  TaskCalendarSchema,
} from '../types/calendars.data.types'

export const getCalendarEventBgColor = (type?: string): string => (type ? CALENDAR_EVENT_BG_COLOR.get(type) || '' : '')

export const CALENDAR_EVENT_BG_COLOR = new Map([
  ['MASTER', colors.blue.A400],
  ['MERIT', colors.deepPurple.A400],
  ['DUE AT HEARING', colors.brown.A400],
  ['DOCUMENT PREPARATION', colors.deepOrange.A400],
])

export const getCalendarType = (
  calendar: HearingCalendarSchema | TaskCalendarSchema | HearingCalendarFormData | TaskCalendarFormData,
): string | undefined => {
  if ('hearingDate' in calendar || 'hearingTypeId' in calendar) {
    return CALENDAR_TYPES.HEARING_CALENDAR
  } else if ('taskDate' in calendar || 'taskTypeId' in calendar) {
    return CALENDAR_TYPES.TASK_CALENDAR
  }
  return undefined
}

export const isHearingCalendar = (
  calendar: HearingCalendarSchema | TaskCalendarSchema | HearingCalendarFormData | TaskCalendarFormData,
): boolean => getCalendarType(calendar) === CALENDAR_TYPES.HEARING_CALENDAR

export const isAreTwoCalendarsSame = (
  one: HearingCalendarSchema | TaskCalendarSchema | HearingCalendarFormData | TaskCalendarFormData,
  two: HearingCalendarSchema | TaskCalendarSchema | HearingCalendarFormData | TaskCalendarFormData,
) =>
  isHearingCalendar(one)
    ? isAreTwoHearingCalendarsSame(one as HearingCalendarFormData, two as HearingCalendarFormData)
    : isAreTwoTaskCalendarsSame(one as TaskCalendarFormData, two as TaskCalendarFormData)

export const isAreTwoHearingCalendarsSame = (
  one: HearingCalendarFormData | HearingCalendarSchema,
  two: HearingCalendarFormData | HearingCalendarSchema,
) =>
  one &&
  two &&
  one.hearingDate === two.hearingDate &&
  one.hearingTypeId === two.hearingTypeId &&
  one.courtCaseId === two.courtCaseId &&
  one.componentStatusId === two.componentStatusId &&
  one.comments === two.comments

export const isAreTwoTaskCalendarsSame = (
  one: TaskCalendarFormData | TaskCalendarSchema,
  two: TaskCalendarFormData | TaskCalendarSchema,
) =>
  one &&
  two &&
  one.taskDate === two.taskDate &&
  one.taskTypeId === two.taskTypeId &&
  one.filingId === two.filingId &&
  one.hearingCalendarId === two.hearingCalendarId &&
  one.componentStatusId === two.componentStatusId &&
  one.comments === two.comments

export const validateHearingCalendar = (
  formData: HearingCalendarFormData,
  setFormErrors: (formErrors: HearingCalendarFormErrorData) => void,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: HearingCalendarFormErrorData = { ...DefaultHearingCalendarFormErrorData }
  const oneWeekBeforeDate = dayjs().subtract(1, 'week')

  if (!formData.hearingDate || !formData.hearingDate.isValid() || formData.hearingDate.isBefore(oneWeekBeforeDate)) {
    hasValidationErrors = true
    formErrorsLocal.hearingDateError = 'INVALID/MISSING'
  }
  if (getNumber(formData.hearingTypeId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.hearingTypeError = 'REQUIRED'
  }
  if (getNumber(formData.courtCaseId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.courtCaseError = 'REQUIRED'
  }
  if (getNumber(formData.componentStatusId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.componentStatusError = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const validateTaskCalendar = (
  formData: TaskCalendarFormData,
  setFormErrors: (formErrors: TaskCalendarFormErrorData) => void,
  hearingCalendar?: HearingCalendarSchema,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: TaskCalendarFormErrorData = { ...DefaultTaskCalendarFormErrorData }
  const oneWeekBeforeDate = dayjs().subtract(1, 'week')

  if (!formData.taskDate || !formData.taskDate.isValid() || formData.taskDate.isBefore(oneWeekBeforeDate)) {
    hasValidationErrors = true
    formErrorsLocal.taskDateError = 'REQUIRED/INVALID (BEFORE 1 WEEK)'
  }
  if (!formData.dueDate || !formData.dueDate.isValid() || formData.dueDate.isBefore(oneWeekBeforeDate)) {
    hasValidationErrors = true
    formErrorsLocal.dueDateError = 'REQUIRED/INVALID (BEFORE 1 WEEK)'
  }
  if (formData.taskDate && formData.dueDate && formData.dueDate.isBefore(formData.taskDate)) {
    hasValidationErrors = true
    formErrorsLocal.dueDateError = 'REQUIRED/INVALID (BEFORE TASK DATE)'
  }
  // due date cannot be after hearing date if hearing calendar is selected
  if (formData.dueDate && getNumber(formData.hearingCalendarId) > 0) {
    const hearingDate = getDayjs(hearingCalendar?.hearingDate)
    if (hearingDate) {
      if (formData.dueDate.isAfter(hearingDate)) {
        hasValidationErrors = true
        formErrorsLocal.dueDateError = 'REQUIRED/INVALID (BEFORE HEARING DATE)'
      }
    } else {
      hasValidationErrors = true
      formErrorsLocal.dueDateError = 'REQUIRED/INVALID (NO HEARING CALENDAR)'
    }
  }
  if (getNumber(formData.taskTypeId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.taskTypeError = 'REQUIRED'
  } else if (formData.taskTypeId === DUE_AT_HEARING_ID && getNumber(formData.hearingCalendarId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.hearingCalendarError = 'REQUIRED'
  } else if (formData.taskTypeId !== DUE_AT_HEARING_ID && getNumber(formData.hearingCalendarId) > 0) {
    hasValidationErrors = true
    formErrorsLocal.taskTypeError = 'REQUIRED'
  } else if (formData.taskTypeId === DUE_AT_HEARING_ID && getNumber(formData.filingId) > 0) {
    hasValidationErrors = true
    formErrorsLocal.filingError = 'NOT ALLOWED FOR DUE AT HEARING'
  }
  if (getNumber(formData.filingId) <= 0 && getNumber(formData.hearingCalendarId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.filingError = 'ONE IS REQUIRED'
    formErrorsLocal.hearingCalendarError = 'ONE IS REQUIRED'
  }
  if (getNumber(formData.componentStatusId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.componentStatusError = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const calendarDispatch = ({
  type = '',
  error = '',
  success = '',
  calendarEvents = [] as CalendarEvents[],
  hearingCalendars = [] as HearingCalendarSchema[],
  taskCalendars = [] as TaskCalendarSchema[],
  requestMetadata = {} as Partial<FetchRequestMetadata>,
} = {}) => {
  if (error) {
    return {
      type,
      error,
    }
  } else if (success) {
    return {
      type,
      success,
    }
  } else if (calendarEvents) {
    return {
      type,
      calendarEvents,
      hearingCalendars,
      taskCalendars,
      requestMetadata,
    }
  } else {
    return {
      type,
    }
  }
}

export const getCalendarFormDataFromSchema = (x: HearingCalendarSchema | TaskCalendarSchema) =>
  isHearingCalendar(x)
    ? getHearingCalendarFormDataFromSchema(x as HearingCalendarSchema)
    : getTaskCalendarFormDataFromSchema(x as TaskCalendarSchema)

export const getHearingCalendarFormDataFromSchema = (x: HearingCalendarSchema): HearingCalendarFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}

export const getTaskCalendarFormDataFromSchema = (x: TaskCalendarSchema): TaskCalendarFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}
