import { Dayjs } from 'dayjs'

import { BaseModelSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { TaskCalendarSchema } from '../../calendars'
import { CourtCaseSchema } from '../../cases'
import { ID_DEFAULT } from '../../constants'
import { FilingTypeSchema } from '../../types'

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
  formType?: FilingTypeSchema
  courtCase?: CourtCaseSchema
  taskCalendars?: TaskCalendarSchema[]
  // history
  historyForms?: HistoryFormSchema[]
}

export interface FormResponse extends ResponseBase {
  forms: FormSchema[]
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
  comments?: string
  // orm_mode
  form?: FormSchema
  formType?: FilingTypeSchema
  courtCase?: CourtCaseSchema
}

export interface FormsState {
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
  isCloseModal: true,
  forms: [],
  selectedForm: DefaultFormSchema,
}
