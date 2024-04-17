import React from 'react'

import { tableAddButtonComponent } from '@app/components/CommonComponents'
import Link from '@app/components/Link'
import Table from '@app/components/Table'
import { ModalState, TableData, TableHeaderData } from '@app/types/app.data.types'
import { convertDateToLocaleString, getDayjsString } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { CourtCaseFormData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ClientSchema } from '@clients/types/clients.data.types'
import { ACTION_TYPES, COMPONENT_STATUS_NAME, FILING_TYPES, ID_DEFAULT } from '@constants/index'
import { ComponentStatusSchema, FilingTypeSchema } from '@ref_types/types/refTypes.data.types'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

import { FilingFormData, FilingRfeFormData, FilingRfeSchema, FilingSchema } from '../types/filings.data.types'
import { getFilingFormDataFromSchema, getFilingRfeFormDataFromSchema } from '../utils/filings.utils'

interface FilingTableProps {
  filingsList: FilingSchema[]
  actionButtons?: (formDataForModal: FilingFormData) => React.JSX.Element
  actionButtonsRfe?: (formDataForModal: FilingRfeFormData) => React.JSX.Element
  addModalState?: ModalState
  addModalStateRfe?: ModalState
  softDeleteCallback?: (requestMetadata: Partial<FetchRequestMetadata>) => void
  selectedCourtCase?: CourtCaseFormData
  componentStatusList: ComponentStatusSchema[]
  filingTypesList: FilingTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  clientsList: ClientSchema[]
  addFilingRfeButtonCallback: (filingId: number) => void
}

const FilingTable = (props: FilingTableProps): React.ReactElement => {
  const {
    filingsList,
    actionButtons,
    actionButtonsRfe,
    addModalState,
    addModalStateRfe,
    softDeleteCallback,
    addFilingRfeButtonCallback,
  } = props
  const { selectedCourtCase, componentStatusList, filingTypesList, courtCasesList, clientsList } = props

  const filingsTableHeaderData = (isRfe: boolean): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = []

    if (isRfe) {
      tableHeaderData.push(
        {
          id: 'rfeDate',
          label: 'RFE DATE',
        },
        {
          id: 'rfeSubmitDate',
          label: 'RFE SUBMIT DATE',
        },
        {
          id: 'rfeReason',
          label: 'RFE REASON',
        },
      )
    } else {
      tableHeaderData.push(
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
          id: 'decision',
          label: 'DECISION DATE',
        },
        {
          id: 'status',
          label: 'STATUS',
        },
      )
    }

    if (isSuperuser()) {
      tableHeaderData.push({
        id: 'isDeleted',
        label: 'IS DELETED?',
      })
    }
    if (
      checkUserHasPermission(COMPONENT_STATUS_NAME.FILINGS, ACTION_TYPES.UPDATE) ||
      checkUserHasPermission(COMPONENT_STATUS_NAME.FILINGS, ACTION_TYPES.DELETE)
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

  const filingsTableDataCommon = (x: FilingSchema | FilingRfeSchema, isRfe: boolean) => {
    if (isRfe) {
      const y = x as FilingRfeSchema
      return {
        rfeDate: getDayjsString(y.rfeDate),
        rfeSubmitDate: getDayjsString(y.rfeSubmitDate),
        rfeReason: y.rfeReason,
      }
    } else {
      const y = x as FilingSchema
      return {
        type: linkToFiling(y),
        client: linkToClient(y),
        case: linkToCourtCase(y),
        submit: convertDateToLocaleString(y.submitDate),
        receipt: convertDateToLocaleString(y.receiptDate),
        receiptNumber: y.receiptNumber,
        priority: convertDateToLocaleString(y.priorityDate),
        decision: convertDateToLocaleString(y.decisionDate),
        status: getComponentStatus(y),
      }
    }
  }

  const getFilingRfesTable = (x: FilingSchema) => {
    const filingRfesList = x.filingRfes || []
    if (filingRfesList.length === 0) {
      return undefined
    }

    const filingRfesHeaderData = filingsTableHeaderData(true)
    const filingRfesTableData = Array.from(filingRfesList, (y: FilingRfeSchema) => {
      return {
        ...filingsTableDataCommon(y, true),
        isDeleted: y.isDeleted,
        actions: actionButtonsRfe ? actionButtonsRfe(getFilingRfeFormDataFromSchema(y)) : undefined,
      }
    })

    const addButtonExtraCallback = () => addFilingRfeButtonCallback(x.id || ID_DEFAULT)

    return (
      <Table
        componentName={FILING_TYPES.FILING_RFE}
        headerData={filingRfesHeaderData}
        tableData={filingRfesTableData}
        addModelComponent={tableAddButtonComponent(
          COMPONENT_STATUS_NAME.FILINGS,
          FILING_TYPES.FILING_RFE,
          addModalStateRfe,
          addButtonExtraCallback,
        )}
        defaultDense
        isDisablePagination
      />
    )
  }

  const filingsTableData = (): TableData[] => {
    return Array.from(filingsList, (x: FilingSchema) => {
      return {
        ...filingsTableDataCommon(x, false),
        filingRfes: getFilingRfesTable(x),
        isDeleted: x.isDeleted,
        actions: actionButtons ? actionButtons(getFilingFormDataFromSchema(x)) : undefined,
      }
    })
  }

  return (
    <Table
      componentName={COMPONENT_STATUS_NAME.FILINGS}
      headerData={filingsTableHeaderData(false)}
      tableData={filingsTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.FILINGS, FILING_TYPES.FILING, addModalState)}
      getSoftDeletedCallback={() => (softDeleteCallback ? softDeleteCallback({ isIncludeDeleted: true }) : undefined)}
    />
  )
}

export default FilingTable
