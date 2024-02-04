import { Dayjs } from 'dayjs'

import { getNumber } from '../../app'
import { CALENDAR_OBJECT_TYPES } from '../../constants'
import { CalendarTypeId, HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'

export const getCalendarType = (calendar: HearingCalendarSchema | TaskCalendarSchema): string | undefined => {
  if ('hearingDate' in calendar || 'hearingTypeId' in calendar) {
    return CALENDAR_OBJECT_TYPES.HEARING
  } else if ('taskDate' in calendar || 'taskTypeId' in calendar) {
    return CALENDAR_OBJECT_TYPES.TASK
  }
  return undefined
}

export const isHearingCalendar = (calendarType?: string, calendarTypeId?: CalendarTypeId) =>
  calendarType
    ? calendarType === CALENDAR_OBJECT_TYPES.HEARING
    : calendarTypeId
    ? calendarTypeId.type === CALENDAR_OBJECT_TYPES.HEARING
    : false

export const validateCalendarType = (calendarType: string): boolean =>
  calendarType === CALENDAR_OBJECT_TYPES.HEARING || calendarType === CALENDAR_OBJECT_TYPES.TASK

export const validateCalendar = (calendarType: string, calendar: HearingCalendarSchema | TaskCalendarSchema) => {
  const errors: string[] = []

  if (!validateCalendarType(calendarType)) {
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
  if (isHearingCalendar(calendarType)) {
    const hearingCalendar = calendar as HearingCalendarSchema
    if (!hearingCalendar.hearingDate || !hearingCalendar.hearingDate.isValid()) {
      errors.push('Hearing Date is incomplete/invalid')
    }
    if (hearingCalendar.hearingTypeId <= 0) {
      errors.push('Hearing Type is required')
    }
  } else {
    const taskCalendar = calendar as TaskCalendarSchema
    if (!taskCalendar.taskDate || !taskCalendar.taskDate.isValid()) {
      errors.push('Task Date is incomplete/invalid')
    }
    if (taskCalendar.taskTypeId <= 0) {
      errors.push('Task Type is required')
    }
  }

  return errors.length ? errors.join(', ') : ''
}

const isAreTwoHearingCalendarsSame = (one: HearingCalendarSchema, two: HearingCalendarSchema) =>
  one &&
  two &&
  one.hearingDate === two.hearingDate &&
  one.hearingTypeId === two.hearingTypeId &&
  one.courtCaseId === two.courtCaseId &&
  one.status === two.status &&
  one.comments === two.comments

const isAreTwoTaskCalendarsSame = (one: TaskCalendarSchema, two: TaskCalendarSchema) =>
  one &&
  two &&
  one.taskDate === two.taskDate &&
  one.taskTypeId === two.taskTypeId &&
  one.courtCaseId === two.courtCaseId &&
  one.hearingCalendarId === two.hearingCalendarId &&
  one.status === two.status &&
  one.comments === two.comments

export const isAreTwoCalendarsSame = (
  one: HearingCalendarSchema | TaskCalendarSchema,
  two: HearingCalendarSchema | TaskCalendarSchema,
  calendarType: string,
) =>
  calendarType === CALENDAR_OBJECT_TYPES.HEARING
    ? isAreTwoHearingCalendarsSame(one as HearingCalendarSchema, two as HearingCalendarSchema)
    : isAreTwoTaskCalendarsSame(one as TaskCalendarSchema, two as TaskCalendarSchema)

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
