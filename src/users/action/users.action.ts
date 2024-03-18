import React from 'react'

import {
  Async,
  FetchOptions,
  FetchResponse,
  getEndpoint,
  GlobalDispatch,
  isGetDarkMode,
  LocalStorage,
  SessionStorage,
} from '../../app'
import { USER_LOGOUT } from '../../app/types/app.action.types'
import { IS_DARK_MODE, SOMETHING_WENT_WRONG } from '../../constants'
import {
  AppUserLoginRequest,
  AppUserLoginResponse,
  AppUserResponse,
  DefaultAppUserLoginResponse,
  DefaultAppUserResponse,
} from '../types/users.data.types'

export const signup = async (username: string, password: string, fullName: string, isGuestUser?: boolean): Promise<AppUserResponse> => {
  try {
    const signupEndpoint = getEndpoint(process.env.APP_USER_CREATE as string)
    const options: Partial<FetchOptions> = {
      method: 'POST',
      noAuth: true,
      requestBody: {
        email: username,
        password: password,
        fullName: fullName,
        componentStatusId: 1,
        isValidated: false,
        isGuestUser: isGuestUser ?? false,  // ?? is nullish coalescing operator
      },
    }
    return (await Async.fetch(signupEndpoint, options)) as AppUserResponse
  } catch (error) {
    console.log('SignUp Action Error: ', error)
    return { ...DefaultAppUserResponse, detail: { error: SOMETHING_WENT_WRONG } }
  }
}

export const login = async (username: string, password: string): Promise<AppUserLoginResponse> => {
  try {
    const loginEndpoint = getEndpoint(process.env.USER_LOGIN as string)
    const loginRequest: AppUserLoginRequest = {
      username,
      password,
    }
    const options: Partial<FetchOptions> = {
      method: 'POST',
      noAuth: true,
      requestBody: loginRequest,
    }

    return (await Async.fetch(loginEndpoint, options)) as AppUserLoginResponse
  } catch (error) {
    console.log('Login Action Error: ', error)
    return { ...DefaultAppUserLoginResponse, detail: { error: SOMETHING_WENT_WRONG } }
  }
}

export const logout = () => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const isDarkMode = isGetDarkMode()
    LocalStorage.removeAllItems()
    SessionStorage.removeAllItems()
    SessionStorage.setItem(IS_DARK_MODE, String(isDarkMode))
    dispatch({
      type: USER_LOGOUT,
    })
  }
}

export const validateInit = async (username: string): Promise<FetchResponse> => {
  try {
    const validateInitEndpoint = getEndpoint(process.env.USER_VALIDATE_INIT as string)
    const options: Partial<FetchOptions> = {
      method: 'GET',
      noAuth: true,
      queryParams: {
        to_validate: username,
      },
    }
    return await Async.fetch(validateInitEndpoint, options)
  } catch (error) {
    console.log('Validate Init Action Error: ', error)
    return { detail: { error: SOMETHING_WENT_WRONG } }
  }
}

export const resetInit = async (username: string): Promise<FetchResponse> => {
  try {
    const resetInitEndpoint = getEndpoint(process.env.USER_RESET_INIT as string)
    const options: Partial<FetchOptions> = {
      method: 'GET',
      noAuth: true,
      queryParams: {
        to_reset: username,
      },
    }
    return await Async.fetch(resetInitEndpoint, options)
  } catch (error) {
    console.log('Reset Init Action Error: ', error)
    return { detail: { error: SOMETHING_WENT_WRONG } }
  }
}

export const resetExit = async (username: string, password: string): Promise<FetchResponse> => {
  try {
    const resetExitEndpoint = getEndpoint(process.env.USER_RESET_EXIT as string)
    const options: Partial<FetchOptions> = {
      method: 'POST',
      noAuth: true,
      requestBody: {
        username,
        password,
      },
    }
    return await Async.fetch(resetExitEndpoint, options)
  } catch (error) {
    console.log('Reset Exit Action Error: ', error)
    return { detail: { error: SOMETHING_WENT_WRONG } }
  }
}
