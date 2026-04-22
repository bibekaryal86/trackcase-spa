import { AddressBaseSchema, BaseModelSchema, ResponseBase } from '@app/types/app.data.types.ts'
import { FetchRequestMetadata } from '@app/utils/fetch.utils.ts'
import { ID_DEFAULT } from '@constants/index.ts'
import { JudgeSchema } from '@judges/types/judges.data.types.ts'
import { ComponentStatusSchema } from '@ref_types/types/refTypes.data.types.ts'
import { AppUserSchema } from '@users/types/users.data.types.ts'

export interface CourtBase extends AddressBaseSchema {
  name: string
  courtUrl: string
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

export interface HistoryCourtSchema extends Partial<CourtBase>, BaseModelSchema {
  appUserId: number
  courtId: number
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
  courtUrl: '',
  componentStatusId: ID_DEFAULT,
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  phoneNumber: '',
  dhsAddress: '',
  comments: '',
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

export const DefaultCourtState: CourtsState = {
  courts: [],
  requestMetadata: {},
}
