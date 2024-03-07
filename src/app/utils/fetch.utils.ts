import { LocalStorage } from './storage.utils'
import { FORCE_LOGOUT } from '../../constants'

type FetchParamObjects = { [key: string]: string | number | boolean }

interface FetchUrlOptions {
  path: string
  queryParams: FetchParamObjects
  pathParams: FetchParamObjects
  extraParams: Partial<FetchExtraOptions>
}

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

const addQueryParams = (queryParams: FetchParamObjects, extraParams: Partial<FetchExtraOptions>) => {
  const hasNoQueryParams = Object.keys(queryParams).length === 0
  const queryString = hasNoQueryParams ? '' : getQueryString(queryParams)
  const extraQueryString = getExtraQueryString(hasNoQueryParams, extraParams)
  return queryString + extraQueryString
}

const getQueryString = (queryParams: FetchParamObjects) => {
  let queryString = '?'
  Object.entries(queryParams).forEach(([key, value]) => {
    queryString += `${key}=${value}&`
  })
  return queryString.slice(0, -1)
}

const getExtraQueryString = (hasNoQueryParams: boolean, extraParams: Partial<FetchExtraOptions>) => {
  if (extraParams && (extraParams.isIncludeExtra || extraParams.isIncludeHistory)) {
    let extraQueryString = hasNoQueryParams ? '?' : '&'
    if (extraParams.isIncludeExtra) {
      extraQueryString += 'is_include_extra=true&'
    }
    if (extraParams.isIncludeHistory) {
      extraQueryString += 'is_include_history=true&'
    }
    return extraQueryString.slice(0, -1)
  }
  return ''
}

const getUrl = ({ path = '', queryParams = {}, pathParams = {}, extraParams = {} }: Partial<FetchUrlOptions>) => {
  const pathWithParams = addPathParams(path, pathParams)
  const queryString = addQueryParams(queryParams, extraParams)
  return pathWithParams + queryString
}

const getHeaders = (
  withAuth: boolean,
  requestHeaders: FetchParamObjects,
  token: string,
) => {
  const headers: HeadersInit = {}
  headers['Accept'] = 'application/json'
  headers['Content-Type'] = 'application/json'

  if (withAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (requestHeaders) {
    Object.entries(requestHeaders).forEach(([key, value]) => {
      headers[key.toLowerCase()] = value.toString()
    })
  }

  return headers
}

const getBody = (method: string, body: unknown) =>
  method !== 'GET' && typeof body !== 'undefined' ? JSON.stringify(body) : ''

export const Async = {
  fetch: async (urlPath: string, options: Partial<FetchOptions>, retryCount: number = 1): Promise<FetchResponse> => {
    const {
      queryParams,
      pathParams,
      extraParams,
      method = 'GET',
      requestBody = {},
      requestHeaders = {},
      noAuth = false,
    } = options

    const token = LocalStorage.getItem('token') as string

    // this is a bug, and it should not come to this
    // it comes to this after logging out from SessionTimeout
    if (!noAuth && !token) {
      throw new Error('Auth Request But No Auth!')
    }

    const url = getUrl({ path: urlPath, queryParams, pathParams, extraParams })
    const headers = getHeaders(!noAuth, requestHeaders, token)
    const body = getBody(method, requestBody)

    const requestInit: RequestInit = {
      method,
      //credentials: 'include',
      headers,
      mode: 'cors',
    }

    if (body) {
      requestInit.body = body
    }

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
