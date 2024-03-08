import { Dayjs } from 'dayjs'

import { LocalStorage } from './storage.utils'
import { FORCE_LOGOUT } from '../../constants'

type FetchParamObjects = { [key: string]: string | number | boolean }

interface FetchUrlOptions {
  path: string
  queryParams: FetchParamObjects
  pathParams: FetchParamObjects
  extraParams: Partial<FetchExtraOptions>
  metadataParams: Partial<FetchRequestMetadata>
}

interface SortConfig {
  column: string
  direction: 'asc' | 'desc'
}

interface FilterConfig {
  column: string
  value: string | number | Dayjs
  operation: 'eq' | 'gt' | 'lt' | 'gte' | 'lte'
}

interface FetchRequestMetadata {
  modelId: number
  sortConfig: SortConfig
  filterConfig: FilterConfig[]
  pageNumber: number
  perPage: number
  isIncludeDeleted: boolean
  isIncludeExtra: boolean
  isIncludeHistory: boolean
}

// TODO this should be removed
interface FetchExtraOptions {
  isIncludeExtra: boolean
  isIncludeHistory: boolean
}

interface FetchRequestOptions {
  method: string
  requestBody: unknown
  requestHeaders: FetchParamObjects
  noAuth: boolean
}

export interface FetchOptions extends FetchUrlOptions, FetchRequestOptions {}

export interface FetchResponse {
  data?: unknown
}

const addPathParams = (path: string, pathParams: FetchParamObjects) => {
  return Object.keys(pathParams).length === 0
    ? path
    : Object.keys(pathParams).reduce(
        (str: string, param: string) => str.replace(`{${param}}`, pathParams[param].toString()),
        path,
      )
}

const addQueryParams = (queryParams: FetchParamObjects, metadataParams: Partial<FetchRequestMetadata>) => {
  const hasNoQueryParams = Object.keys(queryParams).length === 0
  const queryString = hasNoQueryParams ? '' : getQueryString(queryParams)
  const metadataQueryString = getMetadataQueryString(hasNoQueryParams, metadataParams)
  return queryString + metadataQueryString
}

const getQueryString = (queryParams: FetchParamObjects) => {
  let queryString = '?'
  Object.entries(queryParams).forEach(([key, value]) => {
    queryString += `${key}=${value}&`
  })
  return queryString.slice(0, -1)
}

const getMetadataQueryString = (hasNoQueryParams: boolean, metadata: Partial<FetchRequestMetadata>) => {
  if (metadata && Object.keys(metadata).length) {
    const jsonString = JSON.stringify(metadata, (_, value) => {
      if (value === null || value === undefined) {
        return undefined
      }
      return value
    })
    return hasNoQueryParams ? `?metadata=${jsonString}` : `&metadata=${jsonString}`
  }
  return ''
}

const getUrl = (urlPath: string, options: Partial<FetchUrlOptions>) => {
  const { path = urlPath, queryParams = {}, pathParams = {}, metadataParams = {} } = options
  const pathWithParams = addPathParams(path, pathParams)
  const queryString = addQueryParams(queryParams, metadataParams)
  return pathWithParams + queryString
}

const getRequestInit = (options: Partial<FetchRequestOptions>) => {
  const { noAuth = true, requestHeaders = {}, method = 'GET', requestBody = {} } = options
  const token = LocalStorage.getItem('token') as string
  // this is a bug, and it should not come to this
  // it comes to this after logging out from SessionTimeout
  if (!noAuth && !token) {
    throw new Error('Auth Request But No Auth!')
  }
  const headers: HeadersInit = {}
  headers['Accept'] = 'application/json'
  headers['Content-Type'] = 'application/json'

  if (!noAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (requestHeaders) {
    Object.entries(requestHeaders).forEach(([key, value]) => {
      headers[key.toLowerCase()] = value.toString()
    })
  }

  const body = method !== 'GET' && typeof requestBody !== 'undefined' ? JSON.stringify(requestBody) : ''

  const requestInit: RequestInit = {
    method,
    //credentials: 'include',
    headers,
    mode: 'cors',
  }

  if (body) {
    requestInit.body = body
  }

  return requestInit
}

export const Async = {
  fetch: async (urlPath: string, options: Partial<FetchOptions>, retryCount: number = 1): Promise<FetchResponse> => {
    const url = getUrl(urlPath, options)
    const requestInit = getRequestInit(options)
    const response = await window.fetch(url, requestInit)

    if (response.ok) {
      LocalStorage.removeItems([FORCE_LOGOUT])
    } else {
      if (response.status === 401) {
        console.log('Error Response for 401: ', response)
        LocalStorage.setItem(FORCE_LOGOUT, true)
      } else {
        const clonedResponse = response.clone()
        const responseBody = await clonedResponse.text()
        if (
          (responseBody.includes('too many connections for role') ||
            responseBody.includes('server closed the connection unexpectedly')) &&
          retryCount <= 3
        ) {
          console.log('Retrying in 1 seconds due to CONNECTIONS... Attempt: ', retryCount)
          await new Promise((resolve) => setTimeout(resolve, 1111))
          return Async.fetch(url, requestInit, retryCount + 1)
        } else {
          console.log('Error Response non 401: ', response)
        }
      }
    }
    return response.json()
  },
}
