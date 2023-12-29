import { BaseModelSchema, NoteBaseSchema, ResponseBase } from '../../app'
import { CourtCaseSchema } from '../../court_cases'
import { HearingTypeSchema } from '../../ref_types'
import { TaskCalendarSchema } from '../../task_calendars'

export interface HearingCalendarSchema extends BaseModelSchema {
  hearing_date: Date
  hearing_type_id: number
  court_case_id: number
  // orm_mode
  hearing_type?: HearingTypeSchema
  court_case?: CourtCaseSchema
  task_calendars?: TaskCalendarSchema[]
  // notes and history
  note_hearing_calendars?: NoteHearingCalendarSchema[]
  history_hearing_calendars?: HistoryHearingCalendarSchema[]
}

export interface HearingCalendarResponse extends ResponseBase {
  hearing_calendars: HearingCalendarSchema[]
}

export interface NoteHearingCalendarSchema extends NoteBaseSchema, BaseModelSchema {
  hearing_calendar_id: number
  // orm_mode
  hearing_calendar?: HearingCalendarSchema
}

export interface HistoryHearingCalendarSchema extends BaseModelSchema {
  user_name: string
  hearing_calendar_id: number
  // from hearing calendar schema, need everything optional here so can't extend
  hearing_date?: Date
  hearing_type_id?: number
  court_case_id?: number
  // orm_mode
  hearing_calendar?: HearingCalendarSchema
  hearing_type?: HearingTypeSchema
  court_case?: CourtCaseSchema
}
