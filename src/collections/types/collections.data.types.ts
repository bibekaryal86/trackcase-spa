import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { FormSchema } from '../../forms'
import { CollectionMethodSchema } from '../../types'

export interface CaseCollectionSchema extends StatusBaseSchema, BaseModelSchema {
  quoteDate: Date
  quoteAmount: number
  initialPayment: number
  collectionMethodId: number
  courtCaseId: number
  formId?: number
  // orm_mode
  collectionMethod?: CollectionMethodSchema
  courtCase?: CourtCaseSchema
  form?: FormSchema
  cashCollections?: CashCollectionSchema[]
  // notes and history
  noteCaseCollections?: NoteCaseCollectionSchema[]
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
  // notes and history
  noteCashCollections?: NoteCashCollectionSchema[]
  historyCashCollections?: HistoryCashCollectionSchema[]
}

export interface CashCollectionResponse extends ResponseBase {
  cashCollections: CashCollectionSchema[]
}

export interface NoteCaseCollectionSchema extends NoteBaseSchema, BaseModelSchema {
  caseCollectionId: number
  // orm_mode
  caseCollection?: CaseCollectionSchema
}

export interface NoteCashCollectionSchema extends NoteBaseSchema, BaseModelSchema {
  cashCollectionId: number
  // orm_mode
  cashCollection?: CashCollectionSchema
}

export interface HistoryCaseCollectionSchema extends BaseModelSchema {
  userName: string
  caseCollectionId: number
  // from case collection schema, need everything optional here so can't extend
  status?: string
  comments?: string
  quoteDate?: Date
  quoteAmount?: number
  initialPayment?: number
  collectionMethodId?: number
  courtCaseId?: number
  formId?: number
  // orm mode
  caseCollection?: CaseCollectionSchema
  collectionMethod?: CollectionMethodSchema
  courtCase?: CourtCaseSchema
  form?: FormSchema
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
