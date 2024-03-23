import React from 'react'

import { convertDateToLocaleString, getNumber, getString, SessionStorage, TableData, TableHeaderData } from '../../app'
import {
  ID_DEFAULT,
  LOGIN_SHOW_FORM_TYPE,
  LoginShowFormType,
  REGEX_LOGIN_INPUT_PATTERN,
  REGEX_LOGIN_PASSWORD_PATTERN,
} from '../../constants'
import {
  AppPermissionFormData,
  AppPermissionSchema,
  AppRoleFormData,
  AppRolePermissionFormData,
  AppRolePermissionFormErrorData,
  AppRolePermissionSchema,
  AppRoleSchema,
  AppUserFormData,
  AppUserFormErrorData,
  AppUserRoleFormData,
  AppUserRoleFormErrorData,
  AppUserRoleSchema,
  AppUserSchema,
  DefaultAppPermissionFormData,
  DefaultAppRoleFormData,
  DefaultAppRolePermissionFormErrorData,
  DefaultAppUserFormErrorData,
  DefaultAppUserRoleFormErrorData,
} from '../types/users.data.types'

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
  componentName: string,
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
  appUserDetails?: AppUserSchema,
) => {
  if (isSuperuser()) {
    return true
  }
  if (!appUserDetails) {
    appUserDetails = isLoggedIn()
  }
  if (componentName.startsWith('/')) {
    componentName = componentName.replaceAll('/', '')
  }
  if (
    ['component_status', 'case_type', 'collection_method', 'filing_type', 'hearing_type', 'task_type'].includes(
      componentName,
    )
  ) {
    componentName = 'ref_types'
  }
  // user_management is only accessible to super-users only, not permission checked
  if (!componentName.endsWith('s')) {
    // this is added for single page load (court, judge, client, court_case, filing, calendar, collection)
    componentName = componentName.concat('s')
  }
  if (appUserDetails && appUserDetails.appRoles && appUserDetails.appRoles) {
    const permission = componentName.concat('_', action)
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

export const validateAppUser = (
  formData: AppUserFormData,
  setFormErrors: (formErrors: AppUserFormErrorData) => void,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: AppUserFormErrorData = { ...DefaultAppUserFormErrorData }
  if (!getString(formData.email)) {
    hasValidationErrors = true
    formErrorsLocal.email = 'REQUIRED'
  }
  if (!getString(formData.fullName)) {
    hasValidationErrors = true
    formErrorsLocal.fullName = 'REQUIRED'
  }
  if (getNumber(formData.componentStatusId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.componentStatusId = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const userAdminDispatch = ({ type = '', error = '', success = '' } = {}) => {
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
  } else {
    return {
      type,
    }
  }
}

export const appUsersTableHeader = (): TableHeaderData[] => {
  const tableHeaderData: TableHeaderData[] = [
    {
      id: 'email',
      label: 'EMAIL',
    },
    {
      id: 'fullName',
      label: 'NAME',
    },
    {
      id: 'status',
      label: 'STATUS',
    },
    {
      id: 'isValidated',
      label: 'IS VALIDATED?',
    },
    {
      id: 'lastLogin',
      label: 'LAST LOGIN',
    },
  ]
  if (isSuperuser()) {
    tableHeaderData.push(
      {
        id: 'isDeleted',
        label: 'IS DELETED?',
      },
      {
        id: 'actions',
        label: 'ACTIONS',
        align: 'center' as const,
      },
    )
  }
  return tableHeaderData
}

const getAppUsersFormDataForModal = (x: AppUserSchema): AppUserFormData => {
  return {
    id: x.id || ID_DEFAULT,
    email: x.email,
    fullName: x.fullName,
    componentStatusId: x.componentStatusId,
    lastLogin: x.lastLogin,
    isValidated: x.isValidated,
    isHardDelete: false,
    isShowSoftDeleted: false,
    isDeleted: x.isDeleted,
  }
}

export const appUsersTableData = (
  appUsersList: AppUserSchema[],
  actionButtons: (formDataForModal: AppUserFormData) => React.JSX.Element,
): TableData[] =>
  Array.from(appUsersList, (x) => {
    return {
      email: x.email,
      fullName: x.fullName,
      status: x.componentStatus?.statusName,
      isValidated: x.isValidated,
      lastLogin: convertDateToLocaleString(x.lastLogin),
      isDeleted: x.isDeleted,
      actions: actionButtons(getAppUsersFormDataForModal(x)),
    }
  })

export const validateAppRole = (formData: AppRoleFormData, setFormErrors: (formErrors: AppRoleFormData) => void) => {
  let hasValidationErrors = false
  const formErrorsLocal: AppRoleFormData = { ...DefaultAppRoleFormData }
  if (!getString(formData.name)) {
    hasValidationErrors = true
    formErrorsLocal.name = 'REQUIRED'
  }
  if (!getString(formData.description)) {
    hasValidationErrors = true
    formErrorsLocal.description = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const appRolesTableHeader = (): TableHeaderData[] => {
  const tableHeaderData: TableHeaderData[] = [
    {
      id: 'name',
      label: 'NAME',
    },
    {
      id: 'description',
      label: 'DESCRIPTION',
    },
  ]
  if (isSuperuser()) {
    tableHeaderData.push(
      {
        id: 'isDeleted',
        label: 'IS DELETED?',
      },
      {
        id: 'actions',
        label: 'ACTIONS',
        align: 'center' as const,
      },
    )
  }
  return tableHeaderData
}

const getAppRolesFormDataForModal = (x: AppRoleSchema): AppRoleFormData => {
  return {
    id: x.id || ID_DEFAULT,
    name: x.name,
    description: x.description,
    isHardDelete: false,
    isShowSoftDeleted: false,
    isDeleted: x.isDeleted,
  }
}

export const appRolesTableData = (
  appRolesList: AppRoleSchema[],
  actionButtons: (formDataForModal: AppRoleFormData) => React.JSX.Element,
): TableData[] =>
  Array.from(appRolesList, (x) => {
    return {
      name: x.name,
      description: x.description,
      isDeleted: x.isDeleted,
      actions: actionButtons(getAppRolesFormDataForModal(x)),
    }
  })

export const validateAppPermission = (
  formData: AppPermissionFormData,
  setFormErrors: (formErrors: AppPermissionFormData) => void,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: AppPermissionFormData = { ...DefaultAppPermissionFormData }
  if (!getString(formData.name)) {
    hasValidationErrors = true
    formErrorsLocal.name = 'REQUIRED'
  }
  if (!getString(formData.description)) {
    hasValidationErrors = true
    formErrorsLocal.description = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const appPermissionsTableHeader = (): TableHeaderData[] => {
  const tableHeaderData: TableHeaderData[] = [
    {
      id: 'name',
      label: 'NAME',
    },
    {
      id: 'description',
      label: 'DESCRIPTION',
    },
  ]
  if (isSuperuser()) {
    tableHeaderData.push(
      {
        id: 'isDeleted',
        label: 'IS DELETED?',
      },
      {
        id: 'actions',
        label: 'ACTIONS',
        align: 'center' as const,
      },
    )
  }
  return tableHeaderData
}

const getAppPermissionsFormDataForModal = (x: AppPermissionSchema): AppPermissionFormData => {
  return {
    id: x.id || ID_DEFAULT,
    name: x.name,
    description: x.description,
    isHardDelete: false,
    isShowSoftDeleted: false,
    isDeleted: x.isDeleted,
  }
}

export const appPermissionsTableData = (
  appPermissionsList: AppPermissionSchema[],
  actionButtons: (formDataForModal: AppPermissionFormData) => React.JSX.Element,
): TableData[] =>
  Array.from(appPermissionsList, (x) => {
    return {
      name: x.name,
      description: x.description,
      isDeleted: x.isDeleted,
      actions: actionButtons(getAppPermissionsFormDataForModal(x)),
    }
  })

export const validateAppUserRole = (
  formData: AppUserRoleFormData,
  setFormErrors: (formErrors: AppUserRoleFormErrorData) => void,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: AppUserRoleFormErrorData = { ...DefaultAppUserRoleFormErrorData }
  if (getNumber(formData.appUserId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.appUserId = 'REQUIRED'
  }
  if (getNumber(formData.appRoleId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.appRoleId = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const appUserRoleTableHeader = (): TableHeaderData[] => {
  const tableHeaderData: TableHeaderData[] = [
    {
      id: 'user',
      label: 'USER',
    },
    {
      id: 'email',
      label: 'EMAIL',
    },
    {
      id: 'role',
      label: 'ROLE',
    },
  ]
  if (isSuperuser()) {
    tableHeaderData.push(
      {
        id: 'isDeleted',
        label: 'IS DELETED?',
      },
      {
        id: 'actions',
        label: 'ACTIONS',
        align: 'center' as const,
      },
    )
  }
  return tableHeaderData
}

const getAppUserRoleFormDataForModal = (x: AppUserRoleSchema): AppUserRoleFormData => {
  return {
    id: x.id || ID_DEFAULT,
    appUserId: x.appUserId,
    appRoleId: x.appRoleId,
    email: getString(x.email),
    roleName: getString(x.roleName),
    isHardDelete: false,
    isShowSoftDeleted: false,
    isDeleted: x.isDeleted,
  }
}

export const appUserRoleTableData = (
  appUserRoleList: AppUserRoleSchema[],
  actionButtons: (formDataForModal: AppUserRoleFormData) => React.JSX.Element,
): TableData[] =>
  Array.from(appUserRoleList, (x) => {
    return {
      user: x.fullName,
      email: x.email,
      role: x.roleName,
      isDeleted: x.isDeleted,
      actions: actionButtons(getAppUserRoleFormDataForModal(x)),
    }
  })

export const validateAppRolePermission = (
  formData: AppRolePermissionFormData,
  setFormErrors: (formErrors: AppRolePermissionFormErrorData) => void,
) => {
  let hasValidationErrors = false
  const formErrorsLocal: AppRolePermissionFormErrorData = { ...DefaultAppRolePermissionFormErrorData }
  if (getNumber(formData.appRoleId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.appRoleId = 'REQUIRED'
  }
  if (getNumber(formData.appPermissionId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.appPermissionId = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const appRolePermissionTableHeader = (): TableHeaderData[] => {
  const tableHeaderData: TableHeaderData[] = [
    {
      id: 'role',
      label: 'ROLE',
    },
    {
      id: 'permission',
      label: 'PERMISSION',
    },
  ]
  if (isSuperuser()) {
    tableHeaderData.push(
      {
        id: 'isDeleted',
        label: 'IS DELETED?',
      },
      {
        id: 'actions',
        label: 'ACTIONS',
        align: 'center' as const,
      },
    )
  }
  return tableHeaderData
}

const getAppRolePermissionFormDataForModal = (x: AppRolePermissionSchema): AppRolePermissionFormData => {
  return {
    id: x.id || ID_DEFAULT,
    appRoleId: x.appRoleId,
    appPermissionId: x.appPermissionId,
    roleName: getString(x.roleName),
    permissionName: getString(x.permissionName),
    isHardDelete: false,
    isShowSoftDeleted: false,
    isDeleted: x.isDeleted,
  }
}

export const appRolePermissionTableData = (
  appRolePermissionList: AppRolePermissionSchema[],
  actionButtons: (formDataForModal: AppRolePermissionFormData) => React.JSX.Element,
): TableData[] =>
  Array.from(appRolePermissionList, (x) => {
    return {
      role: x.roleName,
      permission: x.permissionName,
      isDeleted: x.isDeleted,
      actions: actionButtons(getAppRolePermissionFormDataForModal(x)),
    }
  })
