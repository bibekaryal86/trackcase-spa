import { SessionStorage } from '../../app'
import {
  LOGIN_SHOW_FORM_TYPE,
  LoginShowFormType,
  REGEX_LOGIN_INPUT_PATTERN,
  REGEX_LOGIN_PASSWORD_PATTERN,
} from '../../constants'
import { AppUserSchema, UserAdminRequestMetadataState } from '../types/users.data.types'

export const isLoggedIn = (): AppUserSchema | undefined => {
  const token = SessionStorage.getItem('token') as string
  const appUserDetails = SessionStorage.getItem('appUserDetails') as AppUserSchema
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
  component: string,
  action: 'create' | 'read' | 'update' | 'delete',
  appUserDetails?: AppUserSchema,
) => {
  if (isSuperuser()) {
    return true
  }
  if (!appUserDetails) {
    appUserDetails = isLoggedIn()
  }
  if (component.startsWith('/')) {
    component = component.replaceAll('/', '')
  }
  if (
    ['component_status', 'case_type', 'collection_method', 'filing_type', 'hearing_type', 'task_type'].includes(
      component,
    )
  ) {
    component = 'ref_types'
  }
  // user_management is only accessible to super-users only, not permission checked
  if (!component.endsWith('s')) {
    // this is added for single page load (court, judge, client, court_case, filing, calendar, collection)
    component = component.concat('s')
  }
  if (appUserDetails && appUserDetails.appRoles && appUserDetails.appRoles) {
    const permission = component.concat('_', action)
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

export const userAdminDispatch = ({
  type = '',
  error = '',
  success = '',
  metadata = [] as UserAdminRequestMetadataState[],
} = {}) => {
  if (error) {
    return {
      type,
      error,
    }
  } else if (success) {
    return {
      type,
      success,
    }
  } else if (metadata) {
    return {
      type,
      metadata,
    }
  } else {
    return {
      type,
    }
  }
}