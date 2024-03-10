import { RefTypeSchema } from '../types/refTypes.data.types'

export interface RefTypesReduxStoreKeys {
  componentStatus: string
  caseType: string
  collectionMethod: string
  filingType: string
  hearingType: string
  taskType: string
}

export const refTypesDispatch = ({ type = '', error = '', success = '', data = [] as RefTypeSchema[] } = {}) => {
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
