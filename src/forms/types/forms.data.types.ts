import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CaseCollectionSchema, CashCollectionSchema } from '../../cash_collections'
import { CourtCaseSchema } from '../../court_cases'
import { FormTypeSchema } from '../../ref_types'
import { TaskCalendarSchema } from '../../task_calendars'

export interface FormSchema extends StatusBaseSchema, BaseModelSchema {
  form_type_id: number
  court_case_id: number
  submit_date?: Date
  receipt_date?: Date
  rfe_date?: Date
  rfe_submit_date?: Date
  decision_date?: Date
  task_calendar_id?: number
  // orm_mode
  form_type?: FormTypeSchema
  task_calendar?: TaskCalendarSchema
  court_case?: CourtCaseSchema
  case_collections?: CaseCollectionSchema[]
  cash_collections?: CashCollectionSchema[]
  // notes and history
  note_forms?: NoteFormSchema[]
  history_forms?: HistoryFormSchema[]
}

export interface FormResponse extends ResponseBase {
  forms: FormSchema[]
}

export interface NoteFormSchema extends NoteBaseSchema, BaseModelSchema {
  form_id: number
  // orm_mode
  form?: FormSchema
}

export interface HistoryFormSchema extends BaseModelSchema {
  user_name: string
  form_id: number
  // from form schema, need everything optional here so can't extend
  form_type_id?: number
  court_case_id?: number
  submit_date?: Date
  receipt_date?: Date
  rfe_date?: Date
  rfe_submit_date?: Date
  decision_date?: Date
  task_calendar_id?: number
  // orm_mode
  form?: FormSchema
  form_type?: FormTypeSchema
  task_calendar?: TaskCalendarSchema
  court_case?: CourtCaseSchema
}
