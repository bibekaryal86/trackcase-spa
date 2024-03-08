import React from 'react'

import {
  Async,
  FetchOptions,
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
  AppUserRequest,
  AppUserResponse,
  DefaultAppUserLoginResponse,
  DefaultAppUserResponse,
} from '../types/users.data.types'

export const signup = async (appUserRequest: AppUserRequest): Promise<AppUserResponse> => {
  try {
    const signupEndpoint = getEndpoint(process.env.APP_USER_CREATE as string)
    const options: Partial<FetchOptions> = {
      method: 'POST',
      noAuth: true,
      requestBody: appUserRequest,
    }

    return (await Async.fetch(signupEndpoint, options)) as AppUserResponse
  } catch (error) {
    console.log('Login Action Error: ', error)
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
