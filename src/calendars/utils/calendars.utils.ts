import * as colors from '@mui/material/colors'
import dayjs, { Dayjs } from 'dayjs'

import { getDayjs, getNumber } from '../../app'
import { CALENDAR_OBJECT_TYPES, DUE_AT_HEARING_ID } from '../../constants'
import { CalendarTypeId, HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'

export const getCalendarEventBgColor = (type?: string): string => (type ? CALENDAR_EVENT_BG_COLOR.get(type) || '' : '')

export const CALENDAR_EVENT_BG_COLOR = new Map([
  ['MASTER', colors.blue.A400],
  ['MERIT', colors.deepPurple.A400],
  ['DUE AT HEARING', colors.brown.A400],
  ['DOCUMENT PREPARATION', colors.deepOrange.A400],
])

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

export const validateCalendar = (
  calendarType: string,
  calendar: HearingCalendarSchema | TaskCalendarSchema,
  hearingCalendarParam?: HearingCalendarSchema,
) => {
  const errors: string[] = []

  if (!validateCalendarType(calendarType)) {
    return 'Invalid Calendar Type!!!'
  }
  // common
  if (!calendar.status.trim()) {
    errors.push('Status is required!')
  }
  // hearing calendar
  if (isHearingCalendar(calendarType)) {
    const hearingCalendar = calendar as HearingCalendarSchema
    const hearingDate = getDayjs(hearingCalendar.hearingDate)
    if (!hearingDate || !hearingDate.isValid() || hearingDate.isBefore(dayjs(), 'day')) {
      errors.push('Hearing Date is required and cannot be in the past!')
    }
    if (getNumber(hearingCalendar.hearingTypeId) <= 0) {
      errors.push('Hearing Type is required!')
    }
    if (getNumber(hearingCalendar.courtCaseId) <= 0) {
      errors.push('Case is required!')
    }
  } else {
    // task calendar
    const taskCalendar = calendar as TaskCalendarSchema
    const taskDate = getDayjs(taskCalendar.taskDate)
    const dueDate = getDayjs(taskCalendar.dueDate)
    if (!taskDate || !taskDate.isValid() || taskDate.isBefore(dayjs(), 'day')) {
      errors.push('Task Date is required and cannot be in the past!')
    }
    if (!dueDate || !dueDate.isValid() || dueDate.isBefore(dayjs(), 'day')) {
      errors.push('Due Date is required and cannot be in the past!')
    }
    // due date cannot be before task date
    if (taskDate && dueDate && dueDate.isBefore(taskDate)) {
      errors.push('Due Date cannot be before Task Calendar Date!')
    }
    // due date cannot be after hearing date if hearing calendar is selected
    if (dueDate && getNumber(taskCalendar.hearingCalendarId) > 0) {
      let hearingCalendar = taskCalendar.hearingCalendar
      if (!hearingCalendar) {
        hearingCalendar = hearingCalendarParam
      }
      const hearingDate = getDayjs(hearingCalendar?.hearingDate)
      if (hearingDate) {
        if (dueDate.isAfter(hearingDate)) {
          errors.push('Due Date cannot be after Hearing Calendar Date!')
        }
      } else {
        errors.push('Hearing Calendar Could Not Be Verified!')
      }
    }
    if (getNumber(taskCalendar.taskTypeId) <= 0) {
      errors.push('Task Type is required')
    } else if (taskCalendar.taskTypeId === DUE_AT_HEARING_ID && getNumber(taskCalendar.hearingCalendarId) <= 0) {
      errors.push('For Due at Hearing task type Hearing Calendar is required!')
    } else if (taskCalendar.taskTypeId !== DUE_AT_HEARING_ID && getNumber(taskCalendar.hearingCalendarId) > 0) {
      errors.push('For Hearing Calendar task type Due at Hearing is required!')
    } else if (taskCalendar.taskTypeId === DUE_AT_HEARING_ID && getNumber(taskCalendar.formId) > 0) {
      errors.push('For Due at Hearing task type Form is not allowed!')
    }
    if (getNumber(taskCalendar.formId) <= 0 && getNumber(taskCalendar.formId) <= 0)
    {
      errors.push('Either Hearing Calendar OR Form is required!')
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
  one.formId === two.formId &&
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
    case 'taskDate':
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
