import { getNumericOnly, isNumericOnly, validateAddress, validatePhoneNumber } from '../../app'
import { CourtSchema } from '../types/courts.data.types'

export const validateCourt = (court: CourtSchema) => {
  const errors: string[] = []

  if (!court.name.trim()) {
    errors.push('Name is required')
  }
  if (!validateAddress(court.streetAddress, court.city, court.state, court.zipCode, true)) {
    errors.push('Full address is incomplete/invalid')
  }
  if (!validatePhoneNumber(court.phoneNumber)) {
    errors.push('Phone Number is incomplete/invalid')
  }
  if (!court.status.trim()) {
    errors.push('Status is required')
  }

  return errors.length ? errors.join(', ') : ''
}

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
  if (name === 'zipCode') {
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
