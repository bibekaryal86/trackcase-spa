import { Dayjs } from 'dayjs'

import { BaseModelSchema, ResponseBase } from '@app/types/app.data.types'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { TaskCalendarSchema } from '@calendars/types/calendars.data.types'
import { CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ID_DEFAULT } from '@constants/index'
import { ComponentStatusSchema, FilingTypeSchema } from '@ref_types/types/refTypes.data.types'

export interface FilingBase {
  filingTypeId: number
  courtCaseId: number
  submitDate?: Dayjs
  receiptDate?: Dayjs
  receiptNumber?: string
  priorityDate?: Dayjs
  rfeDate?: Dayjs
  rfeSubmitDate?: Dayjs
  decisionDate?: Dayjs
  componentStatusId: number
  comments?: string
}

export interface FilingSchema extends FilingBase, BaseModelSchema {
  // orm_mode
  filingType?: FilingTypeSchema
  courtCase?: CourtCaseSchema
  componentStatus?: ComponentStatusSchema
  taskCalendars?: TaskCalendarSchema[]
  // history
  historyFilings?: HistoryFilingSchema[]
}

export interface FilingResponse extends ResponseBase {
  data: FilingSchema[]
}

export interface HistoryFilingSchema extends Partial<FilingBase>, BaseModelSchema {
  appUserId: number
  filingId: number
  // orm_mode
  filing?: FilingSchema
  filingType?: FilingTypeSchema
  courtCase?: CourtCaseSchema
  componentStatus?: ComponentStatusSchema
}

export interface FilingsState {
  filings: FilingSchema[]
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface FilingsAction extends FilingsState {
  type: string
}

export interface FilingFormData extends FilingSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface FilingFormErrorData extends FilingSchema {
  filingTypeError: string
  courtCaseError: string
  submitDateError: string
  receiptDateError: string
  receiptNumberError: string
  priorityDateError: string
  rfeDateError: string
  rfeSubmitDateError: string
  decisionDateError: string
  componentStatusError: string
}

export const DefaultFilingSchema: FilingSchema = {
  filingTypeId: ID_DEFAULT,
  courtCaseId: ID_DEFAULT,
  submitDate: undefined,
  receiptDate: undefined,
  receiptNumber: '',
  priorityDate: undefined,
  rfeDate: undefined,
  rfeSubmitDate: undefined,
  decisionDate: undefined,
  componentStatusId: ID_DEFAULT,
  comments: '',
}

export const DefaultFilingState: FilingsState = {
  filings: [],
  requestMetadata: {},
}

export const DefaultFilingFormData: FilingFormData = {
  ...DefaultFilingSchema,
  id: ID_DEFAULT,
  isHardDelete: false,
  isShowSoftDeleted: false,
}

export const DefaultFilingFormErrorData: FilingFormErrorData = {
  ...DefaultFilingFormData,
  filingTypeError: '',
  courtCaseError: '',
  submitDateError: '',
  receiptDateError: '',
  receiptNumberError: '',
  priorityDateError: '',
  rfeDateError: '',
  rfeSubmitDateError: '',
  decisionDateError: '',
  componentStatusError: '',
}
