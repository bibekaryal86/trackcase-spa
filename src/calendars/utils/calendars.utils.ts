import { Dayjs } from 'dayjs'

import { getNumber } from '../../app'
import { CALENDAR_OBJECT_TYPES } from '../../constants'
import { HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'

export const getCalendarType = (calendar: HearingCalendarSchema | TaskCalendarSchema): string | undefined => {
  if ('hearingDate' in calendar || 'hearingTypeId' in calendar) {
    return CALENDAR_OBJECT_TYPES.HEARING
  } else if ('taskDate' in calendar || 'taskTypeId' in calendar) {
    return CALENDAR_OBJECT_TYPES.TASK
  }
  return undefined
}

export const validateCalendarType = (calendarType: string): boolean => {
  return calendarType
    ? calendarType === CALENDAR_OBJECT_TYPES.HEARING || calendarType === CALENDAR_OBJECT_TYPES.TASK
    : false
}

export const validateCalendar = (calendarType: string, calendar: HearingCalendarSchema | TaskCalendarSchema) => {
  const errors: string[] = []

  if (!validateCalendarType(calendarType) || !getCalendarType(calendar)) {
    return 'Invalid Calendar Type!!!'
  }

  // common
  if (calendar.courtCaseId <= 0) {
    errors.push('Case is required')
  }
  if (!calendar.status.trim()) {
    errors.push('Status is required')
  }
  // hearing calendar
  if ('hearingDate' in calendar && (!calendar.hearingDate || !calendar.hearingDate.isValid())) {
    errors.push('Hearing Date is incomplete/invalid')
  }
  if ('hearingTypeId' in calendar && calendar.hearingTypeId <= 0) {
    errors.push('Hearing Type is required')
  }
  // task calendar
  if ('taskDate' in calendar && (!calendar.taskDate || !calendar.taskDate.isValid())) {
    errors.push('Task Date is incomplete/invalid')
  }
  if ('taskTypeId' in calendar && calendar.taskTypeId <= 0) {
    errors.push('Task Type is required')
  }

  return errors.length ? errors.join(', ') : ''
}

export const isAreTwoHearingCalendarsSame = (one: HearingCalendarSchema, two: HearingCalendarSchema) =>
  one &&
  two &&
  one.hearingDate === two.hearingDate &&
  one.hearingTypeId === two.hearingTypeId &&
  one.courtCaseId === two.courtCaseId &&
  one.status === two.status &&
  one.comments === two.comments

export const isAreTwoTaskCalendarsSame = (one: TaskCalendarSchema, two: TaskCalendarSchema) =>
  one &&
  two &&
  one.taskDate === two.taskDate &&
  one.taskTypeId === two.taskTypeId &&
  one.courtCaseId === two.courtCaseId &&
  one.hearingCalendarId === two.hearingCalendarId &&
  one.status === two.status &&
  one.comments === two.comments

export const isCalendarFormFieldError = (
  name: string,
  value: string | number | undefined,
  dateValue: Dayjs | null | undefined,
) => {
  switch (name) {
    case 'courtCaseId':
    case 'hearingTypeId':
    case 'taskTypeId':
      return !value || getNumber(value) <= 0
    case 'hearingCalendarId':
      return !value ? true : getNumber(value) <= 0
    case 'status':
      return !value || value.toString().trim() === ''
    case 'hearingDate':
    case 'taskValue':
      return !dateValue || !dateValue.isValid()
  }
  return false
}

export const handleCalendarDateOnChange = (
  name: string,
  value: Dayjs | null,
  selectedCalendar: HearingCalendarSchema | TaskCalendarSchema,
  setSelectedCalendar: (updatedCalendar: HearingCalendarSchema | TaskCalendarSchema) => void,
) => {
  const updatedCalendar = {
    ...selectedCalendar,
    [name]: value,
  }
  setSelectedCalendar(updatedCalendar)
}

export const handleCalendarFormOnChange = (
  name: string,
  value: string | number,
  selectedCalendar: HearingCalendarSchema | TaskCalendarSchema,
  setSelectedCalendar: (updatedCalendar: HearingCalendarSchema | TaskCalendarSchema) => void,
  getValue: (value: string | number) => string | number,
) => {
  const updatedCalendar = {
    ...selectedCalendar,
    [name]: getValue(value),
  }
  setSelectedCalendar(updatedCalendar)
}
