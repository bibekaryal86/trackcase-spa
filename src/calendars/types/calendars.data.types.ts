import dayjs, { Dayjs } from 'dayjs'

import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ID_DEFAULT } from '../../constants'
import { FormSchema } from '../../forms'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'

export interface HearingCalendarSchema extends StatusBaseSchema, BaseModelSchema {
  hearingDate: Dayjs
  hearingTypeId: number
  courtCaseId: number
  // orm_mode
  hearingType?: HearingTypeSchema
  courtDate?: CourtCaseSchema
  taskCalendars?: TaskCalendarSchema[]
  // notes and history
  noteHearingCalendars?: NoteHearingCalendarSchema[]
  historyHearingCalendars?: HistoryHearingCalendarSchema[]
}

export interface HearingCalendarResponse extends ResponseBase {
  hearingCalendars: HearingCalendarSchema[]
}

export interface NoteHearingCalendarSchema extends NoteBaseSchema, BaseModelSchema {
  hearingCalendarId: number
  // orm_mode
  hearingCalendar?: HearingCalendarSchema
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
  taskDate: Dayjs
  taskTypeId: number
  courtCaseId: number
  hearingCalendarId?: number
  // orm_mode
  taskType?: TaskTypeSchema
  courtCase?: CourtCaseSchema
  hearingCalendar?: HearingCalendarSchema
  forms?: FormSchema[]
}

export interface TaskCalendarResponse extends ResponseBase {
  taskCalendars: TaskCalendarSchema[]
}

export interface NoteTaskCalendarSchema extends NoteBaseSchema, BaseModelSchema {
  taskCalendarId: number
  // orm_mode
  taskCalendar?: TaskCalendarSchema
}

export interface HistoryTaskCalendarSchema extends BaseModelSchema {
  userName: string
  taskCalendarId: number
  // from hearing calendar schema, need everything optional here so can't extend
  taskDate?: Dayjs
  taskTypeId?: number
  courtCaseId?: number
  hearingCalendarId?: number
  status?: string
  comments?: string
  // orm_mode
  taskCalendar?: TaskCalendarSchema
  taskType?: TaskTypeSchema
  courtCase?: CourtCaseSchema
  hearingCalendar?: HearingCalendarSchema
}

export interface CalendarsState {
  isForceFetch: boolean
  isCloseModal: boolean
  hearingCalendars: HearingCalendarSchema[]
  taskCalendars: TaskCalendarSchema[]
  selectedHearingCalendar: HearingCalendarSchema
  selectedTaskCalendar: TaskCalendarSchema
}

export interface CalendarsAction extends CalendarsState {
  type: string
}

export const DefaultHearingCalendarSchema: HearingCalendarSchema = {
  courtCaseId: ID_DEFAULT,
  hearingTypeId: ID_DEFAULT,
  hearingDate: dayjs(),
  status: '',
  comments: '',
}

export const DefaultTaskCalendarSchema: TaskCalendarSchema = {
  taskDate: dayjs(),
  taskTypeId: ID_DEFAULT,
  courtCaseId: ID_DEFAULT,
  hearingCalendarId: ID_DEFAULT,
  status: '',
  comments: '',
}

export const DefaultCalendarsState: CalendarsState = {
  isForceFetch: true,
  isCloseModal: true,
  hearingCalendars: [],
  taskCalendars: [],
  selectedHearingCalendar: DefaultHearingCalendarSchema,
  selectedTaskCalendar: DefaultTaskCalendarSchema,
}

export const DefaultCalendar = {
  ...DefaultHearingCalendarSchema,
  ...DefaultTaskCalendarSchema,
}
