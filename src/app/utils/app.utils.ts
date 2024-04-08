import dayjs, { Dayjs } from 'dayjs'
import React from 'react'

import { DATE_FORMAT, ID_DEFAULT, IS_DARK_MODE } from '@constants/index'

import { SessionStorage } from './storage.utils'
import { GlobalDispatch } from '../store/redux'
import { ErrorDetail } from '../types/app.data.types'

export const isGetDarkMode = () => (SessionStorage.getItem(IS_DARK_MODE) as string) === 'true'

export const unmountPage = (type: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch({
      type: type,
    })
  }
}

export const clearMessages = (type: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch({
      type: type,
    })
  }
}

export const getEndpoint = (endpoint: string): string => {
  const baseUrl = process.env.BASE_URL as string
  const baseUrlClean = baseUrl.replaceAll('"', '').trim()
  return baseUrlClean.concat(endpoint)
}

export const getErrMsg = (errorDetail: ErrorDetail | string): string => {
  if (typeof errorDetail === 'string') {
    return errorDetail
  } else if (errorDetail.error) {
    return errorDetail.error
  } else {
    return JSON.stringify(errorDetail)
  }
}

export const getStartOfTheMonth = (): string => {
  const year = new Date().getFullYear()
  let month = (new Date().getMonth() + 1).toString()
  if (month.length == 1) {
    month = '0' + month
  }
  return year + '-' + month + '-01'
}

export const getStartOfTheYear = (): string => new Date().getFullYear() + '-01-01'

export const getFullAddress = (streetAddress?: string, city?: string, state?: string, zipCode?: string): string =>
  streetAddress && city && state && zipCode ? `${streetAddress}, ${city}, ${state} ${zipCode}` : ''

export const getNumber = (value: number | string | null | undefined): number => (value ? Number(value) : ID_DEFAULT)

export const getString = (value: string | number | Dayjs | null | undefined): string => (value ? value.toString() : '')

export const getDayjs = (value: Dayjs | Date | null | undefined) => {
  if (value) {
    return dayjs(value)
  }
  return null
}

export const getDayjsString = (value: Dayjs | null | undefined, format: string = DATE_FORMAT) => {
  if (value) {
    return dayjs(value).format(format)
  }
  return ''
}

export const getComments = (value: string | number): string => {
  const valueString = typeof value === 'number' ? value.toString() : value
  if (valueString.length > 8888) {
    return valueString.substring(0, 8888)
  }
  return valueString
}

export const getCurrency = (
  value: string | number | null | undefined,
  isFormatted: boolean = true,
  isDefault: boolean = false,
) => {
  if (!value || Number(value) < 0) {
    value = 0
  }
  const roundedValue = Number(Math.round(Number(value + 'e2')) + 'e-2')
  if (isFormatted) {
    return roundedValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } else {
    return value === 0 && isDefault ? ID_DEFAULT.toFixed(2) : roundedValue.toFixed(2)
  }
}

export const validateAddress = (
  streetAddress: string | undefined,
  city: string | undefined,
  state: string | undefined,
  zipCode: string | undefined,
  isCheckAll: boolean,
): boolean => {
  if (isCheckAll) {
    return !!(
      streetAddress &&
      city &&
      state &&
      zipCode &&
      streetAddress.trim() &&
      city.trim() &&
      state.trim() &&
      zipCode.trim() &&
      zipCode.trim().length === 5
    )
  } else {
    const allEmpty = !streetAddress && !city && !state && !zipCode
    const allFilled = streetAddress && city && state && zipCode
    return !!(allEmpty || allFilled)
  }
}

export const validatePhoneNumber = (phoneNumber?: string): boolean =>
  !!phoneNumber && phoneNumber.trim().length === 10 && isNumericOnly(phoneNumber.trim())

export const validateEmailAddress = (email: string): boolean => !!email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/.test(email)

export const isNumericOnly = (input: string, is_allow_period: boolean = false): boolean =>
  is_allow_period ? /^\d*\.?\d*$/.test(input) : /^\d*$/.test(input)

export const getNumericOnly = (input: string, limit: number) => input.replace(/\D/g, '').slice(0, limit)

export const convertDateToLocaleString = (date?: Dayjs, isIncludeTime: boolean = false) => {
  if (date) {
    date = dayjs(date)
    const yyyy = date.year()
    const MM = String(date.month() + 1).padStart(2, '0')
    const dd = String(date.date()).padStart(2, '0')

    if (isIncludeTime) {
      const HH = String(date.hour()).padStart(2, '0')
      const mm = String(date.minute()).padStart(2, '0')
      const ss = String(date.second()).padStart(2, '0')
      return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
    }

    return `${yyyy}-${MM}-${dd}`
  }
  return ''
}

export const convertToCamelCase = (input: string, delimiter: string) =>
  input.toLowerCase().replace(new RegExp(delimiter + '(.?)', 'g'), (_, char) => char.toUpperCase())

export const convertToTitleCase = (input: string, delimiter: string) => {
  return input
    .replaceAll(delimiter, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const isValidId = (id: string | undefined): boolean => {
  if (id) {
    return getNumber(id) > 0
  }
  return false
}
