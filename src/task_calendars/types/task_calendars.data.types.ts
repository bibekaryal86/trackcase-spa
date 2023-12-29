import { BaseModelSchema, NoteBaseSchema, ResponseBase } from '../../app'
import { CourtCaseSchema } from '../../court_cases'
import { FormSchema } from '../../forms'
import { HearingCalendarSchema } from '../../hearing_calendars'
import { TaskTypeSchema } from '../../ref_types'

export interface TaskCalendarSchema extends BaseModelSchema {
  task_date: Date
  task_type_id: number
  court_case_id: number
  hearing_calendar_id?: number
  // orm_mode
  task_type?: TaskTypeSchema
  court_case?: CourtCaseSchema
  hearing_calendar?: HearingCalendarSchema
  forms?: FormSchema[]
}

export interface TaskCalendarResponse extends ResponseBase {
  task_calendars: TaskCalendarSchema[]
}

export interface NoteTaskCalendarSchema extends NoteBaseSchema, BaseModelSchema {
  task_calendar_id: number
  // orm_mode
  task_calendar?: TaskCalendarSchema
}

export interface HistoryTaskCalendarSchema extends BaseModelSchema {
  user_name: string
  task_calendar_id: number
  // from hearing calendar schema, need everything optional here so can't extend
  task_date?: Date
  task_type_id?: number
  court_case_id?: number
  hearing_calendar_id?: number
  // orm_mode
  task_calendar?: TaskCalendarSchema
  task_type?: TaskTypeSchema
  court_case?: CourtCaseSchema
  hearing_calendar?: HearingCalendarSchema
}
