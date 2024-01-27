import { getDate, getNumber } from '../../app'
import { FormSchema } from '../types/forms.data.types'

// TODO
export const validateForm = (form: FormSchema) => {
  console.log(form)
  return true
}

export const isAreTwoFormsSame = (one: FormSchema, two: FormSchema) =>
  one &&
  two &&
  one.formTypeId === two.formTypeId &&
  one.courtCaseId === two.courtCaseId &&
  one.submitDate === two.submitDate &&
  one.receiptDate === two.receiptDate &&
  one.rfeDate === two.rfeDate &&
  one.rfeSubmitDate === two.rfeSubmitDate &&
  one.decisionDate === two.decisionDate &&
  one.taskCalendarId === two.taskCalendarId &&
  one.status === two.status &&
  one.comments === two.comments

// TODO
export const isFormFormFieldError = (name: string, value: string | number | undefined) => {
  switch (name) {
    case 'formTypeId':
    case 'courtCaseId':
      return !value || getNumber(value) <= 0
    case 'status':
      return !value || value.toString().trim() === ''
  }
  return false
}

export const handleFormDateOnChange = (name: string, value: Date | null) => {
  console.log(name, value)
}

export const handleFormFormOnChange = (
  name: string,
  value: string,
  selectedForm: FormSchema,
  setSelectedForm: (updatedForm: FormSchema) => void,
) => {
  let updatedForm = selectedForm
  switch (name) {
    case 'formTypeId':
      updatedForm = {
        ...selectedForm,
        formTypeId: getNumber(value),
      }
      break
    case 'courtCaseId':
      updatedForm = {
        ...selectedForm,
        courtCaseId: getNumber(value),
      }
      break
    case 'submitDate':
      updatedForm = {
        ...selectedForm,
        submitDate: getDate(value),
      }
      break
    case 'receiptDate':
      updatedForm = {
        ...selectedForm,
        receiptDate: getDate(value),
      }
      break
    case 'rfeDate':
      updatedForm = {
        ...selectedForm,
        rfeDate: getDate(value),
      }
      break
    case 'rfeSubmitDate':
      updatedForm = {
        ...selectedForm,
        rfeSubmitDate: getDate(value),
      }
      break
    case 'decisionDate':
      updatedForm = {
        ...selectedForm,
        decisionDate: getDate(value),
      }
      break
    case 'taskCalendarId':
      updatedForm = {
        ...selectedForm,
        taskCalendarId: getNumber(value),
      }
      break
    case 'status':
      updatedForm = {
        ...selectedForm,
        status: value,
      }
      break
    case 'comments':
      updatedForm = {
        ...selectedForm,
        comments: value.length < 8888 ? value : selectedForm.comments,
      }
      break
  }
  setSelectedForm(updatedForm)
}
