import { LocalStorage } from '../../app'
import {
  LOGIN_SHOW_FORM_TYPE,
  LoginShowFormType,
  REGEX_LOGIN_INPUT_PATTERN,
  REGEX_LOGIN_PASSWORD_PATTERN,
} from '../../constants'
import { AppUserSchema } from '../types/users.data.types'

export const isLoggedIn = (): AppUserSchema | undefined => {
  const token = LocalStorage.getItem('token') as string
  const appUserDetails = LocalStorage.getItem('appUserDetails') as AppUserSchema
  return token ? appUserDetails : undefined
}

export const isSuperuser = (): boolean => {
  const appUserDetails = isLoggedIn()
  if (appUserDetails) {
    const appRoles = appUserDetails.appRoles || []
    return appRoles.some((appUserDetail) => appUserDetail.name === 'SUPERUSER')
  }
  return false
}

export const checkUserHasPermission = (
  component:
    | 'collections'
    | 'calendars'
    | 'filings'
    | 'court_cases'
    | 'clients'
    | 'judges'
    | 'courts'
    | 'ref_types'
    | 'component_status'
    | 'case_type'
    | 'collection_method'
    | 'filing_type'
    | 'hearing_type'
    | 'task_type',
  action: 'add' | 'view' | ' update' | 'delete',
) => {
  if (isSuperuser()) {
    return true
  }
  const appUserDetails = isLoggedIn()
  if (appUserDetails && appUserDetails.appRoles && appUserDetails.appRoles) {
    const permission = component + '_' + action
    const appPermissions = appUserDetails.appRoles.flatMap((appRole) => appRole.appPermissions)
    return appPermissions && appPermissions.some((appPermission) => appPermission?.name === permission)
  }
  return false
}

export const validatePassword = (password: string, confirmPassword: string) => password === confirmPassword

export const validateSignInUpInput = (
  username: string,
  password: string,
  fullName: string,
  showFormType: LoginShowFormType,
): boolean => {
  if (showFormType === LOGIN_SHOW_FORM_TYPE.VALIDATE || showFormType === LOGIN_SHOW_FORM_TYPE.RESET_INIT) {
    return !!(username && username.length > 6 && username.length < 49 && REGEX_LOGIN_INPUT_PATTERN.test(username))
  } else if (showFormType === LOGIN_SHOW_FORM_TYPE.SIGNIN || showFormType === LOGIN_SHOW_FORM_TYPE.RESET_EXIT) {
    return !!(
      username &&
      password &&
      username.length > 6 &&
      password.length > 6 &&
      username.length < 49 &&
      password.length < 21 &&
      REGEX_LOGIN_INPUT_PATTERN.test(username) &&
      REGEX_LOGIN_PASSWORD_PATTERN.test(password)
    )
  } else {
    return !!(
      username &&
      password &&
      fullName &&
      username.length > 6 &&
      password.length > 6 &&
      fullName.length > 6 &&
      username.length < 49 &&
      password.length < 21 &&
      fullName.length < 49 &&
      REGEX_LOGIN_INPUT_PATTERN.test(username) &&
      REGEX_LOGIN_PASSWORD_PATTERN.test(password)
    )
  }
}
