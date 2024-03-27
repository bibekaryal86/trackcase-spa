import { AddressBaseSchema, BaseModelSchema, FetchRequestMetadata, ResponseBase } from '../../app'
import { ID_DEFAULT } from '../../constants'
import { JudgeSchema } from '../../judges'
import { ComponentStatusSchema } from '../../types'
import { AppUserSchema } from '../../users'

export interface CourtBase extends AddressBaseSchema {
  name: string
  componentStatusId: number
  dhsAddress?: string
  comments?: string
}

export interface CourtSchema extends CourtBase, BaseModelSchema {
  // orm_mode
  componentStatus?: ComponentStatusSchema
  judges?: JudgeSchema[]
  // history
  historyCourts?: HistoryCourtSchema[]
}

export interface CourtResponse extends ResponseBase {
  data: CourtSchema[]
}

export interface HistoryCourtSchema extends AddressBaseSchema, BaseModelSchema {
  appUserId: number
  courtId: number
  // from court schema, need everything optional here so can't extend
  name?: string
  componentStatusId?: number
  dhsAddress?: string
  comments?: string
  // orm mode
  court?: CourtSchema
  appUser?: AppUserSchema
}

export interface CourtsState {
  courts: CourtSchema[]
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface CourtsAction extends CourtsState {
  type: string
}

export interface CourtFormData extends CourtSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface CourtFormErrorData extends CourtSchema {
  componentStatusError: string
}

export const DefaultCourtSchema: CourtSchema = {
  name: '',
  componentStatusId: ID_DEFAULT,
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  phoneNumber: '',
  dhsAddress: '',
  comments: '',
}

export const DefaultCourtState: CourtsState = {
  courts: [],
  requestMetadata: {},
}

export const DefaultCourtFormData: CourtFormData = {
  ...DefaultCourtSchema,
  id: ID_DEFAULT,
  isHardDelete: false,
  isShowSoftDeleted: false,
  isDeleted: false,
}

export const DefaultCourtFormErrorData: CourtFormErrorData = {
  ...DefaultCourtFormData,
  componentStatusError: '',
}
