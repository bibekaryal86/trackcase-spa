import { getNumericOnly, isNumericOnly, validateAddress } from '../../app'
import { CourtSchema } from '../types/courts.data.types'

export const validateCourt = (court: CourtSchema) =>
  court.name.trim() &&
  court.status.trim() &&
  validateAddress(court.street_address, court.city, court.state, court.zip_code, true)

export const isAreTwoCourtsSame = (one: CourtSchema, two: CourtSchema) =>
  one &&
  two &&
  one.name === two.name &&
  one.dhs_address === two.dhs_address &&
  one.status === two.status &&
  one.comments === two.comments &&
  one.street_address === two.street_address &&
  one.city === two.city &&
  one.state === two.state &&
  one.zip_code === two.zip_code &&
  one.phone_number === two.phone_number

export const isCourtFormFieldError = (
  value: string | null | undefined,
  is_zip: boolean = false,
  is_phone: boolean = false,
): boolean =>
  !value || (is_zip ? value.trim().length !== 5 : is_phone ? value.trim().length != 10 : value.trim() === '')

export const handleCourtFormOnChange = (
  name: string,
  value: string,
  selectedCourt: CourtSchema,
  setSelectedCourt: (updatedCourt: CourtSchema) => void,
) => {
  let updatedCourt = selectedCourt
  switch (name) {
    case 'name':
      updatedCourt = {
        ...selectedCourt,
        name: value,
      }
      break
    case 'streetAddress':
      updatedCourt = {
        ...selectedCourt,
        street_address: value,
      }
      break
    case 'city':
      updatedCourt = {
        ...selectedCourt,
        city: value,
      }
      break
    case 'state':
      updatedCourt = {
        ...selectedCourt,
        state: value,
      }
      break
    case 'zipCode':
      updatedCourt = {
        ...selectedCourt,
        zip_code: isNumericOnly(value) ? value : selectedCourt.zip_code,
      }
      break
    case 'phoneNumber':
      updatedCourt = {
        ...selectedCourt,
        phone_number: getNumericOnly(value, 10),
      }
      break
    case 'dhsAddress':
      updatedCourt = {
        ...selectedCourt,
        dhs_address: value,
      }
      break
    case 'status':
      updatedCourt = {
        ...selectedCourt,
        status: value,
      }
      break
    case 'comments':
      updatedCourt = {
        ...selectedCourt,
        comments: value.length < 8888 ? value : selectedCourt.comments,
      }
      break
  }
  setSelectedCourt(updatedCourt)
}
