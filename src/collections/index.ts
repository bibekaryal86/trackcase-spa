// components
import Collections from './components/Collections'
// reducers
import collections from './reducers/collections.reducer'
// action types
// data types
import {
  CaseCollectionResponse,
  CaseCollectionSchema,
  CashCollectionResponse,
  CashCollectionSchema,
  CollectionsState,
  HistoryCaseCollectionSchema,
  HistoryCashCollectionSchema,
} from './types/collections.data.types'

export { Collections }
export { collections }
export type {
  CollectionsState,
  CashCollectionSchema,
  CashCollectionResponse,
  CaseCollectionSchema,
  CaseCollectionResponse,
  HistoryCaseCollectionSchema,
  HistoryCashCollectionSchema,
}
