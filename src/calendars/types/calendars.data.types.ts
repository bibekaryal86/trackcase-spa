import { Dayjs } from 'dayjs'

import { BaseModelSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ID_DEFAULT } from '../../constants'
import { FormSchema } from '../../forms'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'

export interface HearingCalendarSchema extends StatusBaseSchema, BaseModelSchema {
  hearingDate: Dayjs | undefined // set undefined for default object
  hearingTypeId: number
  courtCaseId: number
  // orm_mode
  hearingType?: HearingTypeSchema
  courtCase?: CourtCaseSchema
  taskCalendars?: TaskCalendarSchema[]
  // history
  historyHearingCalendars?: HistoryHearingCalendarSchema[]
}

export interface HearingCalendarResponse extends ResponseBase {
  hearingCalendars: HearingCalendarSchema[]
}

export interface HistoryHearingCalendarSchema extends BaseModelSchema {
  userName: string
  hearingCalendarId: number
  // from hearing calendar schema, need everything optional here so can't extend
  hearingDate?: Dayjs
  hearingTypeId?: number
  courtCaseId?: number
  status?: string
  comments?: string
  // orm_mode
  hearingCalendar?: HearingCalendarSchema
  hearingType?: HearingTypeSchema
  courtCase?: CourtCaseSchema
}

export interface TaskCalendarSchema extends StatusBaseSchema, BaseModelSchema {
  taskDate: Dayjs | undefined // set undefined for default object
  dueDate: Dayjs | undefined // set undefined for default object
  taskTypeId: number
  hearingCalendarId?: number
  formId?: number
  // orm_mode
  taskType?: TaskTypeSchema
  hearingCalendar?: HearingCalendarSchema
  form?: FormSchema
}

export interface TaskCalendarResponse extends ResponseBase {
  taskCalendars: TaskCalendarSchema[]
}

export interface HistoryTaskCalendarSchema extends BaseModelSchema {
  userName: string
  taskCalendarId: number
  // from hearing calendar schema, need everything optional here so can't extend
  taskDate?: Dayjs
  dueDate?: Dayjs
  taskTypeId?: number
  hearingCalendarId?: number
  formId?: number
  status?: string
  comments?: string
  // orm_mode
  taskCalendar?: TaskCalendarSchema
  taskType?: TaskTypeSchema
  hearingCalendar?: HearingCalendarSchema
  form?: FormSchema
}

export interface CalendarsState {
  isCloseModal: boolean
  hearingCalendars: HearingCalendarSchema[]
  taskCalendars: TaskCalendarSchema[]
  selectedHearingCalendar: HearingCalendarSchema
  selectedTaskCalendar: TaskCalendarSchema
}

export interface CalendarsAction extends CalendarsState {
  type: string
}

export interface CalendarTypeId {
  type: string
  id: number
}

export const DefaultHearingCalendarSchema: HearingCalendarSchema = {
  courtCaseId: ID_DEFAULT,
  hearingTypeId: ID_DEFAULT,
  hearingDate: undefined,
  status: '',
  comments: '',
}

export const DefaultTaskCalendarSchema: TaskCalendarSchema = {
  taskDate: undefined,
  dueDate: undefined,
  taskTypeId: ID_DEFAULT,
  hearingCalendarId: ID_DEFAULT,
  formId: ID_DEFAULT,
  status: '',
  comments: '',
}

export const DefaultCalendarsState: CalendarsState = {
  isCloseModal: true,
  hearingCalendars: [],
  taskCalendars: [],
  selectedHearingCalendar: DefaultHearingCalendarSchema,
  selectedTaskCalendar: DefaultTaskCalendarSchema,
}

export const DefaultCalendarSchema = {
  ...DefaultHearingCalendarSchema,
  ...DefaultTaskCalendarSchema,
}
