import { AddressBaseSchema, BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { JudgeSchema } from '../../judges'

export interface CourtSchema extends AddressBaseSchema, StatusBaseSchema, BaseModelSchema {
  name: string
  dhsAddress?: string
  // orm_mode
  judges?: JudgeSchema[]
  // notes and history
  noteCourts?: NoteCourtSchema[]
  historyCourts?: HistoryCourtSchema[]
}

export interface CourtResponse extends ResponseBase {
  courts: CourtSchema[]
}

export interface NoteCourtSchema extends NoteBaseSchema, BaseModelSchema {
  courtId: number
  // orm mode
  court?: CourtSchema
}

export interface HistoryCourtSchema extends AddressBaseSchema, BaseModelSchema {
  userName: string
  courtId: number
  // from court schema, need everything optional here so can't extend
  status?: string
  comments?: string
  name?: string
  dhsAddress?: string
  // orm mode
  court?: CourtSchema
}

export interface CourtsState {
  isForceFetch: boolean
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
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  phoneNumber: '',
  dhsAddress: '',
}

export const DefaultCourtState: CourtsState = {
  isForceFetch: true,
  isCloseModal: true,
  courts: [],
  selectedCourt: DefaultCourtSchema,
}
