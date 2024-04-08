import { getNumber, validateAddress, validatePhoneNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ID_DEFAULT } from '@constants/index'

import { CourtFormData, CourtFormErrorData, CourtSchema, DefaultCourtFormErrorData } from '../types/courts.data.types'

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
  const formErrorsLocal: CourtFormErrorData = { ...DefaultCourtFormErrorData }

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
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}
