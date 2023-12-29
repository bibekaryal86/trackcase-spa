// components
import CaseTypes from './components/CaseTypes'
import CollectionMethods from './components/CollectionMethods'
import FormTypes from './components/FormTypes'
import HearingTypes from './components/HearingTypes'
import TaskTypes from './components/TaskTypes'
// reducers
import caseTypes from './reducers/case_types.reducer'
import collectionMethods from './reducers/collection_methods.reducer'
import formTypes from './reducers/form_types.reducer'
import hearingTypes from './reducers/hearing_types.reducer'
import refTypes from './reducers/ref_types.reducer'
import taskTypes from './reducers/task_types.reducer'
// types
import {
  CaseTypeResponse,
  CaseTypeSchema,
  CaseTypeState,
  CollectionMethodAction,
  CollectionMethodResponse,
  CollectionMethodSchema,
  CollectionMethodState,
  FormTypeResponse,
  FormTypeSchema,
  FormTypeState,
  HearingTypeResponse,
  HearingTypeSchema,
  HearingTypeState,
  RefTypesState,
  TaskTypeResponse,
  TaskTypeSchema,
  TaskTypeState,
} from './types/ref_types.data.types'

export { CaseTypes, CollectionMethods, FormTypes, HearingTypes, TaskTypes }
export { caseTypes, collectionMethods, formTypes, hearingTypes, refTypes, taskTypes }
export type {
  CaseTypeSchema,
  CaseTypeResponse,
  CaseTypeState,
  CollectionMethodSchema,
  CollectionMethodResponse,
  CollectionMethodState,
  CollectionMethodAction,
  FormTypeSchema,
  FormTypeResponse,
  FormTypeState,
  HearingTypeSchema,
  HearingTypeResponse,
  HearingTypeState,
  RefTypesState,
  TaskTypeSchema,
  TaskTypeResponse,
  TaskTypeState,
}
