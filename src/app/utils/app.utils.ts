import React from 'react'

import { LocalStorage } from './storage.utils'
import { ID_NUMBER, REGEX_LOGIN_INPUT_PATTERN } from '../../constants'
import { GlobalDispatch } from '../store/redux'
import { AuthState, ErrorDetail, NoteSchema, UserDetails } from '../types/app.data.types'

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

export const validateLoginInput = (username: string, password: string): boolean =>
  !!(
    username &&
    password &&
    username.length > 6 &&
    password.length > 6 &&
    username.length < 21 &&
    password.length < 21 &&
    REGEX_LOGIN_INPUT_PATTERN.test(username) &&
    REGEX_LOGIN_INPUT_PATTERN.test(password)
  )

export const isLoggedIn = (): AuthState | undefined => {
  const token = LocalStorage.getItem('token') as string
  const userDetails = LocalStorage.getItem('userDetails') as UserDetails
  const isLoggedIn = !!token
  if (isLoggedIn) {
    return {
      isLoggedIn,
      token,
      userDetails,
    }
  }
  return undefined
}

export const getEndpoint = (endpoint: string, isIncludeTrailingSlash: boolean = true): string => {
  const baseUrl = process.env.BASE_URL as string
  const baseUrlClean = baseUrl.replaceAll('"', '').trim()
  if (isIncludeTrailingSlash && !endpoint.endsWith('/')) {
    return baseUrlClean.concat(endpoint).concat('/')
  }
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

export const getNumber = (number: number | string | undefined) => (number ? Number(number) : ID_NUMBER)

export const getDate = (str: string | undefined) => {
  if (str) {
    const [year, month, day] = str.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return undefined
}

export const getDateString = (date: Date | undefined) => {
  if (date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return ''
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

export const validateEmailAddress = (email: string): boolean => !!email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/.test(email)

export const isNumericOnly = (input: string, is_allow_period: boolean = false): boolean =>
  is_allow_period ? /^\d*\.?\d*$/.test(input) : /^\d*$/.test(input)

export const getNumericOnly = (input: string, limit: number) => input.replace(/\D/g, '').slice(0, limit)

export const convertDateToLocaleString = (date?: Date | string) => {
  if (date) {
    if (typeof date === 'string') {
      date = new Date(date)
    }
    const yyyy = date.getUTCFullYear()
    const MM = String(date.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(date.getUTCDate()).padStart(2, '0')
    const HH = String(date.getUTCHours()).padStart(2, '0')
    const mm = String(date.getUTCMinutes()).padStart(2, '0')
    const ss = String(date.getUTCSeconds()).padStart(2, '0')
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
  }
  return ''
}

export const convertNotesToNotesList = <T>(notesInput: T[], noteObjectId: number): NoteSchema[] => {
  const notes: NoteSchema[] = JSON.parse(JSON.stringify(notesInput))
  notes.forEach((note: NoteSchema) => (note.noteObjectId = noteObjectId))
  return notes
}
