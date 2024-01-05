import { getNumber, getNumericOnly, isNumericOnly, validateAddress, validateEmailAddress } from '../../app'
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
  value: string,
  selectedClient: ClientSchema,
  setSelectedClient: (updatedClient: ClientSchema) => void,
) => {
  let updatedClient = selectedClient
  switch (name) {
    case 'name':
      updatedClient = {
        ...selectedClient,
        name: value,
      }
      break
    case 'aNumber':
      updatedClient = {
        ...selectedClient,
        aNumber: getNumericOnly(value, 9),
      }
      break
    case 'email':
      updatedClient = {
        ...selectedClient,
        email: value,
      }
      break
    case 'judgeId':
      updatedClient = {
        ...selectedClient,
        judgeId: getNumber(value),
      }
      break
    case 'status':
      updatedClient = {
        ...selectedClient,
        status: value,
      }
      break
    case 'comments':
      updatedClient = {
        ...selectedClient,
        comments: value.length < 8888 ? value : selectedClient.comments,
      }
      break
    case 'streetAddress':
      updatedClient = {
        ...selectedClient,
        streetAddress: value,
      }
      break
    case 'city':
      updatedClient = {
        ...selectedClient,
        city: value,
      }
      break
    case 'state':
      updatedClient = {
        ...selectedClient,
        state: value,
      }
      break
    case 'zipCode':
      updatedClient = {
        ...selectedClient,
        zipCode: isNumericOnly(value) ? value : selectedClient.zipCode,
      }
      break
    case 'phoneNumber':
      updatedClient = {
        ...selectedClient,
        phoneNumber: getNumericOnly(value, 10),
      }
      break
  }
  setSelectedClient(updatedClient)
}
