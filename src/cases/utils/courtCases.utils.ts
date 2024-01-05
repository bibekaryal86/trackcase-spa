import { getNumber } from '../../app'
import { CourtCaseSchema } from '../types/courtCases.data.types'

export const validateCourtCase = (courtCase: CourtCaseSchema) =>
  courtCase.caseTypeId && courtCase.clientId && courtCase.status

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
) => {
  let updatedCourtCase = selectedCourtCase
  switch (name) {
    case 'caseTypeId':
      updatedCourtCase = {
        ...selectedCourtCase,
        caseTypeId: getNumber(value),
      }
      break
    case 'clientId':
      updatedCourtCase = {
        ...selectedCourtCase,
        clientId: getNumber(value),
      }
      break
    case 'status':
      updatedCourtCase = {
        ...selectedCourtCase,
        status: value.toString(),
      }
      break
    case 'comments':
      updatedCourtCase = {
        ...selectedCourtCase,
        comments: value.toString().length < 8888 ? value.toString() : selectedCourtCase.comments,
      }
      break
  }
  setSelectedCourtCase(updatedCourtCase)
}
