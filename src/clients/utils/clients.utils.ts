import { isNumericOnly, validateAddress } from '../../app'
import { ClientSchema } from '../types/clients.data.types'

export const validateClient = (client: ClientSchema) =>
  client.name.trim() &&
  client.status.trim() &&
  client.email.trim() &&
  client.phone_number &&
  client.phone_number.trim() &&
  (client.street_address || client.city || client.state || client.zip_code) &&
  validateAddress(client.street_address, client.city, client.state, client.zip_code)

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
        a_number: isNumericOnly(value) ? value : selectedClient.a_number,
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
        judge_id: Number(value),
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
    case 'phone':
      updatedClient = {
        ...selectedClient,
        phone_number: isNumericOnly(value) ? value : selectedClient.phone_number,
      }
      break
  }
  setSelectedClient(updatedClient)
}

export const isClientFormFieldError = (name: string, value: string, selectedClient: ClientSchema) => {
  switch (name) {
    case 'name':
    case 'aNumber':
    case 'email':
    case 'status':
    case 'comments':
    case 'phoneNumber':
      return !value || value.trim() === ''
    case 'judgeId':
      return !value || Number(value) <= 0
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
