import { FetchRequestMetadata, getNumber, validateAddress, validatePhoneNumber } from '../../app'
import { ID_DEFAULT } from '../../constants'
import { CourtFormData, CourtFormErrorData, CourtSchema, DefaultCourtFromErrorData } from '../types/courts.data.types'

export const isAreTwoCourtsSame = (one: CourtFormData | CourtSchema, two: CourtFormData | CourtSchema) =>
  one &&
  two &&
  one.name === two.name &&
  one.dhsAddress === two.dhsAddress &&
  one.componentStatusId === two.componentStatusId &&
  one.comments === two.comments &&
  one.streetAddress === two.streetAddress &&
  one.city === two.city &&
  one.state === two.state &&
  one.zipCode === two.zipCode &&
  one.phoneNumber === two.phoneNumber

export const validateCourt = (formData: CourtFormData, setFormErrors: (formErrors: CourtFormErrorData) => void) => {
  let hasValidationErrors = false
  const formErrorsLocal: CourtFormErrorData = { ...DefaultCourtFromErrorData }

  if (!formData.name.trim()) {
    hasValidationErrors = true
    formErrorsLocal.name = 'REQUIRED'
  }
  if (!validateAddress(formData.streetAddress, formData.city, formData.state, formData.zipCode, true)) {
    hasValidationErrors = true
    formErrorsLocal.streetAddress = 'INCOMPLETE ADDRESS'
  }
  if (!validatePhoneNumber(formData.phoneNumber)) {
    hasValidationErrors = true
    formErrorsLocal.phoneNumber = 'INCOMPLETE/INVALID'
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

export const courtDispatch = ({
  type = '',
  error = '',
  success = '',
  courts = [] as CourtSchema[],
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
  } else if (courts) {
    return {
      type,
      courts,
      requestMetadata,
    }
  } else {
    return {
      type,
    }
  }
}

export const getCourtFormDataFromSchema = (x: CourtSchema): CourtFormData => {
  return {
    id: x.id || ID_DEFAULT,
    name: x.name,
    componentStatusId: x.componentStatusId,
    streetAddress: x.streetAddress,
    city: x.city,
    state: x.state,
    zipCode: x.zipCode,
    phoneNumber: x.phoneNumber,
    dhsAddress: x.dhsAddress,
    comments: x.comments,
    isHardDelete: false,
    isShowSoftDeleted: false,
    isDeleted: x.isDeleted,
  }
}
