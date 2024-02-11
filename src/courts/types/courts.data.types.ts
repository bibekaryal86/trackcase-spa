import { AddressBaseSchema, BaseModelSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { JudgeSchema } from '../../judges'

export interface CourtSchema extends AddressBaseSchema, StatusBaseSchema, BaseModelSchema {
  name: string
  dhsAddress?: string
  // orm_mode
  judges?: JudgeSchema[]
  // history
  historyCourts?: HistoryCourtSchema[]
}

export interface CourtResponse extends ResponseBase {
  courts: CourtSchema[]
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
  isCloseModal: true,
  courts: [],
  selectedCourt: DefaultCourtSchema,
}
