import React from 'react'

import {
  convertDateToLocaleString,
  FetchRequestMetadata,
  Link,
  ModalState,
  Table,
  tableAddButtonComponent,
  TableData,
  TableHeaderData,
} from '../../app'
import { CourtCaseFormData, CourtCaseSchema } from '../../cases'
import { ACTION_TYPES, COMPONENT_STATUS_NAME } from '../../constants'
import { ComponentStatusSchema, FilingTypeSchema } from '../../types'
import { checkUserHasPermission, isSuperuser } from '../../users'
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
}

const FilingTable = (props: FilingTableProps): React.ReactElement => {
  const { filingsList, actionButtons, addModalState, softDeleteCallback } = props
  const { selectedCourtCase, componentStatusList, filingTypesList, courtCasesList } = props

  const filingsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'type',
        label: 'Filing',
      },
      {
        id: 'client',
        label: 'CourtCase',
      },
      {
        id: 'case',
        label: 'Case',
      },
      {
        id: 'submit',
        label: 'Submit Date',
      },
      {
        id: 'receipt',
        label: 'Receipt Date',
      },
      {
        id: 'receiptNumber',
        label: 'Receipt Number',
      },
      {
        id: 'priority',
        label: 'Priority Date',
      },
      {
        id: 'rfe',
        label: 'RFE Date',
      },
      {
        id: 'rfeSubmit',
        label: 'RFE Submit Date',
      },
      {
        id: 'decision',
        label: 'Decision Date',
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
      (checkUserHasPermission(COMPONENT_STATUS_NAME.FILINGS, ACTION_TYPES.UPDATE) ||
        checkUserHasPermission(COMPONENT_STATUS_NAME.FILINGS, ACTION_TYPES.DELETE)) &&
      !selectedCourtCase
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
    let courtCase = selectedCourtCase || x.courtCase
    if (!courtCase) {
      courtCase = courtCasesList.find((y) => y.id === x.courtCaseId)
    }
    return (
      <Link
        text={courtCase?.client?.name}
        navigateToPage={`/client/${courtCase?.client?.id}?backTo=${window.location.pathname}`}
      />
    )
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
