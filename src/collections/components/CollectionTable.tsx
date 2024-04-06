import React from 'react'

import {
  FetchRequestMetadata,
  getCurrency,
  getDayjsString,
  Link,
  ModalState,
  Table,
  tableAddButtonComponent,
  TableData,
  TableHeaderData,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ClientSchema } from '../../clients'
import { ACTION_TYPES, COMPONENT_STATUS_NAME } from '../../constants'
import { CollectionMethodSchema, ComponentStatusSchema } from '../../types'
import { checkUserHasPermission } from '../../users'
import {
  CaseCollectionFormData,
  CaseCollectionSchema,
  CashCollectionFormData,
  CashCollectionSchema,
} from '../types/collections.data.types'
import { getCollectionFormDataFromSchema } from '../utils/collections.utils'

interface CollectionTableProps {
  caseCollectionsList: CaseCollectionSchema[]
  actionButtons?: (formDataForModal: CaseCollectionFormData | CashCollectionFormData) => React.JSX.Element
  addModalState?: ModalState
  softDeleteCallback?: (requestMetadata: Partial<FetchRequestMetadata>) => void
  componentStatusList: ComponentStatusSchema[]
  collectionMethodsList: CollectionMethodSchema[]
  courtCasesList: CourtCaseSchema[]
  clientsList: ClientSchema[]
  selectedCourtCase?: CourtCaseSchema
  isAddModelComponent: boolean
}

const CollectionTable = (props: CollectionTableProps): React.ReactElement => {
  const { caseCollectionsList, actionButtons, addModalState, softDeleteCallback } = props
  const { componentStatusList, collectionMethodsList, courtCasesList, clientsList, selectedCourtCase } = props

  const collectionsTableHeaderData = (isCashCollection: boolean): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = []

    if (isCashCollection) {
      tableHeaderData.push(
        {
          id: 'collectionDate',
          label: 'Collection Date',
        },
        {
          id: 'collectedAmount',
          label: 'Collection Amount',
        },
        {
          id: 'waivedAmount',
          label: 'Waived Amount',
        },
        {
          id: 'collectionMethod',
          label: 'Collection Method',
        },
        {
          id: 'collectionMemo',
          label: 'Collection Memo',
        },
      )
    } else {
      tableHeaderData.push(
        {
          id: 'client',
          label: 'Client',
        },
        {
          id: 'case',
          label: 'Case',
        },
        {
          id: 'quoteAmount',
          label: 'Amount',
        },
        {
          id: 'status',
          label: 'Status',
        },
      )
    }

    if (
      (checkUserHasPermission(COMPONENT_STATUS_NAME.COLLECTIONS, ACTION_TYPES.UPDATE) ||
        checkUserHasPermission(COMPONENT_STATUS_NAME.COLLECTIONS, ACTION_TYPES.DELETE)) &&
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

  const linkToClient = (x: CaseCollectionSchema) => {
    let client
    if (selectedCourtCase) {
      client = clientsList.find((y) => y.id === selectedCourtCase.clientId)
    } else {
      client = clientsList.find((y) => y.id === x.courtCase?.clientId)
    }
    return <Link text={client?.name} navigateToPage={`/client/${client?.id}?backTo=${window.location.pathname}`} />
  }

  const linkToCase = (x: CaseCollectionSchema) => {
    if (selectedCourtCase) {
      return `${selectedCourtCase.client?.name}, ${selectedCourtCase.caseType?.name}`
    }
    const courtCase = courtCasesList.find((y) => y.id === x.courtCaseId)
    return (
      <Link
        text={courtCase?.caseType?.name}
        navigateToPage={`/court_case/${courtCase?.id}?backTo=${window.location.pathname}`}
      />
    )
  }

  const collectionMethodName = (x: CashCollectionSchema) => {
    const collectionMethod = collectionMethodsList.find((y) => y.id === x.collectionMethodId)
    return collectionMethod?.name
  }

  const getComponentStatus = (x: CaseCollectionSchema) => {
    if (x.componentStatus) {
      return x.componentStatus.statusName
    } else {
      const componentStatus = componentStatusList?.find((y) => y.id === x.componentStatusId)
      return componentStatus?.statusName
    }
  }

  const collectionsTableDataCommon = (x: CaseCollectionSchema | CashCollectionSchema, isCashCollection: boolean) => {
    if (isCashCollection) {
      const y = x as CashCollectionSchema
      return {
        collectionDate: getDayjsString(y.collectionDate),
        collectedAmount: getCurrency(y.collectedAmount),
        waivedAmount: getCurrency(y.waivedAmount),
        collectionMethod: collectionMethodName(y),
        collectionMemo: y.memo,
      }
    } else {
      const y = x as CaseCollectionSchema
      return {
        client: linkToClient(y),
        case: linkToCase(y),
        quoteAmount: getCurrency(y.quoteAmount),
        status: getComponentStatus(y),
      }
    }
  }

  const getCashCollectionsTable = (x: CaseCollectionSchema) => {
    const cashCollectionsList = x.cashCollections || []
    const cashCollectionsHeaderData = collectionsTableHeaderData(true)
    const cashCollectionsTableData = Array.from(cashCollectionsList, (y: CashCollectionSchema) => {
      return {
        ...collectionsTableDataCommon(y, true),
        actions: actionButtons ? actionButtons(getCollectionFormDataFromSchema(x)) : undefined,
      }
    })

    return (
      <Table
        componentName="CASH COLLECTIONS"
        headerData={cashCollectionsHeaderData}
        tableData={cashCollectionsTableData}
        addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.COLLECTIONS, addModalState)}
        defaultDense={true}
        isDisablePagination={true}
      />
    )
  }

  const collectionsTableData = (): TableData[] => {
    return Array.from(caseCollectionsList, (x: CaseCollectionSchema) => {
      return {
        ...collectionsTableDataCommon(x, false),
        cashCollections: getCashCollectionsTable(x),
        actions: actionButtons ? actionButtons(getCollectionFormDataFromSchema(x)) : undefined,
      }
    })
  }

  return (
    <Table
      componentName="CASE COLLECTIONS"
      headerData={collectionsTableHeaderData(false)}
      tableData={collectionsTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.COLLECTIONS, addModalState)}
      getSoftDeletedCallback={() => (softDeleteCallback ? softDeleteCallback({ isIncludeDeleted: true }) : undefined)}
    />
  )
}

export default CollectionTable
