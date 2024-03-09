import { Dayjs } from 'dayjs'
import React, { ReactElement } from 'react'

import { CaseTypeSchema, CollectionMethodSchema, FormTypeSchema, HearingTypeSchema, TaskTypeSchema } from '../../types'

export type TableOrder = 'asc' | 'desc'

export type TableRowsPerPage = 10 | 20 | 50 | 100

export type TableData = Record<string, string | number | boolean | React.JSX.Element | undefined>

export type TableHeaderData = {
  id: keyof TableData
  label: string
  isDisableSorting?: boolean
  isDisablePadding?: boolean
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
}

interface SessionStorageData {
  [key: string]: string | number
}

export interface SessionStorageItem {
  data: SessionStorageData
  expiry: number
}

export interface SpinnerState {
  isLoading: boolean
  requestCount: number
}

export interface SpinnerAction {
  type: string
  spinner: SpinnerState
}

export interface AlertState {
  messageType: string
  messageText: string | React.ReactElement
}

export interface AlertAction extends AlertState {
  type: string
  error?: string
  success?: string
}

interface RouteCore {
  path: string
  display?: string
  element: ReactElement
  icon?: ReactElement
}

interface RouteSubMenu extends RouteCore {
  subroutes: RouteCore[]
}

export interface RoutesType extends RouteCore {
  subroutes?: RouteCore[]
  submenus?: RouteSubMenu[]
}

export interface AuthState {
  isLoggedIn: boolean
  token: string
  userDetails: UserDetails
}

export interface ResponseMetadata {
  totalItems: number
  totalPages: number
  pageNumber: number
  perPage: number
}

export interface ErrorDetail {
  error: string
}

export interface LoginResponse {
  token: string
  user_details: UserDetails
  errMsg?: string
  detail?: ErrorDetail
}

export interface UserDetails {
  username: string
  firstName: string
  lastName: string
  streetAddress: string
  city: string
  state: string
  zipcode: string
  email: string
  phone: string
  status: string
}

export const DefaultUserDetails = {
  username: '',
  firstName: '',
  lastName: '',
  streetAddress: '',
  city: '',
  state: '',
  zipcode: '',
  email: '',
  phone: '',
  status: '',
}

export const DefaultErrorDetail: ErrorDetail = {
  error: '',
}

export const DefaultLoginResponse: LoginResponse = {
  token: '',
  user_details: DefaultUserDetails,
  detail: DefaultErrorDetail,
  errMsg: '',
}

// base models for all types
export interface BaseModelSchema {
  id?: number
  created?: Dayjs
  modified?: Dayjs
  isDeleted?: boolean
  deletedDate?: Dayjs
}

export interface NameDescBaseSchema {
  name: string
  description: string
}

export interface StatusBaseSchema {
  status: string
  comments?: string
}

export interface AddressBaseSchema {
  streetAddress?: string
  city?: string
  state?: string
  zipCode?: string
  phoneNumber?: string
}

export interface ResponseBase {
  deleteCount?: number
  detail?: ErrorDetail
  metadata?: ResponseMetadata
}

export interface ErrorSuccessSchema {
  error: string
  success: string
}

export type StatusSchema<T extends string> = {
  [key: string]: {
    active: T[]
    inactive: T[]
    all: T[]
  }
}

export interface StatusState {
  statuses: StatusSchema<string>
}

export interface StatusAction extends StatusState {
  type: string
}

export interface AllRefTypesSchema {
  statuses: StatusSchema<string>
  case_types: { caseTypes: CaseTypeSchema[] }
  collection_methods: { collectionMethods: CollectionMethodSchema[] }
  form_types: { formTypes: FormTypeSchema[] }
  hearing_types: { hearingTypes: HearingTypeSchema[] }
  task_types: { taskTypes: TaskTypeSchema[] }
}
