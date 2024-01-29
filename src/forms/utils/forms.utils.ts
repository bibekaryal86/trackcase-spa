import { Dayjs } from 'dayjs'

import { getComments, getNumber } from '../../app'
import { FormSchema } from '../types/forms.data.types'

export const validateForm = (form: FormSchema) =>
  form.formTypeId &&
  form.courtCaseId &&
  (form.submitDate ? form.submitDate.isValid() : true) &&
  (form.receiptDate ? form.receiptDate.isValid() : true) &&
  (form.priorityDate ? form.priorityDate.isValid() : true) &&
  (form.rfeDate ? form.rfeDate.isValid() : true) &&
  (form.rfeSubmitDate ? form.rfeSubmitDate.isValid() : true) &&
  (form.decisionDate ? form.decisionDate.isValid() : true)

export const isAreTwoFormsSame = (one: FormSchema, two: FormSchema) =>
  one &&
  two &&
  one.formTypeId === two.formTypeId &&
  one.courtCaseId === two.courtCaseId &&
  one.submitDate === two.submitDate &&
  one.receiptDate === two.receiptDate &&
  one.receiptNumber === two.receiptNumber &&
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

export const handleFormDateOnChange = (
  name: string,
  value: Dayjs | null,
  selectedForm: FormSchema,
  setSelectedForm: (updatedForm: FormSchema) => void,
) => {
  const updatedForm = {
    ...selectedForm,
    [name]: value,
  }
  setSelectedForm(updatedForm)
}

export const handleFormFormOnChange = (
  name: string,
  value: string | number,
  selectedForm: FormSchema,
  setSelectedForm: (updatedForm: FormSchema) => void,
  getValue: (value: string | number) => string | number,
) => {
  if (name === 'comments' && typeof value === 'string') {
    value = getComments(value)
  }
  const updatedForm = {
    ...selectedForm,
    [name]: getValue(value),
  }
  setSelectedForm(updatedForm)
}
