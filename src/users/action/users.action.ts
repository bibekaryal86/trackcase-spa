import React from 'react'

import {
  Async,
  FetchOptions,
  FetchRequestMetadata,
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
import {
  APP_PERMISSIONS_COMPLETE,
  APP_ROLES_COMPLETE,
  APP_USERS_COMPLETE,
  APP_USERS_ROLES_COMPLETE,
} from '../types/users.action.types'
import {
  AppPermissionResponse,
  AppPermissionSchema,
  AppRoleResponse,
  AppRoleSchema,
  AppUserLoginRequest,
  AppUserLoginResponse,
  AppUserRequest,
  AppUserResponse,
  AppUserRoleResponse,
  AppUserRoleSchema,
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

export const getAppUsers = async (
  dispatch: React.Dispatch<GlobalDispatch>,
  requestMetadata?: Partial<FetchRequestMetadata>,
) => {
  const dispatchFunction = await appUsersAdmin({ action: ACTION_TYPES.READ, requestMetadata: requestMetadata })
  return await dispatchFunction(dispatch)
}

function createGuestPassword() {
  const length = 9
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const appUsersAdmin = async ({
  action,
  appUserRequest,
  id,
  isRestore,
  isHardDelete,
  requestMetadata,
}: {
  action: ActionTypes
  appUserRequest?: AppUserRequest
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
  requestMetadata?: Partial<FetchRequestMetadata>
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<AppUserResponse> => {
    const typeRequest = `APP_USERS_${action}_REQUEST`
    const typeSuccess = `APP_USERS_${action}_SUCCESS`
    const typeFailure = `APP_USERS_${action}_FAILURE`

    let endpoint = ''
    let options: Partial<FetchOptions> = {}
    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.APP_USER_CREATE as string)
      options = {
        method: 'POST',
        // send as validatedTrue, but with random password so that guests must reset before logging in
        requestBody: { ...appUserRequest, isGuestUser: true, isValidated: true, password: createGuestPassword() },
      }
    } else if (action === ACTION_TYPES.READ) {
      endpoint = getEndpoint(process.env.APP_USER_READ as string)
      options = {
        method: 'GET',
        metadataParams: requestMetadata,
      }
    } else if (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.RESTORE) {
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
        action !== ACTION_TYPES.READ &&
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

export const getAppRoles = async (
  dispatch: React.Dispatch<GlobalDispatch>,
  requestMetadata?: Partial<FetchRequestMetadata>,
) => {
  const dispatchFunction = await appRolesAdmin({ action: ACTION_TYPES.READ, requestMetadata: requestMetadata })
  return await dispatchFunction(dispatch)
}

export const appRolesAdmin = async ({
  action,
  appRoleRequest,
  id,
  isRestore,
  isHardDelete,
  requestMetadata,
}: {
  action: ActionTypes
  appRoleRequest?: AppRoleSchema
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
  requestMetadata?: Partial<FetchRequestMetadata>
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<AppRoleResponse> => {
    const typeRequest = `APP_ROLES_${action}_REQUEST`
    const typeSuccess = `APP_ROLES_${action}_SUCCESS`
    const typeFailure = `APP_ROLES_${action}_FAILURE`

    let endpoint = ''
    let options: Partial<FetchOptions> = {}
    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.APP_ROLE_CREATE as string)
      options = {
        method: 'POST',
        // send as validatedTrue, but with random password so that guests must reset before logging in
        requestBody: { name: appRoleRequest?.name, description: appRoleRequest?.description },
      }
    } else if (action === ACTION_TYPES.READ) {
      endpoint = getEndpoint(process.env.APP_ROLE_READ as string)
      options = {
        method: 'GET',
        metadataParams: requestMetadata,
      }
    } else if (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.RESTORE) {
      endpoint = getEndpoint(process.env.APP_ROLE_UPDATE as string)
      options = {
        method: 'PUT',
        requestBody: { name: appRoleRequest?.name, description: appRoleRequest?.description },
        queryParams: { is_restore: isRestore || false },
        pathParams: { app_role_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.APP_ROLE_DELETE as string)
      options = {
        method: 'DELETE',
        pathParams: { app_role_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    dispatch(userAdminDispatch({ type: typeRequest }))

    try {
      const appRoleResponse = (await Async.fetch(endpoint, options)) as AppRoleResponse
      if (appRoleResponse.detail) {
        dispatch(userAdminDispatch({ type: typeFailure, error: getErrMsg(appRoleResponse.detail) }))
      } else {
        action !== ACTION_TYPES.READ &&
          dispatch(userAdminDispatch({ type: typeSuccess, success: `APP ROLE ${action} SUCCESS` }))
      }
      return appRoleResponse
    } catch (error) {
      console.log(`App Role ${action} Error: `, error)
      dispatch(userAdminDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [] }
    } finally {
      dispatch(userAdminDispatch({ type: APP_ROLES_COMPLETE }))
    }
  }
}

export const getAppPermissions = async (
  dispatch: React.Dispatch<GlobalDispatch>,
  requestMetadata?: Partial<FetchRequestMetadata>,
) => {
  const dispatchFunction = await appPermissionsAdmin({ action: ACTION_TYPES.READ, requestMetadata: requestMetadata })
  return await dispatchFunction(dispatch)
}

export const appPermissionsAdmin = async ({
  action,
  appPermissionRequest,
  id,
  isRestore,
  isHardDelete,
  requestMetadata,
}: {
  action: ActionTypes
  appPermissionRequest?: AppPermissionSchema
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
  requestMetadata?: Partial<FetchRequestMetadata>
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<AppPermissionResponse> => {
    const typeRequest = `APP_PERMISSIONS_${action}_REQUEST`
    const typeSuccess = `APP_PERMISSIONS_${action}_SUCCESS`
    const typeFailure = `APP_PERMISSIONS_${action}_FAILURE`

    let endpoint = ''
    let options: Partial<FetchOptions> = {}
    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.APP_PERMISSION_CREATE as string)
      options = {
        method: 'POST',
        // send as validatedTrue, but with random password so that guests must reset before logging in
        requestBody: { name: appPermissionRequest?.name, description: appPermissionRequest?.description },
      }
    } else if (action === ACTION_TYPES.READ) {
      endpoint = getEndpoint(process.env.APP_PERMISSION_READ as string)
      options = {
        method: 'GET',
        metadataParams: requestMetadata,
      }
    } else if (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.RESTORE) {
      endpoint = getEndpoint(process.env.APP_PERMISSION_UPDATE as string)
      options = {
        method: 'PUT',
        requestBody: { name: appPermissionRequest?.name, description: appPermissionRequest?.description },
        queryParams: { is_restore: isRestore || false },
        pathParams: { app_role_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.APP_PERMISSION_DELETE as string)
      options = {
        method: 'DELETE',
        pathParams: { app_role_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    dispatch(userAdminDispatch({ type: typeRequest }))

    try {
      const appPermissionResponse = (await Async.fetch(endpoint, options)) as AppPermissionResponse
      if (appPermissionResponse.detail) {
        dispatch(userAdminDispatch({ type: typeFailure, error: getErrMsg(appPermissionResponse.detail) }))
      } else {
        action !== ACTION_TYPES.READ &&
          dispatch(userAdminDispatch({ type: typeSuccess, success: `APP PERMISSION ${action} SUCCESS` }))
      }
      return appPermissionResponse
    } catch (error) {
      console.log(`App Permission ${action} Error: `, error)
      dispatch(userAdminDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [] }
    } finally {
      dispatch(userAdminDispatch({ type: APP_PERMISSIONS_COMPLETE }))
    }
  }
}

export const getAppUsersRoles = async (
  dispatch: React.Dispatch<GlobalDispatch>,
  requestMetadata?: Partial<FetchRequestMetadata>,
) => {
  const dispatchFunction = await appUsersRolesAdmin({ action: ACTION_TYPES.READ, requestMetadata: requestMetadata })
  return await dispatchFunction(dispatch)
}

export const appUsersRolesAdmin = async ({
  action,
  appUserRoleRequest,
  id,
  isRestore,
  isHardDelete,
  requestMetadata,
}: {
  action: ActionTypes
  appUserRoleRequest?: AppUserRoleSchema
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
  requestMetadata?: Partial<FetchRequestMetadata>
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<AppUserRoleResponse> => {
    const typeRequest = `APP_USERS_ROLES_${action}_REQUEST`
    const typeSuccess = `APP_USERS_ROLES_${action}_SUCCESS`
    const typeFailure = `APP_USERS_ROLES_${action}_FAILURE`

    let endpoint = ''
    let options: Partial<FetchOptions> = {}
    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.APP_USER_ROLE_CREATE as string)
      options = {
        method: 'POST',
        // send as validatedTrue, but with random password so that guests must reset before logging in
        requestBody: { appUserId: appUserRoleRequest?.appUserId, appRoleId: appUserRoleRequest?.appRoleId },
      }
    } else if (action === ACTION_TYPES.READ) {
      endpoint = getEndpoint(process.env.APP_USER_ROLE_READ as string)
      options = {
        method: 'GET',
        metadataParams: requestMetadata,
      }
    } else if (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.RESTORE) {
      endpoint = getEndpoint(process.env.APP_USER_ROLE_UPDATE as string)
      options = {
        method: 'PUT',
        requestBody: { appUserId: appUserRoleRequest?.appUserId, appRoleId: appUserRoleRequest?.appRoleId },
        queryParams: { is_restore: isRestore || false },
        pathParams: { app_user_role_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.APP_USER_ROLE_DELETE as string)
      options = {
        method: 'DELETE',
        pathParams: { app_user_role_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    dispatch(userAdminDispatch({ type: typeRequest }))

    try {
      const appUserRoleResponse = (await Async.fetch(endpoint, options)) as AppUserRoleResponse
      if (appUserRoleResponse.detail) {
        dispatch(userAdminDispatch({ type: typeFailure, error: getErrMsg(appUserRoleResponse.detail) }))
      } else {
        action !== ACTION_TYPES.READ &&
          dispatch(userAdminDispatch({ type: typeSuccess, success: `APP USER ROLE ${action} SUCCESS` }))
      }
      return appUserRoleResponse
    } catch (error) {
      console.log(`App User Role ${action} Error: `, error)
      dispatch(userAdminDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [] }
    } finally {
      dispatch(userAdminDispatch({ type: APP_USERS_ROLES_COMPLETE }))
    }
  }
}
