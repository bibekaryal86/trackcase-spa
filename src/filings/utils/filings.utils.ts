import dayjs from 'dayjs'

import { FetchRequestMetadata, getDayjs, getNumber } from '../../app'
import { ID_DEFAULT } from '../../constants'
import {
  DefaultFilingFormErrorData,
  FilingFormData,
  FilingFormErrorData,
  FilingSchema,
} from '../types/filings.data.types'

export const isAreTwoFilingsSame = (one: FilingSchema | FilingFormData, two: FilingSchema | FilingFormData) =>
  one &&
  two &&
  one.filingTypeId === two.filingTypeId &&
  one.courtCaseId === two.courtCaseId &&
  one.submitDate === two.submitDate &&
  one.receiptDate === two.receiptDate &&
  one.receiptNumber === two.receiptNumber &&
  one.receiptDate === two.receiptDate &&
  one.rfeDate === two.rfeDate &&
  one.rfeSubmitDate === two.rfeSubmitDate &&
  one.decisionDate === two.decisionDate &&
  one.componentStatusId === two.componentStatusId &&
  one.comments === two.comments

export const validateFiling = (formData: FilingFormData, setFormErrors: (formErrors: FilingFormErrorData) => void) => {
  let hasValidationErrors = false
  const formErrorsLocal: FilingFormErrorData = { ...DefaultFilingFormErrorData }

  if (getNumber(formData.filingTypeId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.filingTypeError = 'REQUIRED'
  }
  if (getNumber(formData.courtCaseId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.courtCaseError = 'REQUIRED'
  }
  if (getNumber(formData.componentStatusId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.componentStatusError = 'REQUIRED'
  }
  const submitDate = getDayjs(formData.submitDate)
  if (submitDate) {
    if (!submitDate.isValid() || submitDate.isBefore(dayjs(), 'day')) {
      hasValidationErrors = true
      formErrorsLocal.submitDateError = 'SUBMIT DATE INVALID OR IN THE PAST'
    }
  }
  const receiptDate = getDayjs(formData.receiptDate)
  if (receiptDate) {
    if (!receiptDate.isValid() || receiptDate.isBefore(dayjs(), 'day')) {
      hasValidationErrors = true
      formErrorsLocal.receiptDateError = 'RECEIPT DATE INVALID OR IN THE PAST'
    }
    if (!submitDate || receiptDate.isBefore(submitDate, 'day')) {
      hasValidationErrors = true
      formErrorsLocal.submitDateError = 'SUBMIT DATE INVALID OR AFTER RECEIPT DATE'
    }
  }
  const priorityDate = getDayjs(formData.priorityDate)
  if (priorityDate) {
    if (!priorityDate.isValid() || priorityDate.isBefore(dayjs(), 'day')) {
      hasValidationErrors = true
      formErrorsLocal.priorityDateError = 'PRIORITY DATE INVALID OR IN THE PAST'
    }
    if (!receiptDate || priorityDate.isBefore(receiptDate, 'day')) {
      hasValidationErrors = true
      formErrorsLocal.receiptDateError = 'RECEIPT DATE INVALID OR AFTER PRIORITY DATE'
    }
  }
  const rfeDate = getDayjs(formData.rfeDate)
  if (rfeDate) {
    if (!rfeDate.isValid() || rfeDate.isBefore(dayjs(), 'day')) {
      hasValidationErrors = true
      formErrorsLocal.rfeDateError = 'RFE DATE INVALID OR IN THE PAST'
    }
    if (!priorityDate || priorityDate.isBefore(rfeDate, 'day')) {
      hasValidationErrors = true
      formErrorsLocal.priorityDateError = 'PRIORITY DATE INVALID OR IS AFTER RFE DATE'
    }
  }
  const rfeSubmitDate = getDayjs(formData.rfeSubmitDate)
  if (rfeSubmitDate) {
    if (!rfeSubmitDate.isValid() || rfeSubmitDate.isBefore(dayjs(), 'day')) {
      hasValidationErrors = true
      formErrorsLocal.rfeSubmitDateError = 'RFE SUBMIT DATE INVALID OR IN THE PAST'
    }
    if (!rfeDate || rfeSubmitDate.isBefore(rfeDate, 'day')) {
      hasValidationErrors = true
      formErrorsLocal.rfeDateError = 'RFE DATE INVALID OR IS AFTER RFE SUBMIT DATE'
    }
  }
  const decisionDate = getDayjs(formData.decisionDate)
  if (decisionDate) {
    if (!decisionDate.isValid() || decisionDate.isBefore(dayjs(), 'day')) {
      hasValidationErrors = true
      formErrorsLocal.decisionDateError = 'DECISION DATE INVALID OR IN THE PAST'
    }
    if (!priorityDate) {
      if (!rfeSubmitDate) {
        hasValidationErrors = true
        formErrorsLocal.priorityDateError = 'PRIORITY DATE OR RFE SUBMIT DATE REQUIRED FOR DECISION DATE'
        formErrorsLocal.rfeSubmitDateError = 'PRIORITY DATE OR RFE SUBMIT DATE REQUIRED FOR DECISION DATE'
      } else if (rfeSubmitDate.isBefore(decisionDate)) {
        hasValidationErrors = true
        formErrorsLocal.rfeSubmitDateError = 'RFE SUBMIT DATE IS AFTER DECISION DATE'
      }
    } else if (priorityDate.isBefore(decisionDate)) {
      hasValidationErrors = true
      formErrorsLocal.priorityDateError = 'PRIORITY DATE IS AFTER DECISION DATE'
    }
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const filingDispatch = ({
  type = '',
  error = '',
  success = '',
  filings = [] as FilingSchema[],
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
  } else if (filings) {
    return {
      type,
      filings,
      requestMetadata,
    }
  } else {
    return {
      type,
    }
  }
}

export const getFilingFormDataFromSchema = (x: FilingSchema): FilingFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}
