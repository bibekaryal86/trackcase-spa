import { getNumber, getNumericOnly, isNumericOnly, validateAddress, validateEmailAddress } from '../../app'
import { ClientSchema } from '../types/clients.data.types'

export const validateClient = (client: ClientSchema) => {
  const nameValid = !!client.name.trim()
  const phoneValid = !!client.phone_number?.trim()
  const emailValid = !!client.email.trim() && validateEmailAddress(client.email)
  const addressValid = validateAddress(client.street_address, client.city, client.state, client.zip_code, false)
  return nameValid && phoneValid && emailValid && addressValid
}

export const isAreTwoClientsSame = (one: ClientSchema, two: ClientSchema) =>
  one &&
  two &&
  one.name === two.name &&
  one.a_number === two.a_number &&
  one.email === two.email &&
  one.judge_id === two.judge_id &&
  one.status === two.status &&
  one.comments === two.comments &&
  one.street_address === two.street_address &&
  one.city === two.city &&
  one.state === two.state &&
  one.zip_code === two.zip_code &&
  one.phone_number === two.phone_number

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
        return !(
          selectedClient.street_address &&
          selectedClient.city &&
          selectedClient.state &&
          selectedClient.zip_code
        )
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
        a_number: getNumericOnly(value, 9),
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
        judge_id: getNumber(value),
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
        street_address: value,
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
        zip_code: isNumericOnly(value) ? value : selectedClient.zip_code,
      }
      break
    case 'phoneNumber':
      updatedClient = {
        ...selectedClient,
        phone_number: getNumericOnly(value, 10),
      }
      break
  }
  setSelectedClient(updatedClient)
}
