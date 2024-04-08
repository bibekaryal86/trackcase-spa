import { AddressBaseSchema, BaseModelSchema, FetchRequestMetadata, ResponseBase } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ID_DEFAULT } from '../../constants'
import { JudgeSchema } from '../../judges'
import { ComponentStatusSchema } from '../../types'

export interface ClientBase {
  name: string
  aNumber?: string
  email: string
  judgeId?: number
  componentStatusId: number
  comments?: string
}
export interface ClientSchema extends ClientBase, AddressBaseSchema, BaseModelSchema {
  // orm_mode
  judge?: JudgeSchema
  componentStatus?: ComponentStatusSchema
  courtCases?: CourtCaseSchema[]
  // history
  historyClients?: HistoryClientSchema[]
}

export interface ClientResponse extends ResponseBase {
  data: ClientSchema[]
}

export interface HistoryClientSchema extends Partial<ClientBase>, AddressBaseSchema, BaseModelSchema {
  userId: string
  caseCollectionId: number
  // orm_mode
  client?: ClientSchema
  judge?: JudgeSchema
  componentStatus?: ComponentStatusSchema
}

export interface ClientsState {
  clients: ClientSchema[]
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface ClientsAction extends ClientsState {
  type: string
}

export interface ClientFormData extends ClientSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface ClientFormErrorData extends ClientSchema {
  judgeError: string
  componentStatusError: string
}

export const DefaultClientSchema: ClientSchema = {
  name: '',
  aNumber: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  phoneNumber: '',
  email: '',
  judgeId: ID_DEFAULT,
  componentStatusId: ID_DEFAULT,
  comments: '',
}

export const DefaultClientState: ClientsState = {
  clients: [],
  requestMetadata: {},
}

export const DefaultClientFormData: ClientFormData = {
  ...DefaultClientSchema,
  id: ID_DEFAULT,
  isHardDelete: false,
  isShowSoftDeleted: false,
}

export const DefaultClientFormErrorData: ClientFormErrorData = {
  ...DefaultClientFormData,
  judgeError: '',
  componentStatusError: '',
}
