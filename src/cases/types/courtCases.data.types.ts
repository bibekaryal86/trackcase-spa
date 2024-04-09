import { BaseModelSchema, ResponseBase } from '@app/types/app.data.types'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { HearingCalendarSchema } from '@calendars/types/calendars.data.types'
import { ClientSchema } from '@clients/types/clients.data.types'
import { CaseCollectionSchema } from '@collections/types/collections.data.types'
import { ID_DEFAULT } from '@constants/index'
import { FilingSchema } from '@filings/types/filings.data.types'
import { CaseTypeSchema, ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'

export interface CourtCaseBase {
  caseTypeId: number
  clientId: number
  componentStatusId: number
  comments?: string
}
export interface CourtCaseSchema extends CourtCaseBase, BaseModelSchema {
  // orm_mode
  caseType?: CaseTypeSchema
  client?: ClientSchema
  componentStatus?: ComponentStatusSchema
  filings?: FilingSchema[]
  caseCollections?: CaseCollectionSchema[]
  hearingCalendars?: HearingCalendarSchema[]
  // history
  historyCourtCases?: HistoryCourtCaseSchema[]
}

export interface CourtCaseResponse extends ResponseBase {
  data: CourtCaseSchema[]
}

export interface HistoryCourtCaseSchema extends Partial<CourtCaseBase>, BaseModelSchema {
  appUserId: number
  courtCaseId: number
  // orm_mode
  caseType?: CaseTypeSchema
  client?: ClientSchema
  componentStatus?: ComponentStatusSchema
}

export interface CourtCasesState {
  courtCases: CourtCaseSchema[]
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface CourtCasesAction extends CourtCasesState {
  type: string
}

export interface CourtCaseFormData extends CourtCaseSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface CourtCaseFormErrorData extends CourtCaseSchema {
  caseTypeError: string
  clientError: string
  componentStatusError: string
}

export const DefaultCourtCaseSchema: CourtCaseSchema = {
  caseTypeId: ID_DEFAULT,
  clientId: ID_DEFAULT,
  componentStatusId: ID_DEFAULT,
  comments: '',
}

export const DefaultCourtCaseState: CourtCasesState = {
  courtCases: [],
  requestMetadata: {},
}

export const DefaultCourtCaseFormData: CourtCaseFormData = {
  ...DefaultCourtCaseSchema,
  id: ID_DEFAULT,
  isHardDelete: false,
  isShowSoftDeleted: false,
}

export const DefaultCourtCaseFormErrorData: CourtCaseFormErrorData = {
  ...DefaultCourtCaseFormData,
  caseTypeError: '',
  clientError: '',
  componentStatusError: '',
}
