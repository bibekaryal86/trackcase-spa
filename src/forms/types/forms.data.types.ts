import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { TaskCalendarSchema } from '../../calendars'
import { CourtCaseSchema } from '../../cases'
import { CaseCollectionSchema, CashCollectionSchema } from '../../collections'
import { FormTypeSchema } from '../../types'

export interface FormSchema extends StatusBaseSchema, BaseModelSchema {
  formTypeId: number
  courtCaseId: number
  submitDate?: Date
  receiptDate?: Date
  rfeDate?: Date
  rfeSubmitDate?: Date
  decisionDate?: Date
  taskCalendarId?: number
  // orm_mode
  formType?: FormTypeSchema
  taskCalendar?: TaskCalendarSchema
  courtCase?: CourtCaseSchema
  caseCollections?: CaseCollectionSchema[]
  cashCollections?: CashCollectionSchema[]
  // notes and history
  noteForms?: NoteFormSchema[]
  historyForms?: HistoryFormSchema[]
}

export interface FormResponse extends ResponseBase {
  forms: FormSchema[]
}

export interface NoteFormSchema extends NoteBaseSchema, BaseModelSchema {
  formId: number
  // orm_mode
  form?: FormSchema
}

export interface HistoryFormSchema extends BaseModelSchema {
  userName: string
  formId: number
  // from form schema, need everything optional here so can't extend
  formTypeId?: number
  courtCaseId?: number
  submitDate?: Date
  receiptDate?: Date
  rfeDate?: Date
  rfeSubmitDate?: Date
  decisionDate?: Date
  taskCalendarId?: number
  // orm_mode
  form?: FormSchema
  formType?: FormTypeSchema
  taskCalendar?: TaskCalendarSchema
  courtCase?: CourtCaseSchema
}
