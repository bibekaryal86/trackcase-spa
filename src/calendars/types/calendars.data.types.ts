import { BaseModelSchema, NoteBaseSchema, ResponseBase } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { FormSchema } from '../../forms'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'

export interface HearingCalendarSchema extends BaseModelSchema {
  hearingDate: Date
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
  hearingDate?: Date
  hearingTypeId?: number
  courtCaseId?: number
  // orm_mode
  hearingCalendar?: HearingCalendarSchema
  hearingType?: HearingTypeSchema
  courtCase?: CourtCaseSchema
}

export interface TaskCalendarSchema extends BaseModelSchema {
  taskDate: Date
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
  taskDate?: Date
  taskTypeId?: number
  courtCaseId?: number
  hearingCalendarId?: number
  // orm_mode
  taskCalendar?: TaskCalendarSchema
  taskType?: TaskTypeSchema
  courtCase?: CourtCaseSchema
  hearingCalendar?: HearingCalendarSchema
}
