import { Dayjs } from 'dayjs'

import { BaseModelSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { AMOUNT_DEFAULT, ID_DEFAULT } from '../../constants'
import { CollectionMethodSchema } from '../../types'

export interface CaseCollectionSchema extends StatusBaseSchema, BaseModelSchema {
  quoteDate: Dayjs | undefined // set undefined for default object
  quoteAmount: number
  courtCaseId: number
  // orm_mode
  courtCase?: CourtCaseSchema
  cashCollections?: CashCollectionSchema[]
  // history
  historyCaseCollections?: HistoryCaseCollectionSchema[]
}

export interface CaseCollectionResponse extends ResponseBase {
  caseCollections: CaseCollectionSchema[]
}

export interface CashCollectionSchema extends StatusBaseSchema, BaseModelSchema {
  collectionDate: Dayjs | undefined // set undefined for default object
  collectedAmount: number
  waivedAmount: number
  memo: string
  caseCollectionId: number
  collectionMethodId: number
  // orm_mode
  caseCollection?: CaseCollectionSchema
  collectionMethod?: CollectionMethodSchema
  // history
  historyCashCollections?: HistoryCashCollectionSchema[]
}

export interface CashCollectionResponse extends ResponseBase {
  cashCollections: CashCollectionSchema[]
}

export interface HistoryCaseCollectionSchema extends BaseModelSchema {
  userName: string
  caseCollectionId: number
  // from case collection schema, need everything optional here so can't extend
  status?: string
  comments?: string
  quoteDate?: Dayjs
  quoteAmount?: number
  courtCaseId?: number
  // orm mode
  caseCollection?: CaseCollectionSchema
  courtCase?: CourtCaseSchema
}

export interface HistoryCashCollectionSchema extends BaseModelSchema {
  userName: string
  cashCollectionId: number
  // from cash collection schema, need everything optional here so can't extend
  status?: string
  comments?: string
  collection_date?: Dayjs
  collectedAmount?: number
  waivedAmount?: number
  memo?: string
  caseCollectionId?: number
  collectionMethodId?: number
  // orm_mode
  cashCollection?: CashCollectionSchema
  caseCollection?: CaseCollectionSchema
  collectionMethod?: CollectionMethodSchema
}

export interface CollectionsState {
  isCloseModal: boolean
  caseCollections: CaseCollectionSchema[]
  cashCollections: CashCollectionSchema[]
  selectedCaseCollection: CaseCollectionSchema
  selectedCashCollection: CashCollectionSchema
}

export interface CollectionsAction extends CollectionsState {
  type: string
}

export const DefaultCaseCollectionSchema: CaseCollectionSchema = {
  quoteDate: undefined,
  quoteAmount: AMOUNT_DEFAULT,
  courtCaseId: ID_DEFAULT,
  status: '',
  comments: '',
}

export const DefaultCashCollectionSchema: CashCollectionSchema = {
  caseCollectionId: ID_DEFAULT,
  collectedAmount: AMOUNT_DEFAULT,
  waivedAmount: AMOUNT_DEFAULT,
  collectionDate: undefined,
  collectionMethodId: ID_DEFAULT,
  memo: '',
  status: '',
}

export const DefaultCollectionsState: CollectionsState = {
  isCloseModal: true,
  caseCollections: [],
  cashCollections: [],
  selectedCaseCollection: DefaultCaseCollectionSchema,
  selectedCashCollection: DefaultCashCollectionSchema,
}

export const DefaultCollectionSchema = {
  ...DefaultCaseCollectionSchema,
  ...DefaultCashCollectionSchema,
}