import React from 'react'

import { tableAddButtonComponent } from '@app/components/CommonComponents'
import Link from '@app/components/Link'
import Table from '@app/components/Table'
import { ModalState, TableData, TableHeaderData } from '@app/types/app.data.types'
import { getDayjsString } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ClientFormData, ClientSchema } from '@clients/types/clients.data.types'
import { ACTION_TYPES, COMPONENT_STATUS_NAME } from '@constants/index'
import { CaseTypeSchema, ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

import { CourtCaseFormData, CourtCaseSchema } from '../types/courtCases.data.types'
import { getCourtCaseFormDataFromSchema } from '../utils/courtCases.utils'

interface CourtCaseTableProps {
  courtCasesList: CourtCaseSchema[]
  actionButtons?: (formDataForModal: CourtCaseFormData) => React.JSX.Element
  addModalState?: ModalState
  softDeleteCallback?: (requestMetadata: Partial<FetchRequestMetadata>) => void
  selectedClient?: ClientSchema | ClientFormData
  componentStatusList: ComponentStatusSchema[]
  caseTypesList: CaseTypeSchema[]
}

const CourtCaseTable = (props: CourtCaseTableProps): React.ReactElement => {
  const { courtCasesList, actionButtons, addModalState, softDeleteCallback } = props
  const { selectedClient, componentStatusList, caseTypesList } = props

  const courtCasesTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'clientCaseType',
        label: 'CASE',
      },
      {
        id: 'client',
        label: 'CLIENT',
      },
      {
        id: 'status',
        label: 'STATUS',
      },
      {
        id: 'created',
        label: 'CREATED',
      },
    ]
    if (isSuperuser()) {
      tableHeaderData.push({
        id: 'isDeleted',
        label: 'IS DELETED?',
      })
    }
    if (
      (checkUserHasPermission(COMPONENT_STATUS_NAME.COURT_CASES, ACTION_TYPES.UPDATE) ||
        checkUserHasPermission(COMPONENT_STATUS_NAME.COURT_CASES, ACTION_TYPES.DELETE)) &&
      !selectedClient
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

  const linkToCourtCase = (x: CourtCaseSchema) => {
    let caseType = x.caseType
    if (!caseType) {
      caseType = caseTypesList.find((y) => y.id === x.caseTypeId)
    }
    return <Link text={caseType?.name} navigateToPage={`/court_case/${x.id}`} />
  }

  const linkToClient = (x: CourtCaseSchema) =>
    selectedClient ? (
      selectedClient.name
    ) : (
      <Link text={x.client?.name} navigateToPage={`/client/${x.clientId}?backTo=${window.location.pathname}`} />
    )

  const getComponentStatus = (x: CourtCaseSchema) => {
    if (x.componentStatus) {
      return x.componentStatus.statusName
    } else {
      const componentStatus = componentStatusList.find((y) => y.id === x.componentStatusId)
      return componentStatus?.statusName
    }
  }

  const courtCasesTableData = (): TableData[] => {
    return Array.from(courtCasesList, (x) => {
      return {
        clientCaseType: linkToCourtCase(x),
        client: linkToClient(x),
        status: getComponentStatus(x),
        created: getDayjsString(x.created),
        isDeleted: x.isDeleted,
        actions: actionButtons ? actionButtons(getCourtCaseFormDataFromSchema(x)) : undefined,
      }
    })
  }

  return (
    <Table
      componentName={COMPONENT_STATUS_NAME.COURT_CASES}
      headerData={courtCasesTableHeaderData()}
      tableData={courtCasesTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.COURT_CASES, addModalState)}
      getSoftDeletedCallback={() => (softDeleteCallback ? softDeleteCallback({ isIncludeDeleted: true }) : undefined)}
    />
  )
}

export default CourtCaseTable
