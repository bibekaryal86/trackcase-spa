import React from 'react'

import { tableAddButtonComponent } from '@app/components/CommonComponents'
import Link from '@app/components/Link'
import Table from '@app/components/Table'
import { ModalState, TableData, TableHeaderData } from '@app/types/app.data.types'
import { convertDateToLocaleString } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { CourtCaseFormData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ClientSchema } from '@clients/types/clients.data.types'
import { ACTION_TYPES, COMPONENT_STATUS_NAME, ID_DEFAULT } from '@constants/index'
import { ComponentStatusSchema, FilingTypeSchema } from '@ref_types/types/refTypes.data.types'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

import { FilingFormData, FilingSchema } from '../types/filings.data.types'
import { getFilingFormDataFromSchema } from '../utils/filings.utils'

interface FilingTableProps {
  filingsList: FilingSchema[]
  actionButtons?: (formDataForModal: FilingFormData) => React.JSX.Element
  addModalState?: ModalState
  softDeleteCallback?: (requestMetadata: Partial<FetchRequestMetadata>) => void
  selectedCourtCase?: CourtCaseSchema | CourtCaseFormData
  componentStatusList: ComponentStatusSchema[]
  filingTypesList: FilingTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  clientsList: ClientSchema[]
}

const FilingTable = (props: FilingTableProps): React.ReactElement => {
  const { filingsList, actionButtons, addModalState, softDeleteCallback } = props
  const { selectedCourtCase, componentStatusList, filingTypesList, courtCasesList, clientsList } = props

  const filingsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'type',
        label: 'FILING',
      },
      {
        id: 'client',
        label: 'CLIENT',
      },
      {
        id: 'case',
        label: 'CASE',
      },
      {
        id: 'submit',
        label: 'SUBMIT DATE',
      },
      {
        id: 'receipt',
        label: 'RECEIPT DATE',
      },
      {
        id: 'receiptNumber',
        label: 'RECEIPT NUMBER',
      },
      {
        id: 'priority',
        label: 'PRIORITY DATE',
      },
      {
        id: 'rfe',
        label: 'RFE DATE',
      },
      {
        id: 'rfeSubmit',
        label: 'RFE SUBMIT DATE',
      },
      {
        id: 'decision',
        label: 'DECISION DATE',
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
      (checkUserHasPermission(COMPONENT_STATUS_NAME.FILINGS, ACTION_TYPES.UPDATE) ||
        checkUserHasPermission(COMPONENT_STATUS_NAME.FILINGS, ACTION_TYPES.DELETE))
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

  const linkToFiling = (x: FilingSchema) => {
    let filingType = x.filingType
    if (!filingType) {
      filingType = filingTypesList?.find((y) => y.id === x.filingTypeId)
    }
    return <Link text={filingType?.name} navigateToPage={`/filing/${x.id}`} />
  }

  const linkToClient = (x: FilingSchema) => {
    let clientId = ID_DEFAULT
    let clientName = ''
    if (selectedCourtCase && selectedCourtCase.client) {
      clientId = selectedCourtCase.clientId
      clientName = selectedCourtCase.client.name
    } else {
      const courtCase = courtCasesList.find((y) => y.id === x.courtCaseId)
      if (courtCase && courtCase.client) {
        clientId = courtCase.clientId
        clientName = courtCase.client.name
      } else if (courtCase && !courtCase.client) {
        const client = clientsList.find((y) => y.id === x.courtCaseId)
        if (client) {
          clientId = courtCase.clientId
          clientName = client.name
        }
      }
    }
    if (clientName) {
      return <Link text={clientName} navigateToPage={`/client/${clientId}?backTo=${window.location.pathname}`} />
    }
    return ''
  }

  const linkToCourtCase = (x: FilingSchema) => {
    if (selectedCourtCase) {
      return selectedCourtCase?.caseType?.name
    }
    const courtCase = courtCasesList.find((y) => y.id === x.courtCaseId)
    return (
      <Link
        text={courtCase?.caseType?.name}
        navigateToPage={`/court_case/${courtCase?.id}?backTo=${window.location.pathname}`}
      />
    )
  }

  const getComponentStatus = (x: FilingSchema) => {
    if (x.componentStatus) {
      return x.componentStatus.statusName
    } else {
      const componentStatus = componentStatusList?.find((y) => y.id === x.componentStatusId)
      return componentStatus?.statusName
    }
  }

  const filingsTableData = (): TableData[] => {
    return Array.from(filingsList, (x) => {
      return {
        type: linkToFiling(x),
        client: linkToClient(x),
        case: linkToCourtCase(x),
        submit: convertDateToLocaleString(x.submitDate),
        receipt: convertDateToLocaleString(x.receiptDate),
        receiptNumber: x.receiptNumber,
        priority: convertDateToLocaleString(x.priorityDate),
        rfe: convertDateToLocaleString(x.rfeDate),
        rfeSubmit: convertDateToLocaleString(x.rfeSubmitDate),
        decision: convertDateToLocaleString(x.decisionDate),
        status: getComponentStatus(x),
        isDeleted: x.isDeleted,
        actions: actionButtons ? actionButtons(getFilingFormDataFromSchema(x)) : undefined,
      }
    })
  }

  return (
    <Table
      componentName={COMPONENT_STATUS_NAME.FILINGS}
      headerData={filingsTableHeaderData()}
      tableData={filingsTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.FILINGS, addModalState)}
      getSoftDeletedCallback={() => (softDeleteCallback ? softDeleteCallback({ isIncludeDeleted: true }) : undefined)}
    />
  )
}

export default FilingTable
