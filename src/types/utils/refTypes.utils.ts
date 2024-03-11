import { TableData, TableHeader } from '../../app'
import { REF_TYPES_REGISTRY, RefTypesRegistry } from '../../constants'
import { ComponentStatusSchema, RefTypeLessStatusSchema, RefTypeSchema } from '../types/refTypes.data.types'

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

export const refTypeTableHeader = (refType: RefTypesRegistry): TableHeader[] => {
  const tableHeaderData: TableHeader[] =
  [
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

export const refTypeTableData = (refType: RefTypesRegistry, refTypeList: RefTypeSchema[]) : TableData[] => {
  if (refType === REF_TYPES_REGISTRY.COMPONENT_STATUS) {
    const componentStatusList = refTypeList as ComponentStatusSchema[]
    return Array.from(componentStatusList, (x) => {
      return {
        nameOrComponentName: x.componentName,
        descOrStatusName: x.statusName,
        isActive: x.isActive,
        actions: 'Actions',
      }
    })
  } else {
    const otherRefTypesList = refTypeList as RefTypeLessStatusSchema[]
    return Array.from(otherRefTypesList, (x) => {
    return {
      name: x.name,
      description: x.description,
      actions: 'Actions',
    }
  })
  }
}
