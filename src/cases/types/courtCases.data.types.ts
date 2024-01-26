import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { HearingCalendarSchema, TaskCalendarSchema } from '../../calendars'
import { ClientSchema } from '../../clients'
import { CaseCollectionSchema, CashCollectionSchema } from '../../collections'
import { ID_DEFAULT } from '../../constants'
import { FormSchema } from '../../forms'
import { CaseTypeSchema } from '../../types'

export interface CourtCaseSchema extends StatusBaseSchema, BaseModelSchema {
  caseTypeId: number
  clientId: number
  // orm_mode
  caseType?: CaseTypeSchema
  client?: ClientSchema
  forms?: FormSchema[]
  cashCollections?: CashCollectionSchema[]
  caseCollections?: CaseCollectionSchema[]
  hearingCalendars?: HearingCalendarSchema[]
  taskCalendars?: TaskCalendarSchema[]
  // notes and history
  noteCourtCases?: NoteCourtCaseSchema[]
  historyCourtCases?: HistoryCourtCaseSchema[]
}

export interface CourtCaseResponse extends ResponseBase {
  courtCases: CourtCaseSchema[]
}

export interface NoteCourtCaseSchema extends NoteBaseSchema, BaseModelSchema {
  courtCaseId: number
  // orm_mode
  courtCase?: CourtCaseSchema
}

export interface HistoryCourtCaseSchema extends BaseModelSchema {
  userName: string
  courtCaseId: number
  // from court case schema, need everything optional here so can't extend
  status?: string
  comments?: string
  caseTypeId?: number
  clientId?: number
  // orm_mode
  caseType?: CaseTypeSchema
  client?: ClientSchema
}

export interface CourtCasesState {
  isForceFetch: boolean
  isCloseModal: boolean
  courtCases: CourtCaseSchema[]
  selectedCourtCase: CourtCaseSchema
}

export interface CourtCasesAction extends CourtCasesState {
  type: string
}

export const DefaultCourtCaseSchema: CourtCaseSchema = {
  caseTypeId: ID_DEFAULT,
  clientId: ID_DEFAULT,
  status: '',
  comments: '',
}

export const DefaultCourtCaseState: CourtCasesState = {
  isForceFetch: true,
  isCloseModal: true,
  courtCases: [],
  selectedCourtCase: DefaultCourtCaseSchema,
}
