import { BaseModelSchema, NameDescBaseSchema, ResponseBase } from '../../app'
import { CaseCollectionSchema, CashCollectionSchema } from '../../cash_collections'
import { CourtCaseSchema } from '../../court_cases'
import { FormSchema } from '../../forms'
import { HearingCalendarSchema } from '../../hearing_calendars'
import { TaskCalendarSchema } from '../../task_calendars'

export interface CaseTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  court_cases?: CourtCaseSchema[]
}

export interface CaseTypeResponse extends ResponseBase {
  case_types: CaseTypeSchema[]
}

export interface CollectionMethodSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  cash_collections?: CashCollectionSchema[]
  case_collections?: CaseCollectionSchema[]
}

export interface CollectionMethodResponse extends ResponseBase {
  collection_methods: CollectionMethodSchema[]
}

export interface FormTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  forms?: FormSchema[]
}

export interface FormTypeResponse extends ResponseBase {
  form_types: FormTypeSchema[]
}

export interface HearingTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  hearing_calendars?: HearingCalendarSchema[]
}

export interface HearingTypeResponse extends ResponseBase {
  hearing_types: HearingTypeSchema[]
}

export interface TaskTypeSchema extends BaseModelSchema, NameDescBaseSchema {
  // orm_mode
  task_calendars?: TaskCalendarSchema[]
}

export interface TaskTypeResponse extends ResponseBase {
  task_types: TaskTypeSchema[]
}

// states and actions
export interface RefTypesState {
  isCloseModal: boolean
}

export interface RefTypesAction extends RefTypesState {
  type: string
}

export interface CaseTypeState {
  case_types: CaseTypeSchema[]
}

export interface CaseTypeAction extends CaseTypeState {
  type: string
}

export interface CollectionMethodState {
  collection_methods: CollectionMethodSchema[]
}

export interface CollectionMethodAction extends CollectionMethodState {
  type: string
}

export interface FormTypeState {
  form_types: FormTypeSchema[]
}

export interface FormTypeAction extends FormTypeState {
  type: string
}

export interface HearingTypeState {
  hearing_types: HearingTypeSchema[]
}

export interface HearingTypeAction extends HearingTypeState {
  type: string
}

export interface TaskTypeState {
  task_types: TaskTypeSchema[]
}

export interface TaskTypeAction extends TaskTypeState {
  type: string
}
