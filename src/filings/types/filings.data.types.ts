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
  decisionDate?: Dayjs
  componentStatusId: number
  comments?: string
}

export interface FilingSchema extends FilingBase, BaseModelSchema {
  // orm_mode
  filingType?: FilingTypeSchema
  courtCase?: CourtCaseSchema
  componentStatus?: ComponentStatusSchema
  filingRfes?: FilingRfeSchema[]
  taskCalendars?: TaskCalendarSchema[]
  // history
  historyFilings?: HistoryFilingSchema[]
}

export interface FilingResponse extends ResponseBase {
  data: FilingSchema[]
}

export interface FilingRfeBase {
  filingId: number
  rfeDate?: Dayjs
  rfeSubmitDate?: Dayjs
  rfeReason: string
  comments?: string
}

export interface FilingRfeSchema extends FilingRfeBase, BaseModelSchema {
  // orm_mode
  filing?: FilingSchema
  // history
  historyFilingRfes?: HistoryFilingRfeSchema[]
}

export interface FilingRfeResponse extends ResponseBase {
  data: FilingRfeSchema[]
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

export interface HistoryFilingRfeSchema extends Partial<FilingRfeBase>, BaseModelSchema {
  appUserId: number
  filingRfeId: number
  // orm_mode
  filingRfe?: FilingRfeSchema
  filing?: FilingSchema
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

export interface FilingRfeFormData extends FilingRfeSchema {
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

export interface FilingRfeFormErrorData extends FilingRfeSchema {
  filingIdError: string
  rfeDateError: string
  rfeSubmitDateError: string
}

export const DefaultFilingSchema: FilingSchema = {
  filingTypeId: ID_DEFAULT,
  courtCaseId: ID_DEFAULT,
  submitDate: undefined,
  receiptDate: undefined,
  receiptNumber: '',
  priorityDate: undefined,
  decisionDate: undefined,
  componentStatusId: ID_DEFAULT,
  comments: '',
}

export const DefaultFilingRfeSchema: FilingRfeSchema = {
  filingId: ID_DEFAULT,
  rfeDate: undefined,
  rfeSubmitDate: undefined,
  rfeReason: '',
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

export const DefaultFilingRfeFormData: FilingRfeFormData = {
  ...DefaultFilingRfeSchema,
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

export const DefaultFilingRfeFormErrorData: FilingRfeFormErrorData = {
  ...DefaultFilingRfeFormData,
  filingIdError: '',
  rfeDateError: '',
  rfeSubmitDateError: '',
}
