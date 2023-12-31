import { AddressBaseSchema, BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { ID_DEFAULT } from '../../constants'
import { CourtCaseSchema } from '../../court_cases'
import { JudgeSchema } from '../../judges'

export interface ClientSchema extends AddressBaseSchema, StatusBaseSchema, BaseModelSchema {
  name: string
  a_number?: string
  email: string
  judge_id?: number
  // orm_mode
  judge?: JudgeSchema
  court_cases?: CourtCaseSchema[]
  // notes and history
  note_clients?: NoteClientSchema[]
  history_clients?: HistoryClientSchema[]
}

export interface ClientResponse extends ResponseBase {
  clients: ClientSchema[]
}

export interface NoteClientSchema extends NoteBaseSchema, BaseModelSchema {
  client_id: number
  // orm_mode
  client?: ClientSchema
}

export interface HistoryClientSchema extends AddressBaseSchema, BaseModelSchema {
  user_name: string
  case_collection_id: number
  // from client schema, need everything optional here so can't extend
  status?: string
  comments?: string
  name?: string
  a_number?: string
  email?: string
  judge_id?: number
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
  a_number: '',
  street_address: '',
  city: '',
  state: '',
  zip_code: '',
  phone_number: '',
  email: '',
  judge_id: ID_DEFAULT,
  status: '',
  comments: '',
}

export const DefaultClientState: ClientsState = {
  isCloseModal: true,
  clients: [],
  selectedClient: DefaultClientSchema,
}
