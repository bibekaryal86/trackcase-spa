import { BaseModelSchema, NameDescBaseSchema, ResponseBase } from '../../app'
import { HearingCalendarSchema, TaskCalendarSchema } from '../../calendars'
import { CourtCaseSchema } from '../../cases'
import { CashCollectionSchema } from '../../collections'
import { FormSchema } from '../../forms'

export interface ComponentStatusSchema extends BaseModelSchema {
  componentName: string
  statusName: string
  isActive: boolean
  // no orm_mode for this
}

export interface ComponentStatusResponse extends ResponseBase {
  componentStatuses: ComponentStatusSchema[]
}

export interface CaseTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  courtCases?: CourtCaseSchema[]
}

export interface CaseTypeResponse extends ResponseBase {
  caseTypes: CaseTypeSchema[]
}

export interface CollectionMethodSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  cashCollections?: CashCollectionSchema[]
}

export interface CollectionMethodResponse extends ResponseBase {
  collectionMethods: CollectionMethodSchema[]
}

export interface FormTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  forms?: FormSchema[]
}

export interface FormTypeResponse extends ResponseBase {
  formTypes: FormTypeSchema[]
}

export interface HearingTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  hearingCalendars?: HearingCalendarSchema[]
}

export interface HearingTypeResponse extends ResponseBase {
  hearingTypes: HearingTypeSchema[]
}

export interface TaskTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  taskCalendars?: TaskCalendarSchema[]
}

export interface TaskTypeResponse extends ResponseBase {
  taskTypes: TaskTypeSchema[]
}

// states and actions
export interface RefTypesState {
  isCloseModal: boolean
}

export interface RefTypesAction extends RefTypesState {
  type: string
}

export interface CaseTypeState {
  caseTypes: CaseTypeSchema[]
}

export interface CaseTypeAction extends CaseTypeState {
  type: string
}

export interface CollectionMethodState {
  collectionMethods: CollectionMethodSchema[]
}

export interface CollectionMethodAction extends CollectionMethodState {
  type: string
}

export interface FormTypeState {
  formTypes: FormTypeSchema[]
}

export interface FormTypeAction extends FormTypeState {
  type: string
}

export interface HearingTypeState {
  hearingTypes: HearingTypeSchema[]
}

export interface HearingTypeAction extends HearingTypeState {
  type: string
}

export interface TaskTypeState {
  taskTypes: TaskTypeSchema[]
}

export interface TaskTypeAction extends TaskTypeState {
  type: string
}
