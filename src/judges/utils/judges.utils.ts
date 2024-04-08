import { ID_DEFAULT } from '@constants/index'

import { FetchRequestMetadata, getNumber } from '../../app'
import { DefaultJudgeFormErrorData, JudgeFormData, JudgeFormErrorData, JudgeSchema } from '../types/judges.data.types'

export const isAreTwoJudgesSame = (one: JudgeFormData | JudgeSchema, two: JudgeFormData | JudgeSchema) =>
  one &&
  two &&
  one.name === two.name &&
  one.webex === two.webex &&
  one.componentStatusId === two.componentStatusId &&
  one.comments === two.comments &&
  one.courtId === two.courtId

export const validateJudge = (formData: JudgeFormData, setFormErrors: (formErrors: JudgeFormErrorData) => void) => {
  let hasValidationErrors = false
  const formErrorsLocal: JudgeFormErrorData = { ...DefaultJudgeFormErrorData }

  if (!formData.name.trim()) {
    hasValidationErrors = true
    formErrorsLocal.name = 'REQUIRED'
  }
  if (getNumber(formData.courtId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.courtError = 'REQUIRED'
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

export const judgeDispatch = ({
  type = '',
  error = '',
  success = '',
  judges = [] as JudgeSchema[],
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
  } else if (judges) {
    return {
      type,
      judges,
      requestMetadata,
    }
  } else {
    return {
      type,
    }
  }
}

export const getJudgeFormDataFromSchema = (x: JudgeSchema): JudgeFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}
