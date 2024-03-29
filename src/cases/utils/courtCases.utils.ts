import { FetchRequestMetadata, getNumber } from '../../app'
import { ID_DEFAULT } from '../../constants'
import {
  CourtCaseFormData,
  CourtCaseFormErrorData,
  CourtCaseSchema,
  DefaultCourtCaseFormErrorData,
} from '../types/courtCases.data.types'

export const isAreTwoCourtCasesSame = (
  one: CourtCaseFormData | CourtCaseSchema,
  two: CourtCaseFormData | CourtCaseSchema,
) =>
  one &&
  two &&
  one.caseTypeId === two.caseTypeId &&
  one.clientId === two.clientId &&
  one.componentStatusId === two.componentStatusId &&
  one.comments === two.comments

export const validateCourtCase = (
  formData: CourtCaseFormData,
  setFormErrors: (formErrors: CourtCaseFormErrorData) => void,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: CourtCaseFormErrorData = { ...DefaultCourtCaseFormErrorData }

  if (getNumber(formData.caseTypeId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.caseTypeError = 'REQUIRED'
  }
  if (getNumber(formData.clientId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.clientError = 'REQUIRED'
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

export const courtCaseDispatch = ({
  type = '',
  error = '',
  success = '',
  courtCases = [] as CourtCaseSchema[],
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
  } else if (courtCases) {
    return {
      type,
      courtCases,
      requestMetadata,
    }
  } else {
    return {
      type,
    }
  }
}

export const getCourtCaseFormDataFromSchema = (x: CourtCaseSchema): CourtCaseFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}
