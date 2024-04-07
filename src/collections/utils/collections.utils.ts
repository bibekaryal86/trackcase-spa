import { FetchRequestMetadata, getDayjs, getNumber } from '../../app'
import { AMOUNT_DEFAULT, COLLECTION_TYPES, ID_DEFAULT } from '../../constants'
import {
  CaseCollectionFormData,
  CaseCollectionFormErrorData,
  CaseCollectionSchema,
  CashCollectionFormData,
  CashCollectionFormErrorData,
  CashCollectionSchema,
  DefaultCaseCollectionFormErrorData,
  DefaultCashCollectionFormErrorData,
} from '../types/collections.data.types'

export const getAmountForDisplay = (value: number) => {
  if (value) {
    if (getNumber(value) === AMOUNT_DEFAULT) {
      return undefined
    } else {
      return String(value)
    }
  }
  return undefined
}

export const getCollectionType = (
  collection: CaseCollectionSchema | CashCollectionSchema | CaseCollectionFormData | CashCollectionFormData,
): string | undefined => {
  if ('quoteAmount' in collection && 'courtCaseId' in collection) {
    return COLLECTION_TYPES.CASE_COLLECTION
  } else if ('collectionDate' in collection && 'collectionAmount' in collection) {
    return COLLECTION_TYPES.CASH_COLLECTION
  }
  return undefined
}

export const isCaseCollection = (
  collection: CaseCollectionSchema | CashCollectionSchema | CaseCollectionFormData | CashCollectionFormData,
) => getCollectionType(collection) === COLLECTION_TYPES.CASE_COLLECTION

export const isAreTwoCollectionsSame = (
  one: CaseCollectionSchema | CashCollectionSchema | CaseCollectionFormData | CashCollectionFormData,
  two: CaseCollectionSchema | CashCollectionSchema | CaseCollectionFormData | CashCollectionFormData,
) =>
  isCaseCollection(one)
    ? isAreTwoCaseCollectionsSame(one as CaseCollectionFormData, two as CaseCollectionFormData)
    : isAreTwoCashCollectionsSame(one as CashCollectionFormData, two as CashCollectionFormData)

export const isAreTwoCaseCollectionsSame = (
  one: CaseCollectionSchema | CaseCollectionFormData,
  two: CaseCollectionSchema | CaseCollectionFormData,
) =>
  one &&
  two &&
  one.quoteAmount === two.quoteAmount &&
  one.courtCaseId === two.courtCaseId &&
  one.componentStatusId === two.componentStatusId &&
  one.comments === two.comments

export const isAreTwoCashCollectionsSame = (one: CashCollectionSchema, two: CashCollectionSchema) =>
  one &&
  two &&
  one.collectionDate === two.collectionDate &&
  one.collectedAmount === two.collectedAmount &&
  one.waivedAmount === two.waivedAmount &&
  one.memo?.trim() === two.memo?.trim() &&
  one.caseCollectionId === two.caseCollectionId &&
  one.collectionMethodId === two.collectionMethodId

export const validateCaseCollection = (
  formData: CaseCollectionFormData,
  setFormErrors: (formErrors: CaseCollectionFormErrorData) => void,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: CaseCollectionFormErrorData = { ...DefaultCaseCollectionFormErrorData }

  if (!formData.quoteAmount || getNumber(formData.quoteAmount) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.quoteAmountError = 'REQUIRED/INVALID'
  }
  if (getNumber(formData.courtCaseId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.courtCaseError = 'REQUIRED'
  }
  if (getNumber(formData.componentStatusId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.componentStatusError = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const validateCashCollection = (
  formData: CashCollectionFormData,
  setFormErrors: (formErrors: CashCollectionFormErrorData) => void,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: CashCollectionFormErrorData = { ...DefaultCashCollectionFormErrorData }

  const collectionDate = getDayjs(formData.collectionDate)
  if (!collectionDate || !collectionDate.isValid()) {
    hasValidationErrors = true
    formErrorsLocal.collectionDateError = 'INVALID/MISSING'
  }
  if (getNumber(formData.collectedAmount) <= 0 && getNumber(formData.waivedAmount) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.collectedAmountError = 'ONE IS REQUIRED'
    formErrorsLocal.waivedAmountError = 'ONE IS REQUIRED'
  }
  if (!formData.memo || !formData.memo.trim()) {
    hasValidationErrors = true
    formErrorsLocal.memo = 'REQUIRED'
  }
  if (getNumber(formData.caseCollectionId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.caseCollectionError = 'REQUIRED'
  }
  if (getNumber(formData.collectionMethodId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.collectionMethodError = 'REQUIRED'
  }

  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const collectionDispatch = ({
  type = '',
  error = '',
  success = '',
  caseCollections = [] as CaseCollectionSchema[],
  requestMetadata = {} as Partial<FetchRequestMetadata>,
} = {}) => {
  if (error) {
    return {
      type,
      error,
    }
  } else if (success) {
    return {
      type,
      success,
    }
  } else if (caseCollections) {
    return {
      type,
      caseCollections,
      requestMetadata,
    }
  } else {
    return {
      type,
    }
  }
}

export const getCollectionFormDataFromSchema = (x: CaseCollectionSchema | CashCollectionSchema) =>
  isCaseCollection(x)
    ? getCaseCollectionFormDataFromSchema(x as CaseCollectionSchema)
    : getCashCollectionFormDataFromSchema(x as CashCollectionSchema)

export const getCaseCollectionFormDataFromSchema = (x: CaseCollectionSchema): CaseCollectionFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}

export const getCashCollectionFormDataFromSchema = (x: CashCollectionSchema): CashCollectionFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}

export const checkCorrectCollectionTypes = (type: string): boolean => {
  return type === COLLECTION_TYPES.CASE_COLLECTION || type === COLLECTION_TYPES.CASH_COLLECTION
}
