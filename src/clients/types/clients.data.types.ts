import { AddressBaseSchema, BaseModelSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ID_DEFAULT } from '../../constants'
import { JudgeSchema } from '../../judges'

export interface ClientSchema extends AddressBaseSchema, StatusBaseSchema, BaseModelSchema {
  name: string
  aNumber?: string
  email: string
  judgeId?: number
  // orm_mode
  judge?: JudgeSchema
  courtCases?: CourtCaseSchema[]
  // history
  historyClients?: HistoryClientSchema[]
}

export interface ClientResponse extends ResponseBase {
  clients: ClientSchema[]
}

export interface HistoryClientSchema extends AddressBaseSchema, BaseModelSchema {
  userName: string
  caseCollectionId: number
  // from client schema, need everything optional here so can't extend
  status?: string
  comments?: string
  name?: string
  aNumber?: string
  email?: string
  judgeId?: number
  // orm_mode
  client?: ClientSchema
  judge?: JudgeSchema
}

export interface ClientsState {
  isCloseModal: boolean
  clients: ClientSchema[]
  selectedClient: ClientSchema
}

export interface ClientsAction extends ClientsState {
  type: string
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
  status: '',
  comments: '',
}

export const DefaultClientState: ClientsState = {
  isCloseModal: true,
  clients: [],
  selectedClient: DefaultClientSchema,
}
