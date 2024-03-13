import {
  CASE_TYPE_CREATE_SUCCESS,
  CASE_TYPE_DELETE_SUCCESS,
  CASE_TYPE_RETRIEVE_SUCCESS,
  CASE_TYPE_UPDATE_SUCCESS,
  COLLECTION_METHOD_CREATE_SUCCESS,
  COLLECTION_METHOD_DELETE_SUCCESS,
  COLLECTION_METHOD_RETRIEVE_SUCCESS,
  COLLECTION_METHOD_UPDATE_SUCCESS,
  COMPONENT_STATUS_CREATE_SUCCESS,
  COMPONENT_STATUS_DELETE_SUCCESS,
  COMPONENT_STATUS_RETRIEVE_SUCCESS,
  COMPONENT_STATUS_UPDATE_SUCCESS,
  FILING_TYPE_CREATE_SUCCESS,
  FILING_TYPE_DELETE_SUCCESS,
  FILING_TYPE_RETRIEVE_SUCCESS,
  FILING_TYPE_UPDATE_SUCCESS,
  HEARING_TYPE_CREATE_SUCCESS,
  HEARING_TYPE_DELETE_SUCCESS,
  HEARING_TYPE_RETRIEVE_SUCCESS,
  HEARING_TYPE_UPDATE_SUCCESS,
  TASK_TYPE_CREATE_SUCCESS,
  TASK_TYPE_DELETE_SUCCESS,
  TASK_TYPE_RETRIEVE_SUCCESS,
  TASK_TYPE_UPDATE_SUCCESS,
} from '../types/refTypes.action.types'
import {
  CaseTypeSchema,
  CollectionMethodSchema,
  ComponentStatusSchema,
  FilingTypeSchema,
  HearingTypeSchema,
  RefTypesAction,
  RefTypesState,
  TaskTypeSchema,
} from '../types/refTypes.data.types'

const DefaultRefTypesState: RefTypesState = {
  componentStatus: [],
  filingType: [],
  collectionMethod: [],
  caseType: [],
  hearingType: [],
  taskType: [],
}

export default function refTypes(state = DefaultRefTypesState, action: RefTypesAction): RefTypesState {
  const { type } = action
  const matchesRequest = /(.*)_(REQUEST)/.exec(type)

  if (matchesRequest) {
    return state
  }

  switch (action.type) {
    case CASE_TYPE_RETRIEVE_SUCCESS:
      return {
        ...state,
        caseType: action.data as CaseTypeSchema[],
      }
    case CASE_TYPE_CREATE_SUCCESS:
    case CASE_TYPE_UPDATE_SUCCESS:
    case CASE_TYPE_DELETE_SUCCESS:
      return {
        ...state,
        caseType: [], // so that it will fetch
      }
    case COLLECTION_METHOD_RETRIEVE_SUCCESS:
      return {
        ...state,
        collectionMethod: action.data as CollectionMethodSchema[],
      }
    case COLLECTION_METHOD_CREATE_SUCCESS:
    case COLLECTION_METHOD_UPDATE_SUCCESS:
    case COLLECTION_METHOD_DELETE_SUCCESS:
      return {
        ...state,
        collectionMethod: [], // so that it will fetch
      }
    case COMPONENT_STATUS_RETRIEVE_SUCCESS:
      return {
        ...state,
        componentStatus: action.data as ComponentStatusSchema[],
      }
    case COMPONENT_STATUS_CREATE_SUCCESS:
    case COMPONENT_STATUS_UPDATE_SUCCESS:
    case COMPONENT_STATUS_DELETE_SUCCESS:
      return {
        ...state,
        componentStatus: [], // so that it will fetch
      }
    case FILING_TYPE_RETRIEVE_SUCCESS:
      return {
        ...state,
        filingType: action.data as FilingTypeSchema[],
      }
    case FILING_TYPE_CREATE_SUCCESS:
    case FILING_TYPE_UPDATE_SUCCESS:
    case FILING_TYPE_DELETE_SUCCESS:
      return {
        ...state,
        filingType: [], // so that it will fetch
      }
    case HEARING_TYPE_RETRIEVE_SUCCESS:
      return {
        ...state,
        hearingType: action.data as HearingTypeSchema[],
      }
    case HEARING_TYPE_CREATE_SUCCESS:
    case HEARING_TYPE_UPDATE_SUCCESS:
    case HEARING_TYPE_DELETE_SUCCESS:
      return {
        ...state,
        hearingType: [], // so that it will fetch
      }
    case TASK_TYPE_RETRIEVE_SUCCESS:
      return {
        ...state,
        taskType: action.data as TaskTypeSchema[],
      }
    case TASK_TYPE_CREATE_SUCCESS:
    case TASK_TYPE_UPDATE_SUCCESS:
    case TASK_TYPE_DELETE_SUCCESS:
      return {
        ...state,
        taskType: [], // so that it will fetch
      }
    default:
      return state
  }
}
