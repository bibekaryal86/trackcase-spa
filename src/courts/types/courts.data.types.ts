import { AddressBaseSchema, BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { JudgeSchema } from '../../judges'

export interface CourtSchema extends AddressBaseSchema, StatusBaseSchema, BaseModelSchema {
  name: string
  dhs_address?: string
  // orm_mode
  judges?: JudgeSchema[]
  // notes and history
  note_courts?: NoteCourtSchema[]
  history_courts?: HistoryCourtSchema[]
}

export interface CourtResponse extends ResponseBase {
  courts: CourtSchema[]
}

export interface NoteCourtSchema extends NoteBaseSchema, BaseModelSchema {
  court_id: number
  // orm mode
  court?: CourtSchema
}

export interface HistoryCourtSchema extends AddressBaseSchema, BaseModelSchema {
  user_name: string
  court_id: number
  // from court schema, need everything optional here so can't extend
  status?: string
  comments?: string
  name?: string
  dhs_address?: string
  // orm mode
  court?: CourtSchema
}

export interface CourtsState {
  isCloseModal: boolean
  courts: CourtSchema[]
  selectedCourt: CourtSchema
}

export interface CourtsAction extends CourtsState {
  type: string
}

export const DefaultCourtSchema: CourtSchema = {
  name: '',
  status: '',
  comments: '',
  street_address: '',
  city: '',
  state: '',
  zip_code: '',
  phone_number: '',
  dhs_address: '',
}

export const DefaultCourtState: CourtsState = {
  isCloseModal: true,
  courts: [],
  selectedCourt: DefaultCourtSchema,
}
