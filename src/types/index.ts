// components
import CaseTypes from './components/CaseTypes'
import CollectionMethods from './components/CollectionMethods'
import FormTypes from './components/FormTypes'
import HearingTypes from './components/HearingTypes'
import TaskTypes from './components/TaskTypes'
// reducers
import caseTypes from './reducers/caseTypes.reducer'
import collectionMethods from './reducers/collectionMethods.reducer'
import formTypes from './reducers/formTypes.reducer'
import hearingTypes from './reducers/hearingTypes.reducer'
import refTypes from './reducers/refTypes.reducer'
import taskTypes from './reducers/taskTypes.reducer'
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
} from './types/refTypes.data.types'

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
