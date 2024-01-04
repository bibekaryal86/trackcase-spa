import { getNumber } from '../../app'
import { CourtCaseSchema } from '../types/court_cases.data.types'

export const validateCourtCase = (courtCase: CourtCaseSchema) =>
  courtCase.case_type_id && courtCase.client_id && courtCase.status

export const isAreTwoCourtCasesSame = (one: CourtCaseSchema, two: CourtCaseSchema) =>
  one &&
  two &&
  one.case_type_id === two.case_type_id &&
  one.client_id === two.client_id &&
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
        case_type_id: getNumber(value),
      }
      break
    case 'clientId':
      updatedCourtCase = {
        ...selectedCourtCase,
        client_id: getNumber(value),
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
