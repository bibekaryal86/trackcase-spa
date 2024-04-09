import dayjs from 'dayjs'

import { getDayjs, getNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ClientSchema } from '@clients/types/clients.data.types'
import { ID_DEFAULT } from '@constants/index'
import { FilingTypeSchema } from '@ref_types/types/refTypes.data.types'

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
  const oneWeekBeforeDate = dayjs().subtract(1, 'week')

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
    if (!submitDate.isValid() || submitDate.isBefore(oneWeekBeforeDate)) {
      hasValidationErrors = true
      formErrorsLocal.submitDateError = 'REQUIRED/INVALID (BEFORE 1 WEEK)'
    }
  }
  const receiptDate = getDayjs(formData.receiptDate)
  if (receiptDate) {
    if (!receiptDate.isValid() || receiptDate.isBefore(oneWeekBeforeDate)) {
      hasValidationErrors = true
      formErrorsLocal.receiptDateError = 'REQUIRED/INVALID (BEFORE 1 WEEK)'
    }
    if (!submitDate || receiptDate.isBefore(submitDate)) {
      hasValidationErrors = true
      formErrorsLocal.submitDateError = 'REQUIRED/INVALID (AFTER RECEIPT DATE)'
    }
  }
  const priorityDate = getDayjs(formData.priorityDate)
  if (priorityDate) {
    if (!priorityDate.isValid() || priorityDate.isBefore(oneWeekBeforeDate)) {
      hasValidationErrors = true
      formErrorsLocal.priorityDateError = 'REQUIRED/INVALID (BEFORE 1 WEEK)'
    }
    if (!receiptDate || priorityDate.isBefore(receiptDate)) {
      hasValidationErrors = true
      formErrorsLocal.receiptDateError = 'REQUIRED/INVALID (AFTER PRIORITY DATE)'
    }
  }
  const rfeDate = getDayjs(formData.rfeDate)
  if (rfeDate) {
    if (!rfeDate.isValid() || rfeDate.isBefore(oneWeekBeforeDate)) {
      hasValidationErrors = true
      formErrorsLocal.rfeDateError = 'REQUIRED/INVALID (BEFORE 1 WEEK)'
    }
    if (!priorityDate || priorityDate.isBefore(rfeDate)) {
      hasValidationErrors = true
      formErrorsLocal.priorityDateError = 'REQUIRED/INVALID (AFTER PRIORITY DATE)'
    }
  }
  const rfeSubmitDate = getDayjs(formData.rfeSubmitDate)
  if (rfeSubmitDate) {
    if (!rfeSubmitDate.isValid() || rfeSubmitDate.isBefore(oneWeekBeforeDate)) {
      hasValidationErrors = true
      formErrorsLocal.rfeSubmitDateError = 'REQUIRED/INVALID (BEFORE 1 WEEK)'
    }
    if (!rfeDate || rfeSubmitDate.isBefore(rfeDate)) {
      hasValidationErrors = true
      formErrorsLocal.rfeDateError = 'REQUIRED/INVALID (AFTER RFE SUBMIT DATE)'
    }
  }
  const decisionDate = getDayjs(formData.decisionDate)
  if (decisionDate) {
    if (!decisionDate.isValid() || decisionDate.isBefore(oneWeekBeforeDate)) {
      hasValidationErrors = true
      formErrorsLocal.decisionDateError = 'REQUIRED/INVALID (BEFORE 1 WEEK)'
    }
    if (!priorityDate) {
      if (!rfeSubmitDate) {
        hasValidationErrors = true
        formErrorsLocal.priorityDateError = 'REQUIRED/INVALID (REQUIRED FOR DECISION DATE)'
        formErrorsLocal.rfeSubmitDateError = 'REQUIRED/INVALID (REQUIRED FOR DECISION DATE)'
      } else if (rfeSubmitDate.isBefore(decisionDate)) {
        hasValidationErrors = true
        formErrorsLocal.rfeSubmitDateError = 'REQUIRED/INVALID (AFTER DECISION DATE)'
      }
    } else if (priorityDate.isBefore(decisionDate)) {
      hasValidationErrors = true
      formErrorsLocal.priorityDateError = 'REQUIRED/INVALID (AFTER DECISION DATE)'
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

export const getClientFilingType = (
  filingTypeId: number,
  filingTypes: FilingTypeSchema[],
  courtCaseId: number,
  courtCasesList: CourtCaseSchema[],
  clientsList: ClientSchema[],
) => {
  const selectedFilingType = filingTypes.find((x) => x.id === filingTypeId)
  const selectedCourtCase = courtCasesList.find((x) => x.id === courtCaseId)
  if (selectedCourtCase) {
    const selectedClient = clientsList.find((x) => x.id === selectedCourtCase?.clientId)
    if (selectedFilingType && selectedClient) {
      return ': ' + selectedClient.name + ', ' + selectedFilingType.name
    }
  }
  return ''
}
