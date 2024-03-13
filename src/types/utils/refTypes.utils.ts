import React from 'react'

import { getString, TableData, TableHeaderData } from '../../app'
import { ID_DEFAULT, REF_TYPES_REGISTRY, RefTypesRegistry } from '../../constants'
import { ComponentStatusSchema, RefTypeLessStatusSchema, RefTypeSchema } from '../types/refTypes.data.types'

export interface RefTypeFormData {
  id: number
  nameOrComponentName: string
  descOrStatusName: string
  isActive: boolean
  isHardDelete: boolean
}

export const DefaultRefTypeFormData: RefTypeFormData = {
  id: ID_DEFAULT,
  nameOrComponentName: '',
  descOrStatusName: '',
  isActive: false,
  isHardDelete: false
}

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

export const validateFormData = (formData: RefTypeFormData, setFormErrors: (formErrors: RefTypeFormData) => void) => {
  let hasValidationErrors = false
  const formErrorsLocal: RefTypeFormData = { ...DefaultRefTypeFormData }
  if (!getString(formData.nameOrComponentName)) {
    hasValidationErrors = true
    formErrorsLocal.nameOrComponentName = 'Required'
  }
  if (!getString(formData.descOrStatusName)) {
    hasValidationErrors = true
    formErrorsLocal.descOrStatusName = 'Required'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const refTypeTableHeader = (refType: RefTypesRegistry): TableHeaderData[] => {
  const tableHeaderData: TableHeaderData[] = [
    {
      id: 'nameOrComponentName',
      label: refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'Component Name' : 'Name',
    },
    {
      id: 'descOrStatusName',
      label: refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'Status Name' : 'Description',
    },
  ]
  if (refType === REF_TYPES_REGISTRY.COMPONENT_STATUS) {
    tableHeaderData.push({
      id: 'isActive',
      label: 'Active Status',
    })
  }
  tableHeaderData.push({
    id: 'actions',
    label: 'Actions',
    align: 'center' as const,
    isDisableSorting: true,
  })
  return tableHeaderData
}

export const refTypeTableData = (
  refType: RefTypesRegistry,
  refTypeList: RefTypeSchema[],
  actionButtons: (formDataForModal: RefTypeFormData) => React.JSX.Element,
): TableData[] => {
  if (refType === REF_TYPES_REGISTRY.COMPONENT_STATUS) {
    const componentStatusList = refTypeList as ComponentStatusSchema[]
    return Array.from(componentStatusList, (x) => {
      return {
        nameOrComponentName: x.componentName,
        descOrStatusName: x.statusName,
        isActive: String(x.isActive).toUpperCase(),
        actions: actionButtons({
          id: x.id || ID_DEFAULT,
          nameOrComponentName: x.componentName,
          descOrStatusName: x.statusName,
          isActive: x.isActive,
          isHardDelete: false,
        }),
      }
    })
  } else {
    const otherRefTypesList = refTypeList as RefTypeLessStatusSchema[]
    return Array.from(otherRefTypesList, (x) => {
      return {
        name: x.name,
        description: x.description,
        actions: actionButtons({
          id: x.id || ID_DEFAULT,
          nameOrComponentName: x.name,
          descOrStatusName: x.description,
          isActive: true,
          isHardDelete: false,
        }),
      }
    })
  }
}
