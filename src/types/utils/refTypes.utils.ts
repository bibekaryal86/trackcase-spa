import React from 'react'

import { TableData, TableHeaderData } from '@app/types/app.data.types'
import { getString } from '@app/utils/app.utils'
import { ACTION_TYPES, COMPONENT_STATUS_NAME, ID_DEFAULT, REF_TYPES_REGISTRY, RefTypesRegistry } from '@constants/index'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

import {
  ComponentStatusSchema,
  DefaultRefTypeFormData,
  RefTypeFormData,
  RefTypeLessStatusSchema,
  RefTypeSchema,
  RefTypesRequestMetadataState,
} from '../types/refTypes.data.types'

export const refTypesDispatch = ({
  type = '',
  error = '',
  success = '',
  data = [] as RefTypeSchema[],
  metadata = [] as RefTypesRequestMetadataState[],
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
      metadata,
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
    formErrorsLocal.nameOrComponentName = 'REQUIRED'
  }
  if (!getString(formData.descOrStatusName)) {
    hasValidationErrors = true
    formErrorsLocal.descOrStatusName = 'REQUIRED'
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
      label: refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'COMPONENT NAME' : 'NAME',
    },
    {
      id: 'descOrStatusName',
      label: refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'STATUS NAME' : 'DESCRIPTION',
    },
  ]
  if (refType === REF_TYPES_REGISTRY.COMPONENT_STATUS) {
    tableHeaderData.push({
      id: 'isActive',
      label: 'ACTIVE STATUS',
    })
  }
  if (isSuperuser()) {
    tableHeaderData.push({
      id: 'isDeleted',
      label: 'IS DELETED?',
    })
  }
  if (
    checkUserHasPermission(COMPONENT_STATUS_NAME.REF_TYPES, ACTION_TYPES.UPDATE) ||
    checkUserHasPermission(COMPONENT_STATUS_NAME.REF_TYPES, ACTION_TYPES.DELETE)
  ) {
    tableHeaderData.push({
      id: 'actions',
      label: 'ACTIONS',
      align: 'center' as const,
    })
  }
  return tableHeaderData
}

const getFormDataForModal = (x: RefTypeSchema) => {
  if ('componentName' in x) {
    return {
      id: x.id || ID_DEFAULT,
      nameOrComponentName: x.componentName,
      descOrStatusName: x.statusName,
      isActive: true,
      isHardDelete: false,
      isShowSoftDeleted: false,
      isDeleted: x.isDeleted,
    }
  } else {
    return {
      id: x.id || ID_DEFAULT,
      nameOrComponentName: x.name,
      descOrStatusName: x.description,
      isActive: true,
      isHardDelete: false,
      isShowSoftDeleted: false,
      isDeleted: x.isDeleted,
    }
  }
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
        isDeleted: String(x.isDeleted || false).toUpperCase(),
        actions: actionButtons(getFormDataForModal(x)),
      }
    })
  } else {
    const otherRefTypesList = refTypeList as RefTypeLessStatusSchema[]
    return Array.from(otherRefTypesList, (x) => {
      return {
        nameOrComponentName: x.name,
        descOrStatusName: x.description,
        isDeleted: String(x.isDeleted || false).toUpperCase(),
        actions: actionButtons(getFormDataForModal(x)),
      }
    })
  }
}
