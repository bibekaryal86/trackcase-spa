import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { CaseCollectionSchema, CashCollectionSchema } from '../../cash_collections'
import { ClientSchema } from '../../clients'
import { ID_DEFAULT } from '../../constants'
import { FormSchema } from '../../forms'
import { HearingCalendarSchema } from '../../hearing_calendars'
import { CaseTypeSchema } from '../../ref_types'
import { TaskCalendarSchema } from '../../task_calendars'

export interface CourtCaseSchema extends StatusBaseSchema, BaseModelSchema {
  case_type_id: number
  client_id: number
  // orm_mode
  case_type?: CaseTypeSchema
  client?: ClientSchema
  forms?: FormSchema[]
  cash_collections?: CashCollectionSchema[]
  case_collections?: CaseCollectionSchema[]
  hearing_calendars?: HearingCalendarSchema[]
  task_calendars?: TaskCalendarSchema[]
  // notes and history
  note_court_cases?: NoteCourtCaseSchema[]
  history_court_cases?: HistoryCourtCaseSchema[]
}

export interface CourtCaseResponse extends ResponseBase {
  court_cases: CourtCaseSchema[]
}

export interface NoteCourtCaseSchema extends NoteBaseSchema, BaseModelSchema {
  court_case_id: number
  // orm_mode
  court_case?: CourtCaseSchema
}

export interface HistoryCourtCaseSchema extends BaseModelSchema {
  user_name: string
  court_case_id: number
  // from court case schema, need everything optional here so can't extend
  status?: string
  comments?: string
  case_type_id?: number
  client_id?: number
  // orm_mode
  case_type?: CaseTypeSchema
  client?: ClientSchema
}

export interface CourtCasesState {
  isCloseModal: boolean
  courtCases: CourtCaseSchema[]
  selectedCourtCase: CourtCaseSchema
}

export interface CourtCasesAction extends CourtCasesState {
  type: string
}

export const DefaultCourtCaseSchema: CourtCaseSchema = {
  case_type_id: ID_DEFAULT,
  client_id: ID_DEFAULT,
  status: '',
  comments: '',
}

export const DefaultCourtCaseState: CourtCasesState = {
  isCloseModal: true,
  courtCases: [],
  selectedCourtCase: DefaultCourtCaseSchema,
}
