import { Dayjs } from 'dayjs'
import React, { ReactElement } from 'react'

export interface ModalState {
  showModal: boolean
  toggleModalView: () => void
}

export type TableOrder = 'asc' | 'desc'

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

export interface ResponseMetadata {
  totalItems: number
  totalPages: number
  pageNumber: number
  perPage: number
}

export interface ErrorDetail {
  error: string
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
