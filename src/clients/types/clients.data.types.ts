import { AddressBaseSchema, BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CourtCaseSchema } from '../../court_cases'
import { JudgeSchema } from '../../judges'

export interface ClientSchema extends AddressBaseSchema, StatusBaseSchema, BaseModelSchema {
  name: string
  a_number?: string
  address: string
  phone: string
  email?: string
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
  address?: string
  phone?: string
  email?: string
  judge_id?: number
  // orm_mode
  client?: ClientSchema
  judge?: JudgeSchema
}
