import { Dayjs } from 'dayjs'

import { getDayjs, getNumber, getNumericOnly } from '../../app'
import { COLLECTION_OBJECT_TYPES } from '../../constants'
import { CaseCollectionSchema, CashCollectionSchema } from '../types/collections.data.types'

export const isCaseCollection = (type: string) => COLLECTION_OBJECT_TYPES.CASE === type

export const validateCollectionType = (collectionType: string): boolean =>
  collectionType === COLLECTION_OBJECT_TYPES.CASE || collectionType === COLLECTION_OBJECT_TYPES.CASH

export const getCashCollections = (caseCollections: CaseCollectionSchema[]) => {
  const cashCollections: CashCollectionSchema[] = []

  for (const caseCollection of caseCollections) {
    if (caseCollection.cashCollections) {
      cashCollections.push(...caseCollection.cashCollections)
    }
  }
  return cashCollections
}

export const validateCollection = (collectionType: string, collection: CaseCollectionSchema | CashCollectionSchema) => {
  const errors: string[] = []

  if (!validateCollectionType(collectionType)) {
    return 'Invalid Collection Type!!!'
  }
  // common
  if (!collection.status.trim()) {
    errors.push('Status is required!')
  }
  // case collection
  if (collectionType === COLLECTION_OBJECT_TYPES.CASE) {
    const caseCollection = collection as CaseCollectionSchema
    const quoteDate = getDayjs(caseCollection.quoteDate)
    if (!quoteDate || !quoteDate.isValid()) {
      errors.push('Quote Date is required!')
    }
    if (!caseCollection.quoteAmount || getNumber(caseCollection.quoteAmount) <= 0) {
      errors.push('Quote Amount is required!')
    }
    if (!caseCollection.courtCaseId || getNumber(caseCollection.courtCaseId) <= 0) {
      errors.push('Case is required!')
    }
  } else {
    // cash collection
    const cashCollection = collection as CashCollectionSchema
    const collectionDate = getDayjs(cashCollection.collectionDate)
    if (!collectionDate || !collectionDate.isValid()) {
      errors.push('Collection Date is required!')
    }
    // either collection amount or waived amount is required
    if (
      !(cashCollection.collectedAmount || getNumber(cashCollection.collectedAmount) <= 0) &&
      !(cashCollection.waivedAmount || getNumber(cashCollection.waivedAmount) <= 0)
    ) {
      errors.push('Collected Amount or Waived Amount is required!')
    }
    if (!cashCollection.memo.trim()) {
      errors.push('Memo is required!')
    }
    if (getNumber(cashCollection.caseCollectionId) <= 0) {
      errors.push('Case Collection is required!')
    }
    if (getNumber(cashCollection.collectionMethodId) <= 0) {
      errors.push('Collection Method is required!')
    }
  }

  return errors.length ? errors.join(', ') : ''
}

export const isAreTwoCaseCollectionsSame = (one: CaseCollectionSchema, two: CaseCollectionSchema) =>
  one &&
  two &&
  one.quoteDate === two.quoteDate &&
  one.quoteAmount === two.quoteAmount &&
  one.courtCaseId === two.courtCaseId

export const isAreTwoCashCollectionsSame = (one: CashCollectionSchema, two: CashCollectionSchema) =>
  one &&
  two &&
  one.collectionDate === two.collectionDate &&
  one.collectedAmount === two.collectedAmount &&
  one.waivedAmount === two.waivedAmount &&
  one.memo.trim() === two.memo.trim() &&
  one.caseCollectionId === two.caseCollectionId &&
  one.collectionMethodId === two.collectionMethodId

export const isCollectionFormFieldError = (
  name: string,
  value: string | number | undefined,
  dateValue: Dayjs | null | undefined,
) => {
  switch (name) {
    case 'courtCaseId':
    case 'quoteAmount':
    case 'caseCollectionId':
    case 'collectionMethodId':
      return !value || getNumber(value) <= 0
    case 'status':
    case 'memo':
      return !value || value.toString().trim() === ''
    case 'quoteDate':
    case 'collectionDate':
      return !dateValue || !dateValue.isValid()
  }
  return false
}

export const handleCollectionDateOnChange = (
  name: string,
  value: Dayjs | null,
  selectedCollection: CaseCollectionSchema | CashCollectionSchema,
  setSelectedCollection: (updatedCollection: CaseCollectionSchema | CashCollectionSchema) => void,
) => {
  const updatedCollection = {
    ...selectedCollection,
    [name]: value,
  }
  setSelectedCollection(updatedCollection)
}

export const handleCollectionFormOnChange = (
  name: string,
  value: string | number,
  selectedCollection: CaseCollectionSchema | CashCollectionSchema,
  setSelectedCollection: (updatedCollection: CaseCollectionSchema | CashCollectionSchema) => void,
  getValue: (value: string | number) => string | number,
) => {
  if (name.includes('Amount')) {
    value = getNumericOnly(value.toString(), 10)
  }
  const updatedCollection = {
    ...selectedCollection,
    [name]: getValue(value),
  }
  setSelectedCollection(updatedCollection)
}