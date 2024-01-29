import { getComments, getNumericOnly, isNumericOnly, validateAddress, validateEmailAddress } from '../../app'
import { ClientSchema } from '../types/clients.data.types'

export const validateClient = (client: ClientSchema) => {
  const nameValid = !!client.name.trim()
  const phoneValid = !!client.phoneNumber?.trim()
  const emailValid = !!client.email.trim() && validateEmailAddress(client.email)
  const addressValid = validateAddress(client.streetAddress, client.city, client.state, client.zipCode, false)
  return nameValid && phoneValid && emailValid && addressValid
}

export const isAreTwoClientsSame = (one: ClientSchema, two: ClientSchema) =>
  one &&
  two &&
  one.name === two.name &&
  one.aNumber === two.aNumber &&
  one.email === two.email &&
  one.judgeId === two.judgeId &&
  one.status === two.status &&
  one.comments === two.comments &&
  one.streetAddress === two.streetAddress &&
  one.city === two.city &&
  one.state === two.state &&
  one.zipCode === two.zipCode &&
  one.phoneNumber === two.phoneNumber

export const isClientFormFieldError = (name: string, value: string | undefined, selectedClient: ClientSchema) => {
  switch (name) {
    case 'name':
    case 'aNumber':
    case 'status':
      return !value || value.trim() === ''
    case 'phoneNumber':
      return !value || value.trim().length !== 10
    case 'email':
      return !value || !validateEmailAddress(value.trim())
    case 'streetAddress':
    case 'city':
    case 'state':
    case 'zipCode':
      if (value) {
        return !(selectedClient.streetAddress && selectedClient.city && selectedClient.state && selectedClient.zipCode)
      }
  }
  return false
}

export const handleClientFormOnChange = (
  name: string,
  value: string | number,
  selectedClient: ClientSchema,
  setSelectedClient: (updatedClient: ClientSchema) => void,
  getValue: (value: string | number) => string | number,
) => {
  if (name === 'comments') {
    value = getComments(value.toString())
  } else if (name === 'aNumber') {
    value = getNumericOnly(value.toString(), 9)
  } else if (name === 'zipCode') {
    value = isNumericOnly(value.toString()) ? value : selectedClient.zipCode ? selectedClient.zipCode : ''
  } else if (name === 'phoneNumber') {
    value = getNumericOnly(value.toString(), 10)
  }
  const updatedClient = {
    ...selectedClient,
    [name]: getValue(value),
  }
  setSelectedClient(updatedClient)
}
