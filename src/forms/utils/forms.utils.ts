import { Dayjs } from 'dayjs'

import { getNumber } from '../../app'
import { FormSchema } from '../types/forms.data.types'

export const validateForm = (form: FormSchema) => {
  const errors: string[] = []

  if (form.formTypeId <= 0) {
    errors.push('Form Type is required')
  }
  if (form.courtCaseId <= 0) {
    errors.push('Case is required')
  }
  if (form.submitDate && !form.submitDate.isValid()) {
    errors.push('Submit Date is invalid')
  }
  if (form.receiptDate && !form.receiptDate.isValid()) {
    errors.push('Receipt Date is invalid')
  }
  if (form.priorityDate && !form.priorityDate.isValid()) {
    errors.push('Priority Date is invalid')
  }
  if (form.rfeDate && !form.rfeDate.isValid()) {
    errors.push('RFE Date is invalid')
  }
  if (form.rfeSubmitDate && !form.rfeSubmitDate.isValid()) {
    errors.push('RFE Submit Date is invalid')
  }
  if (form.decisionDate && !form.decisionDate.isValid()) {
    errors.push('Decision Date is invalid')
  }

  return errors.length ? errors.join(', ') : ''
}

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
  const updatedForm = {
    ...selectedForm,
    [name]: getValue(value),
  }
  setSelectedForm(updatedForm)
}
