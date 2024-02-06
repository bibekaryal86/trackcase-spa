import { BaseModelSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { CollectionMethodSchema } from '../../types'

export interface CaseCollectionSchema extends StatusBaseSchema, BaseModelSchema {
  quoteDate: Date
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
  collectionDate: Date
  collectedAmount: number
  waivedAmount: number
  memo?: string
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
  quoteDate?: Date
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
  collection_date?: Date
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
