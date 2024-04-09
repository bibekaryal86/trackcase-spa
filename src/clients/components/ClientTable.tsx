import React from 'react'

import { tableAddButtonComponent } from '@app/components/CommonComponents'
import Link from '@app/components/Link'
import Table from '@app/components/Table'
import { ModalState, TableData, TableHeaderData } from '@app/types/app.data.types'
import { getFullAddress } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ACTION_TYPES, COMPONENT_STATUS_NAME } from '@constants/index'
import { JudgeFormData, JudgeSchema } from '@judges/types/judges.data.types'
import { ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

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
        label: 'NAME',
      },
      {
        id: 'aNumber',
        label: 'A-NUMBER',
        isDisableSorting: true,
      },
      {
        id: 'email',
        label: 'EMAIL',
        isDisableSorting: true,
      },
      {
        id: 'phone',
        label: 'PHONE',
        isDisableSorting: true,
      },
      {
        id: 'address',
        label: 'ADDRESS',
        isDisableSorting: true,
      },
      {
        id: 'judge',
        label: 'JUDGE',
      },
      {
        id: 'status',
        label: 'STATUS',
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
