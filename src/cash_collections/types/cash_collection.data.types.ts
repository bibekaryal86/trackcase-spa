import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../court_cases'
import { FormSchema } from '../../forms'
import { CollectionMethodSchema } from '../../ref_types'

export interface CaseCollectionSchema extends StatusBaseSchema, BaseModelSchema {
  quote_date: Date
  quote_amount: number
  initial_payment: number
  collection_method_id: number
  court_case_id: number
  form_id?: number
  // orm_mode
  collection_method?: CollectionMethodSchema
  court_case?: CourtCaseSchema
  form?: FormSchema
  cash_collections?: CashCollectionSchema[]
  // notes and history
  note_case_collections?: NoteCaseCollectionSchema[]
  history_case_collections?: HistoryCaseCollectionSchema[]
}

export interface CaseCollectionResponse extends ResponseBase {
  cash_collections: CaseCollectionSchema[]
}

export interface CashCollectionSchema extends StatusBaseSchema, BaseModelSchema {
  collection_date: Date
  collected_amount: number
  waived_amount: number
  memo?: string
  case_collection_id: number
  collection_method_id: number
  // orm_mode
  case_collection?: CaseCollectionSchema
  collection_method?: CollectionMethodSchema
  // notes and history
  note_cash_collections?: NoteCashCollectionSchema[]
  history_cash_collections?: HistoryCashCollectionSchema[]
}

export interface CashCollectionResponse extends ResponseBase {
  cash_collections: CashCollectionSchema[]
}

export interface NoteCaseCollectionSchema extends NoteBaseSchema, BaseModelSchema {
  case_collection_id: number
  // orm_mode
  case_collection?: CaseCollectionSchema
}

export interface NoteCashCollectionSchema extends NoteBaseSchema, BaseModelSchema {
  cash_collection_id: number
  // orm_mode
  cash_collection?: CashCollectionSchema
}

export interface HistoryCaseCollectionSchema extends BaseModelSchema {
  user_name: string
  case_collection_id: number
  // from case collection schema, need everything optional here so can't extend
  status?: string
  comments?: string
  quote_date?: Date
  quote_amount?: number
  initial_payment?: number
  collection_method_id?: number
  court_case_id?: number
  form_id?: number
  // orm mode
  case_collection?: CaseCollectionSchema
  collection_method?: CollectionMethodSchema
  court_case?: CourtCaseSchema
  form?: FormSchema
}

export interface HistoryCashCollectionSchema extends BaseModelSchema {
  user_name: string
  cash_collection_id: number
  // from cash collection schema, need everything optional here so can't extend
  status?: string
  comments?: string
  collection_date?: Date
  collected_amount?: number
  waived_amount?: number
  memo?: string
  case_collection_id?: number
  collection_method_id?: number
  // orm_mode
  cash_collection?: CashCollectionSchema
  case_collection?: CaseCollectionSchema
  collection_method?: CollectionMethodSchema
}
