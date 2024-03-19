import React from 'react'

import {
  Async,
  FetchOptions,
  FetchResponse,
  getEndpoint,
  getErrMsg,
  GlobalDispatch,
  isGetDarkMode,
  LocalStorage,
  SessionStorage,
} from '../../app'
import { USER_LOGOUT } from '../../app/types/app.action.types'
import { ACTION_TYPES, ActionTypes, ID_DEFAULT, IS_DARK_MODE, SOMETHING_WENT_WRONG } from '../../constants'
import { APP_USERS_COMPLETE } from '../types/users.action.types'
import {
  AppUserLoginRequest,
  AppUserLoginResponse,
  AppUserRequest,
  AppUserResponse,
  DefaultAppUserLoginResponse,
  DefaultAppUserResponse,
} from '../types/users.data.types'
import { userAdminDispatch } from '../utils/users.utils'

export const signup = async (username: string, password: string, fullName: string): Promise<AppUserResponse> => {
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

export const appUsersAdmin = async (
  action: ActionTypes,
  appUserRequest?: AppUserRequest,
  id?: number,
  isRestore?: boolean,
  isHardDelete?: boolean,
) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<AppUserResponse> => {
    const typeRequest = `APP_USERS_${action}_REQUEST`
    const typeSuccess = `APP_USERS_${action}_SUCCESS`
    const typeFailure = `APP_USERS_${action}_FAILURE`

    let endpoint = ''
    let options: Partial<FetchOptions> = {}
    if (action === ACTION_TYPES.ADD) {
      endpoint = getEndpoint(process.env.APP_USER_CREATE as string)
      options = {
        method: 'POST',
        requestBody: { ...appUserRequest, isGuestUser: true },
      }
    } else if (action === ACTION_TYPES.GET) {
      endpoint = getEndpoint(process.env.APP_USER_READ as string)
      options = {
        method: 'GET',
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint = getEndpoint(process.env.APP_USER_UPDATE as string)
      options = {
        method: 'PUT',
        requestBody: appUserRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { app_user_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.APP_USER_DELETE as string)
      options = {
        method: 'DELETE',
        pathParams: { app_user_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    dispatch(userAdminDispatch({ type: typeRequest }))

    try {
      const appUserResponse = (await Async.fetch(endpoint, options)) as AppUserResponse
      if (appUserResponse.detail) {
        dispatch(userAdminDispatch({ type: typeFailure, error: getErrMsg(appUserResponse.detail) }))
      } else {
        dispatch(userAdminDispatch({ type: typeSuccess, success: `APP USER ${action} SUCCESS` }))
      }
      return appUserResponse
    } catch (error) {
      console.log(`App User ${action} Error: `, error)
      dispatch(userAdminDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [] }
    } finally {
      dispatch(userAdminDispatch({ type: APP_USERS_COMPLETE }))
    }
  }
}
