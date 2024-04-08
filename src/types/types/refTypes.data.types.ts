import { BaseModelSchema, FetchRequestMetadata, NameDescBaseSchema, ResponseBase } from '../../app'
import { HearingCalendarSchema, TaskCalendarSchema } from '../../calendars'
import { CourtCaseSchema } from '../../cases'
import { CashCollectionSchema } from '../../collections'
import { ID_DEFAULT, RefTypesRegistry } from '../../constants'
import { FilingSchema } from '../../filings'

export interface ComponentStatusSchema extends BaseModelSchema {
  componentName: string
  statusName: string
  isActive: boolean
  // no orm_mode for this
}

export interface ComponentStatusResponse extends ResponseBase {
  data: ComponentStatusSchema[]
}

export interface FilingTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  filings?: FilingSchema[]
}

export interface FilingTypeResponse extends ResponseBase {
  data: FilingTypeSchema[]
}

export interface CollectionMethodSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  cashCollections?: CashCollectionSchema[]
}

export interface CollectionMethodResponse extends ResponseBase {
  data: CollectionMethodSchema[]
}

export interface HearingTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  hearingCalendars?: HearingCalendarSchema[]
}

export interface HearingTypeResponse extends ResponseBase {
  data: HearingTypeSchema[]
}

export interface TaskTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  taskCalendars?: TaskCalendarSchema[]
}

export interface TaskTypeResponse extends ResponseBase {
  data: TaskTypeSchema[]
}

export interface CaseTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  courtCases?: CourtCaseSchema[]
}

export interface CaseTypeResponse extends ResponseBase {
  data: CaseTypeSchema[]
}

export interface RefTypesResponseData {
  componentStatuses: ComponentStatusResponse
  collectionMethods: CollectionMethodResponse
  caseTypes: CaseTypeResponse
  filingTypes: FilingTypeResponse
  hearingTypes: HearingTypeResponse
  taskTypes: TaskTypeResponse
}

export interface RefTypesResponse {
  data: RefTypesResponseData
}

export interface RefTypeResponse extends ResponseBase {
  data: RefTypeSchema[]
}

export type RefTypeSchema =
  | CaseTypeSchema
  | CollectionMethodSchema
  | ComponentStatusSchema
  | FilingTypeSchema
  | HearingTypeSchema
  | TaskTypeSchema

export type RefTypeLessStatusSchema =
  | CaseTypeSchema
  | CollectionMethodSchema
  | FilingTypeSchema
  | HearingTypeSchema
  | TaskTypeSchema

// states and actions
export interface RefTypesRequestMetadataState {
  refType: RefTypesRegistry
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface RefTypesState {
  componentStatus: ComponentStatusSchema[]
  filingType: FilingTypeSchema[]
  collectionMethod: CollectionMethodSchema[]
  caseType: CaseTypeSchema[]
  hearingType: HearingTypeSchema[]
  taskType: TaskTypeSchema[]
  requestMetadataState: RefTypesRequestMetadataState[]
}

export interface RefTypesAction {
  type: string
  data: RefTypeSchema[]
  metadata: RefTypesRequestMetadataState[]
}

export interface RefTypeFormData {
  id: number
  nameOrComponentName: string
  descOrStatusName: string
  isActive: boolean
  isHardDelete: boolean
  isShowSoftDeleted: boolean
  isDeleted?: boolean
}

export const DefaultRefTypeFormData: RefTypeFormData = {
  id: ID_DEFAULT,
  nameOrComponentName: '',
  descOrStatusName: '',
  isActive: false,
  isHardDelete: false,
  isShowSoftDeleted: false,
  isDeleted: false,
}

export interface RefTypesReduxStoreKeys {
  componentStatus: string
  caseType: string
  collectionMethod: string
  filingType: string
  hearingType: string
  taskType: string
}
