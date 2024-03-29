import dayjs, { Dayjs } from 'dayjs'

import { getDayjs, getNumber } from '../../app'
import { FormSchema } from '../types/forms.data.types'

export const validateForm = (form: FormSchema) => {
  const errors: string[] = []

  if (getNumber(form.formTypeId) <= 0) {
    errors.push('Form Type is required!')
  }
  if (getNumber(form.courtCaseId) <= 0) {
    errors.push('Case is required!')
  }
  if (!form.status.trim()) {
    errors.push('Status is required!')
  }
  const submitDate = getDayjs(form.submitDate)
  if (submitDate) {
    if (!submitDate.isValid() || submitDate.isBefore(dayjs(), 'day')) {
      errors.push('Submit Date is invalid or in the past!')
    }
  }
  const receiptDate = getDayjs(form.receiptDate)
  if (receiptDate) {
    if (!receiptDate.isValid() || receiptDate.isBefore(dayjs(), 'day')) {
      errors.push('Receipt Date is invalid or in the past!')
    }
    if (!submitDate || receiptDate.isBefore(submitDate, 'day')) {
      errors.push('Submit Date is invalid or is after Receipt Date!')
    }
  }
  const priorityDate = getDayjs(form.priorityDate)
  if (priorityDate) {
    if (!priorityDate.isValid() || priorityDate.isBefore(dayjs(), 'day')) {
      errors.push('Priority Date is invalid or in the past!')
    }
    if (!submitDate || priorityDate.isBefore(receiptDate, 'day')) {
      errors.push('Receipt Date is invalid or is after Priority Date!')
    }
  }
  const rfeDate = getDayjs(form.rfeDate)
  if (rfeDate) {
    if (!rfeDate.isValid() || rfeDate.isBefore(dayjs(), 'day')) {
      errors.push('RFE Date is invalid or in the past!')
    }
    if (!priorityDate || priorityDate.isBefore(rfeDate, 'day')) {
      errors.push('Priority Date is invalid or is after RFE Date!')
    }
  }
  const rfeSubmitDate = getDayjs(form.rfeSubmitDate)
  if (rfeSubmitDate) {
    if (!rfeSubmitDate.isValid() || rfeSubmitDate.isBefore(dayjs(), 'day')) {
      errors.push('RFE Submit Date is invalid or in the past!')
    }
    if (!rfeDate || rfeSubmitDate.isBefore(rfeDate, 'day')) {
      errors.push('RFE Date is invalid or is after RFE Submit Date!')
    }
  }
  const decisionDate = getDayjs(form.decisionDate)
  if (decisionDate) {
    if (!decisionDate.isValid() || decisionDate.isBefore(dayjs(), 'day')) {
      errors.push('Decision Date is invalid or in the past!')
    }
    if (!priorityDate) {
      if (!rfeSubmitDate) {
        errors.push('Priority Date or RFE Submit Date is required for Decision Date!')
      } else if (rfeSubmitDate.isBefore(decisionDate)) {
        errors.push('RFE Submit Date is after Decision Date!')
      }
    } else if (priorityDate.isBefore(decisionDate)) {
      errors.push('Priority Date is after Decision Date!')
    }
  }
  if (submitDate && ['OPEN', 'PROCESSING', 'PENDING'].includes(form.status)) {
    errors.push('Invalid Status for submitted form!')
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
  one.status === two.status &&
  one.comments === two.comments

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
