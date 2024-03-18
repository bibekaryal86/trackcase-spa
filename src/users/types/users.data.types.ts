import { Dayjs } from 'dayjs'

import { AddressBaseSchema, FetchRequestMetadata, NameDescBaseSchema, ResponseBase } from '../../app'
import { ID_DEFAULT, UserAdminRegistry } from '../../constants'
import { ComponentStatusSchema } from '../../types'

export interface AppUserLoginRequest {
  username: string
  password: string
}

export interface AppUserLoginResponse extends ResponseBase {
  token: string
  appUserDetails: AppUserSchema
}

export interface AppUserRoleSchema {
  appUserId: number
  appRoleId: number
}

export interface AppUserRoleResponse {
  data: AppUserRoleSchema[]
}

export interface AppRolePermissionSchema {
  appRoleId: number
  appPermissionId: number
}

export interface AppRolePermissionResponse {
  data: AppRolePermissionSchema[]
}

export interface AppUserSchema extends AddressBaseSchema {
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
  isGuestUser?: boolean
}

export interface AppUserResponse extends ResponseBase {
  data: AppUserSchema[]
}

export interface AppRoleSchema extends NameDescBaseSchema {
  // orm_mode
  appUsers?: AppUserSchema[]
  appPermissions?: AppPermissionSchema[]
}

export interface AppRoleResponse extends ResponseBase {
  data: AppRoleSchema[]
}

export interface AppPermissionSchema extends NameDescBaseSchema {
  // orm_mode
  appRoles?: AppRoleSchema[]
}

export interface AppPermissionResponse extends ResponseBase {
  data: AppPermissionSchema[]
}

// states and actions
// users is not stored in redux, metadata only
export interface UserAdminRequestMetadataState {
  userAdminTab: UserAdminRegistry
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface UserAdminState {
  requestMetadataState: UserAdminRequestMetadataState[]
}

export interface UserAdminAction {
  type: string
  metadata: UserAdminRequestMetadataState[]
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
