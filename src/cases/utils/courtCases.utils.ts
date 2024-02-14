import { getNumber } from '../../app'
import { CourtCaseSchema } from '../types/courtCases.data.types'

export const validateCourtCase = (courtCase: CourtCaseSchema) => {
  const errors: string[] = []

  if (getNumber(courtCase.caseTypeId) <= 0) {
    errors.push('Case Type is required')
  }
  if (getNumber(courtCase.clientId) <= 0) {
    errors.push('Client is required')
  }
  if (!courtCase.status.trim()) {
    errors.push('Status is required')
  }

  return errors.length ? errors.join(', ') : ''
}

export const isAreTwoCourtCasesSame = (one: CourtCaseSchema, two: CourtCaseSchema) =>
  one &&
  two &&
  one.caseTypeId === two.caseTypeId &&
  one.clientId === two.clientId &&
  one.status === two.status &&
  one.comments === two.comments

export const isCourtCaseFormFieldError = (name: string, value: string | number | undefined) => {
  switch (name) {
    case 'caseTypeId':
    case 'clientId':
      return !value || getNumber(value) <= 0
    case 'status':
      return !value || value.toString().trim() === ''
  }
  return false
}

export const handleCourtCaseFormOnChange = (
  name: string,
  value: string | number,
  selectedCourtCase: CourtCaseSchema,
  setSelectedCourtCase: (updatedCourtCase: CourtCaseSchema) => void,
  getValue: (value: string | number) => string | number,
) => {
  const updatedCourtCase = {
    ...selectedCourtCase,
    [name]: getValue(value),
  }
  setSelectedCourtCase(updatedCourtCase)
}
