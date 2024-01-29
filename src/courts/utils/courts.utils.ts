import { getComments, getNumericOnly, isNumericOnly, validateAddress } from '../../app'
import { CourtSchema } from '../types/courts.data.types'

export const validateCourt = (court: CourtSchema) =>
  court.name.trim() &&
  court.status.trim() &&
  validateAddress(court.streetAddress, court.city, court.state, court.zipCode, true)

export const isAreTwoCourtsSame = (one: CourtSchema, two: CourtSchema) =>
  one &&
  two &&
  one.name === two.name &&
  one.dhsAddress === two.dhsAddress &&
  one.status === two.status &&
  one.comments === two.comments &&
  one.streetAddress === two.streetAddress &&
  one.city === two.city &&
  one.state === two.state &&
  one.zipCode === two.zipCode &&
  one.phoneNumber === two.phoneNumber

export const isCourtFormFieldError = (
  value: string | null | undefined,
  is_zip: boolean = false,
  is_phone: boolean = false,
): boolean =>
  !value || (is_zip ? value.trim().length !== 5 : is_phone ? value.trim().length != 10 : value.trim() === '')

export const handleCourtFormOnChange = (
  name: string,
  value: string | number,
  selectedCourt: CourtSchema,
  setSelectedCourt: (updatedCourt: CourtSchema) => void,
  getValue: (value: string | number) => string | number,
) => {
  if (name === 'comments') {
    value = getComments(value.toString())
  } else if (name === 'zipCode') {
    value = isNumericOnly(value.toString()) ? value : selectedCourt.zipCode ? selectedCourt.zipCode : ''
  } else if (name === 'phoneNumber') {
    value = getNumericOnly(value.toString(), 10)
  }
  const updatedCourt = {
    ...selectedCourt,
    [name]: getValue(value),
  }
  setSelectedCourt(updatedCourt)
}
