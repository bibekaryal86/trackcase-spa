import {
  CaseTypeSchema,
  CollectionMethodSchema,
  ComponentStatusSchema,
  FilingTypeSchema,
  HearingTypeSchema,
  TaskTypeSchema,
} from '../types/refTypes.data.types'

export interface RefTypesReduxStoreKeys {
  componentStatus: string
  caseType: string
  collectionMethod: string
  filingType: string
  hearingType: string
  taskType: string
}

export const refTypesDispatch = ({
  type = '',
  error = '',
  success = '',
  data = [] as
    | CaseTypeSchema[]
    | CollectionMethodSchema[]
    | ComponentStatusSchema[]
    | FilingTypeSchema[]
    | HearingTypeSchema[]
    | TaskTypeSchema[],
} = {}) => {
  if (error) {
    return {
      type,
      error,
    }
  } else if (success) {
    return {
      type,
      success,
    }
  } else if (data) {
    return {
      type,
      data,
    }
  } else {
    return {
      type,
    }
  }
}
