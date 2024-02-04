import { Dayjs } from 'dayjs'

import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { CaseCollectionSchema, CashCollectionSchema } from '../../collections'
import { ID_DEFAULT } from '../../constants'
import { FormTypeSchema } from '../../types'

export interface FormSchema extends StatusBaseSchema, BaseModelSchema {
  formTypeId: number
  courtCaseId: number
  submitDate?: Dayjs
  receiptDate?: Dayjs
  receiptNumber?: string
  priorityDate?: Dayjs
  rfeDate?: Dayjs
  rfeSubmitDate?: Dayjs
  decisionDate?: Dayjs
  // orm_mode
  formType?: FormTypeSchema
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
  submitDate?: Dayjs
  receiptDate?: Dayjs
  receiptNumber?: string
  priorityDate?: Dayjs
  rfeDate?: Dayjs
  rfeSubmitDate?: Dayjs
  decisionDate?: Dayjs
  status?: string
  // orm_mode
  form?: FormSchema
  formType?: FormTypeSchema
  courtCase?: CourtCaseSchema
}

export interface FormsState {
  isForceFetch: boolean
  isCloseModal: boolean
  forms: FormSchema[]
  selectedForm: FormSchema
}

export interface FormsAction extends FormsState {
  type: string
}

export const DefaultFormSchema: FormSchema = {
  formTypeId: ID_DEFAULT,
  courtCaseId: ID_DEFAULT,
  submitDate: undefined,
  receiptDate: undefined,
  receiptNumber: '',
  priorityDate: undefined,
  rfeDate: undefined,
  rfeSubmitDate: undefined,
  decisionDate: undefined,
  status: '',
  comments: '',
}

export const DefaultFormState: FormsState = {
  isForceFetch: true,
  isCloseModal: true,
  forms: [],
  selectedForm: DefaultFormSchema,
}
