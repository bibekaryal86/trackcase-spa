import React from 'react'

import { ACTION_TYPES, COMPONENT_STATUS_NAME } from '@constants/index'

import {
  FetchRequestMetadata,
  getFullAddress,
  Link,
  ModalState,
  Table,
  tableAddButtonComponent,
  TableData,
  TableHeaderData,
} from '../../app'
import { JudgeFormData, JudgeSchema } from '../../judges'
import { ComponentStatusSchema } from '../../types'
import { checkUserHasPermission, isSuperuser } from '../../users'
import { ClientFormData, ClientSchema } from '../types/clients.data.types'
import { getClientFormDataFromSchema } from '../utils/clients.utils'

interface ClientTableProps {
  clientsList: ClientSchema[]
  actionButtons?: (formDataForModal: ClientFormData) => React.JSX.Element
  addModalState?: ModalState
  softDeleteCallback?: (requestMetadata: Partial<FetchRequestMetadata>) => void
  selectedJudge?: JudgeSchema | JudgeFormData
  componentStatusList: ComponentStatusSchema[]
}

const ClientTable = (props: ClientTableProps): React.ReactElement => {
  const { clientsList, actionButtons, addModalState, softDeleteCallback } = props
  const { selectedJudge, componentStatusList } = props

  const clientsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'aNumber',
        label: 'A-Number',
        isDisableSorting: true,
      },
      {
        id: 'email',
        label: 'Email',
        isDisableSorting: true,
      },
      {
        id: 'phone',
        label: 'Phone',
        isDisableSorting: true,
      },
      {
        id: 'address',
        label: 'Address',
        isDisableSorting: true,
      },
      {
        id: 'judge',
        label: 'Judge',
      },
      {
        id: 'status',
        label: 'Status',
      },
    ]
    if (isSuperuser()) {
      tableHeaderData.push({
        id: 'isDeleted',
        label: 'IS DELETED?',
      })
    }
    if (
      (checkUserHasPermission(COMPONENT_STATUS_NAME.CLIENTS, ACTION_TYPES.UPDATE) ||
        checkUserHasPermission(COMPONENT_STATUS_NAME.CLIENTS, ACTION_TYPES.DELETE)) &&
      !selectedJudge
    ) {
      tableHeaderData.push({
        id: 'actions',
        label: 'ACTIONS',
        isDisableSorting: true,
        align: 'center' as const,
      })
    }

    return tableHeaderData
  }

  const linkToJudge = (x?: JudgeSchema) =>
    selectedJudge ? (
      selectedJudge.name
    ) : x ? (
      <Link text={x?.name} navigateToPage={`/judge/${x?.id}?backTo=${window.location.pathname}`} />
    ) : (
      ''
    )

  const linkToClient = (x: ClientSchema) => <Link text={x.name} navigateToPage={`/client/${x.id}`} />

  const getComponentStatus = (x: ClientSchema) => {
    if (x.componentStatus) {
      return x.componentStatus.statusName
    } else {
      const componentStatus = componentStatusList.find((y) => y.id === x.componentStatusId)
      return componentStatus?.statusName
    }
  }

  const clientsTableData = (): TableData[] => {
    return Array.from(clientsList, (x) => {
      return {
        name: linkToClient(x),
        aNumber: x.aNumber,
        email: x.email,
        phone: x.phoneNumber,
        address: getFullAddress(x.streetAddress, x.city, x.state, x.zipCode),
        judge: linkToJudge(x.judge),
        status: getComponentStatus(x),
        isDeleted: x.isDeleted,
        actions: actionButtons ? actionButtons(getClientFormDataFromSchema(x)) : undefined,
      }
    })
  }

  return (
    <Table
      componentName={COMPONENT_STATUS_NAME.CLIENTS}
      headerData={clientsTableHeaderData()}
      tableData={clientsTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.CLIENTS, addModalState)}
      getSoftDeletedCallback={() => (softDeleteCallback ? softDeleteCallback({ isIncludeDeleted: true }) : undefined)}
    />
  )
}

export default ClientTable
