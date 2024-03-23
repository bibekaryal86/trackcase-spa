import { Dayjs } from 'dayjs'

import { AddressBaseSchema, BaseModelSchema, NameDescBaseSchema, ResponseBase } from '../../app'
import { ID_DEFAULT } from '../../constants'
import { ComponentStatusSchema } from '../../types'

export interface AppUserLoginRequest {
  username: string
  password: string
}

export interface AppUserLoginResponse extends ResponseBase {
  token: string
  appUserDetails: AppUserSchema
}

export interface AppUserRoleSchema extends BaseModelSchema {
  appUserId: number
  appRoleId: number
  email?: string
  fullName?: string
  roleName?: string
}

export interface AppUserRoleResponse extends ResponseBase {
  data: AppUserRoleSchema[]
}

export interface AppRolePermissionSchema extends BaseModelSchema {
  appRoleId: number
  appPermissionId: number
  roleName?: string
  permissionName?: string
}

export interface AppRolePermissionResponse {
  data: AppRolePermissionSchema[]
}

export interface AppUserSchema extends BaseModelSchema, AddressBaseSchema {
  email: string
  fullName: string
  componentStatusId: number
  isValidated: boolean
  lastLogin?: Dayjs
  comments?: string
  // orm
  componentStatus?: ComponentStatusSchema
  appRoles?: AppRoleSchema[]
}

export interface AppUserRequest extends AppUserSchema {
  password?: string
}

export interface AppUserResponse extends ResponseBase {
  data: AppUserSchema[]
}

export interface AppRoleSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  appUsers?: AppUserSchema[]
  appPermissions?: AppPermissionSchema[]
}

export interface AppRoleResponse extends ResponseBase {
  data: AppRoleSchema[]
}

export interface AppPermissionSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  appRoles?: AppRoleSchema[]
}

export interface AppPermissionResponse extends ResponseBase {
  data: AppPermissionSchema[]
}

export const DefaultAppUserLoginResponse: AppUserLoginResponse = {
  token: '',
  appUserDetails: {
    email: '',
    fullName: '',
    componentStatusId: ID_DEFAULT,
    isValidated: false,
  },
}

export const DefaultAppUserResponse: AppUserResponse = {
  data: [],
}

export interface AppUserFormData {
  id: number
  email: string
  fullName: string
  componentStatusId: number
  lastLogin: Dayjs | undefined
  isValidated: boolean
  isHardDelete: boolean
  isShowSoftDeleted: boolean
  isDeleted?: boolean
}

export interface AppUserFormErrorData {
  email: string
  fullName: string
  componentStatusId: string
}

export const DefaultAppUserFormData: AppUserFormData = {
  id: ID_DEFAULT,
  email: '',
  fullName: '',
  componentStatusId: ID_DEFAULT,
  lastLogin: undefined,
  isValidated: false,
  isHardDelete: false,
  isShowSoftDeleted: false,
  isDeleted: false,
}

export const DefaultAppUserFormErrorData: AppUserFormErrorData = {
  email: '',
  fullName: '',
  componentStatusId: '',
}

export interface AppRoleFormData {
  id: number
  name: string
  description: string
  isHardDelete: boolean
  isShowSoftDeleted: boolean
  isDeleted?: boolean
}

export const DefaultAppRoleFormData: AppRoleFormData = {
  id: ID_DEFAULT,
  name: '',
  description: '',
  isHardDelete: false,
  isShowSoftDeleted: false,
  isDeleted: false,
}

export interface AppPermissionFormData {
  id: number
  name: string
  description: string
  isHardDelete: boolean
  isShowSoftDeleted: boolean
  isDeleted?: boolean
}

export const DefaultAppPermissionFormData: AppPermissionFormData = {
  id: ID_DEFAULT,
  name: '',
  description: '',
  isHardDelete: false,
  isShowSoftDeleted: false,
  isDeleted: false,
}

export interface AppUserRoleFormData {
  id: number
  appUserId: number
  appRoleId: number
  isHardDelete: boolean
  isShowSoftDeleted: boolean
  isDeleted?: boolean
}

export interface AppUserRoleFormErrorData {
  appUserId: string
  appRoleId: string
}

export const DefaultAppUserRoleFormData: AppUserRoleFormData = {
  id: ID_DEFAULT,
  appUserId: ID_DEFAULT,
  appRoleId: ID_DEFAULT,
  isHardDelete: false,
  isShowSoftDeleted: false,
  isDeleted: false,
}

export const DefaultAppUserRoleFormErrorData: AppUserRoleFormErrorData = {
  appUserId: '',
  appRoleId: '',
}
