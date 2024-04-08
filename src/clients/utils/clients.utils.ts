import { ID_DEFAULT } from '@constants/index'

import { FetchRequestMetadata, getNumber, validateAddress, validateEmailAddress, validatePhoneNumber } from '../../app'
import {
  ClientFormData,
  ClientFormErrorData,
  ClientSchema,
  DefaultClientFormErrorData,
} from '../types/clients.data.types'

export const isAreTwoClientsSame = (one: ClientFormData | ClientSchema, two: ClientFormData | ClientSchema) =>
  one &&
  two &&
  one.name === two.name &&
  one.aNumber === two.aNumber &&
  one.email === two.email &&
  one.streetAddress === two.streetAddress &&
  one.city === two.city &&
  one.state === two.state &&
  one.zipCode === two.zipCode &&
  one.phoneNumber === two.phoneNumber &&
  one.componentStatusId === two.componentStatusId &&
  one.comments === two.comments &&
  one.judgeId === two.judgeId

export const validateClient = (formData: ClientFormData, setFormErrors: (formErrors: ClientFormErrorData) => void) => {
  let hasValidationErrors = false
  const formErrorsLocal: ClientFormErrorData = { ...DefaultClientFormErrorData }

  if (!formData.name.trim()) {
    hasValidationErrors = true
    formErrorsLocal.name = 'REQUIRED'
  }
  if (!validateAddress(formData.streetAddress, formData.city, formData.state, formData.zipCode, false)) {
    hasValidationErrors = true
    formErrorsLocal.streetAddress = 'INCOMPLETE ADDRESS'
  }
  if (!validatePhoneNumber(formData.phoneNumber)) {
    hasValidationErrors = true
    formErrorsLocal.phoneNumber = 'INCOMPLETE/INVALID'
  }
  if (!validateEmailAddress(formData.email)) {
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

export const clientDispatch = ({
  type = '',
  error = '',
  success = '',
  clients = [] as ClientSchema[],
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
  } else if (clients) {
    return {
      type,
      clients,
      requestMetadata,
    }
  } else {
    return {
      type,
    }
  }
}

export const getClientFormDataFromSchema = (x: ClientSchema): ClientFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}
