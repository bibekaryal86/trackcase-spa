import { Dayjs } from 'dayjs'

import { BaseModelSchema, ResponseBase } from '@app/types/app.data.types'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { AMOUNT_DEFAULT, ID_DEFAULT } from '@constants/index'
import { CollectionMethodSchema, ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'

export interface CaseCollectionBase {
  quoteAmount: number
  courtCaseId: number
  componentStatusId: number
  comments?: string
}
export interface CaseCollectionSchema extends CaseCollectionBase, BaseModelSchema {
  balanceAmount: number
  // orm_mode
  courtCase?: CourtCaseSchema
  componentStatus?: ComponentStatusSchema
  cashCollections?: CashCollectionSchema[]
  // history
  historyCaseCollections?: HistoryCaseCollectionSchema[]
}

export interface CaseCollectionResponse extends ResponseBase {
  data: CaseCollectionSchema[]
}

export interface CashCollectionBase {
  collectionDate: Dayjs | undefined // set undefined for default object
  collectedAmount: number
  waivedAmount: number
  memo: string
  caseCollectionId: number
  collectionMethodId: number
}

export interface CashCollectionSchema extends CashCollectionBase, BaseModelSchema {
  // orm_mode
  caseCollection?: CaseCollectionSchema
  collectionMethod?: CollectionMethodSchema
  // history
  historyCashCollections?: HistoryCashCollectionSchema[]
}

export interface CashCollectionResponse extends ResponseBase {
  data: CashCollectionSchema[]
}

export interface HistoryCaseCollectionSchema extends Partial<CaseCollectionBase>, BaseModelSchema {
  appUserId: number
  caseCollectionId: number
  // orm mode
  caseCollection?: CaseCollectionSchema
  courtCase?: CourtCaseSchema
}

export interface HistoryCashCollectionSchema extends Partial<CashCollectionBase>, BaseModelSchema {
  appUserId: number
  cashCollectionId: number
  // orm_mode
  cashCollection?: CashCollectionSchema
  caseCollection?: CaseCollectionSchema
  collectionMethod?: CollectionMethodSchema
}

export interface CollectionsState {
  caseCollections: CaseCollectionSchema[]
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface CollectionsAction extends CollectionsState {
  type: string
}

export interface CaseCollectionFormData extends CaseCollectionSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface CashCollectionFormData extends CashCollectionSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface CaseCollectionFormErrorData extends CaseCollectionSchema {
  quoteAmountError: string
  courtCaseError: string
  componentStatusError: string
}

export interface CashCollectionFormErrorData extends CashCollectionSchema {
  collectionDateError: string
  collectedAmountError: string
  waivedAmountError: string
  memo: string
  caseCollectionError: string
  collectionMethodError: string
}

export const DefaultCaseCollectionSchema: CaseCollectionSchema = {
  quoteAmount: AMOUNT_DEFAULT,
  courtCaseId: ID_DEFAULT,
  componentStatusId: ID_DEFAULT,
  comments: '',
  balanceAmount: AMOUNT_DEFAULT,
}

export const DefaultCashCollectionSchema: CashCollectionSchema = {
  caseCollectionId: ID_DEFAULT,
  collectedAmount: AMOUNT_DEFAULT,
  waivedAmount: AMOUNT_DEFAULT,
  collectionDate: undefined,
  collectionMethodId: ID_DEFAULT,
  memo: '',
}

export const DefaultCollectionsState: CollectionsState = {
  caseCollections: [],
  requestMetadata: {},
}

export const DefaultCaseCollectionFormData: CaseCollectionFormData = {
  ...DefaultCaseCollectionSchema,
  isHardDelete: false,
  isShowSoftDeleted: false,
}

export const DefaultCashCollectionFormData: CashCollectionFormData = {
  ...DefaultCashCollectionSchema,
  isHardDelete: false,
  isShowSoftDeleted: false,
}

export const DefaultCaseCollectionFormErrorData: CaseCollectionFormErrorData = {
  ...DefaultCaseCollectionFormData,
  quoteAmountError: '',
  courtCaseError: '',
  componentStatusError: '',
}

export const DefaultCashCollectionFormErrorData: CashCollectionFormErrorData = {
  ...DefaultCashCollectionFormData,
  collectionDateError: '',
  collectedAmountError: '',
  waivedAmountError: '',
  memo: '',
  caseCollectionError: '',
  collectionMethodError: '',
}
