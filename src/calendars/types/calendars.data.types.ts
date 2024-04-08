import { Dayjs } from 'dayjs'

import { BaseModelSchema, FetchRequestMetadata, ResponseBase } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ID_DEFAULT } from '../../constants'
import { FilingSchema } from '../../filings'
import { ComponentStatusSchema, HearingTypeSchema, TaskTypeSchema } from '../../types'

export interface CalendarEvents {
  id: number
  calendar: 'HEARING_CALENDAR' | 'TASK_CALENDAR'
  type: string
  date: Dayjs
  title: string
  status: 'PAST_DONE' | 'PAST_DUE' | 'DONE' | 'DUE'
  courtCaseId: number
}

export interface CalendarResponseData {
  calendarEvents: CalendarEvents[]
  hearingCalendars: HearingCalendarSchema[]
  taskCalendars: TaskCalendarSchema[]
}

export interface CalendarResponse extends ResponseBase {
  data: CalendarResponseData
}

export interface HearingCalendarBase {
  hearingDate: Dayjs | undefined // set undefined for default object
  hearingTypeId: number
  courtCaseId: number
  componentStatusId: number
  comments?: string
}

export interface HearingCalendarSchema extends HearingCalendarBase, BaseModelSchema {
  // orm_mode
  hearingType?: HearingTypeSchema
  courtCase?: CourtCaseSchema
  componentStatus?: ComponentStatusSchema
  taskCalendars?: TaskCalendarSchema[]
  // history
  historyHearingCalendars?: HistoryHearingCalendarSchema[]
}

export interface HearingCalendarResponse extends ResponseBase {
  data: HearingCalendarSchema[]
}

export interface HistoryHearingCalendarSchema extends Partial<HearingCalendarBase>, BaseModelSchema {
  appUserId: number
  hearingCalendarId: number
  // orm_mode
  hearingCalendar?: HearingCalendarSchema
  hearingType?: HearingTypeSchema
  courtCase?: CourtCaseSchema
  componentStatus?: ComponentStatusSchema
}

export interface TaskCalendarBase {
  taskDate: Dayjs | undefined // set undefined for default object
  dueDate: Dayjs | undefined // set undefined for default object
  taskTypeId: number
  hearingCalendarId?: number
  filingId?: number
  componentStatusId: number
  comments?: string
}

export interface TaskCalendarSchema extends TaskCalendarBase, BaseModelSchema {
  // orm_mode
  taskType?: TaskTypeSchema
  hearingCalendar?: HearingCalendarSchema
  filing?: FilingSchema
  componentStatus?: ComponentStatusSchema
}

export interface TaskCalendarResponse extends ResponseBase {
  data: TaskCalendarSchema[]
}

export interface HistoryTaskCalendarSchema extends Partial<TaskCalendarBase>, BaseModelSchema {
  appUserId: string
  taskCalendarId: number
  taskCalendar?: TaskCalendarSchema
  taskType?: TaskTypeSchema
  hearingCalendar?: HearingCalendarSchema
  filing?: FilingSchema
  componentStatus?: ComponentStatusSchema
}

export interface CalendarsState {
  calendarEvents: CalendarEvents[]
  hearingCalendars: HearingCalendarSchema[]
  taskCalendars: TaskCalendarSchema[]
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface CalendarsAction extends CalendarsState {
  type: string
}

export interface HearingCalendarFormData extends HearingCalendarSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface TaskCalendarFormData extends TaskCalendarSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface HearingCalendarFormErrorData extends HearingCalendarSchema {
  hearingDateError: string
  hearingTypeError: string
  courtCaseError: string
  componentStatusError: string
}

export interface TaskCalendarFormErrorData extends TaskCalendarSchema {
  taskDateError: string
  dueDateError: string
  taskTypeError: string
  hearingCalendarError: string
  filingError: string
  componentStatusError: string
}

export const DefaultHearingCalendarSchema: HearingCalendarSchema = {
  hearingDate: undefined,
  hearingTypeId: ID_DEFAULT,
  courtCaseId: ID_DEFAULT,
  componentStatusId: ID_DEFAULT,
  comments: '',
}

export const DefaultTaskCalendarSchema: TaskCalendarSchema = {
  taskDate: undefined,
  dueDate: undefined,
  taskTypeId: ID_DEFAULT,
  hearingCalendarId: ID_DEFAULT,
  filingId: ID_DEFAULT,
  componentStatusId: ID_DEFAULT,
  comments: '',
}

export const DefaultCalendarsState: CalendarsState = {
  calendarEvents: [],
  hearingCalendars: [],
  taskCalendars: [],
  requestMetadata: {},
}

export const DefaultCalendarSchema = {
  ...DefaultHearingCalendarSchema,
  ...DefaultTaskCalendarSchema,
}

export const DefaultHearingCalendarFormData: HearingCalendarFormData = {
  ...DefaultHearingCalendarSchema,
  isHardDelete: false,
  isShowSoftDeleted: false,
}

export const DefaultTaskCalendarFormData: TaskCalendarFormData = {
  ...DefaultTaskCalendarSchema,
  isHardDelete: false,
  isShowSoftDeleted: false,
}

export const DefaultHearingCalendarFormErrorData: HearingCalendarFormErrorData = {
  ...DefaultHearingCalendarFormData,
  hearingDateError: '',
  hearingTypeError: '',
  courtCaseError: '',
  componentStatusError: '',
}

export const DefaultTaskCalendarFormErrorData: TaskCalendarFormErrorData = {
  ...DefaultTaskCalendarFormData,
  taskDateError: '',
  dueDateError: '',
  taskTypeError: '',
  hearingCalendarError: '',
  filingError: '',
  componentStatusError: '',
}
