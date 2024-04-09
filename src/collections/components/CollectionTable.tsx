import React from 'react'

import { tableAddButtonComponent } from '@app/components/CommonComponents'
import Link from '@app/components/Link'
import Table from '@app/components/Table'
import { ModalState, TableData, TableHeaderData } from '@app/types/app.data.types'
import { getCurrency, getDayjsString } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ClientSchema } from '@clients/types/clients.data.types'
import { ACTION_TYPES, COLLECTION_TYPES, COMPONENT_STATUS_NAME, ID_DEFAULT } from '@constants/index'
import { CollectionMethodSchema, ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'
import { checkUserHasPermission } from '@users/utils/users.utils'

import {
  CaseCollectionFormData,
  CaseCollectionSchema,
  CashCollectionFormData,
  CashCollectionSchema,
} from '../types/collections.data.types'
import { getCaseCollectionFormDataFromSchema, getCashCollectionFormDataFromSchema } from '../utils/collections.utils'

interface CollectionTableProps {
  caseCollectionsList: CaseCollectionSchema[]
  actionButtonsCase?: (formDataForModal: CaseCollectionFormData) => React.JSX.Element
  actionButtonsCash?: (formDataModal: CashCollectionFormData) => React.JSX.Element
  addModalStateCase?: ModalState
  addModalStateCash?: ModalState
  softDeleteCallback?: (requestMetadata: Partial<FetchRequestMetadata>) => void
  componentStatusList: ComponentStatusSchema[]
  collectionMethodsList: CollectionMethodSchema[]
  courtCasesList: CourtCaseSchema[]
  clientsList: ClientSchema[]
  selectedCourtCase?: CourtCaseSchema
  addCashCollectionButtonCallback: (caseCollectionId: number) => void
}

const CollectionTable = (props: CollectionTableProps): React.ReactElement => {
  const {
    caseCollectionsList,
    actionButtonsCase,
    actionButtonsCash,
    addModalStateCase,
    addModalStateCash,
    softDeleteCallback,
    addCashCollectionButtonCallback,
  } = props
  const { componentStatusList, collectionMethodsList, courtCasesList, clientsList, selectedCourtCase } = props

  const collectionsTableHeaderData = (isCashCollection: boolean): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = []

    if (isCashCollection) {
      tableHeaderData.push(
        {
          id: 'collectionDate',
          label: 'COLLECTION DATE',
        },
        {
          id: 'collectedAmount',
          label: 'COLLECTION AMOUNT',
        },
        {
          id: 'waivedAmount',
          label: 'WAIVED AMOUNT',
        },
        {
          id: 'collectionMethod',
          label: 'COLLECTION METHOD',
        },
        {
          id: 'collectionMemo',
          label: 'COLLECTION MEMO',
        },
      )
    } else {
      tableHeaderData.push(
        {
          id: 'client',
          label: 'CLIENT',
        },
        {
          id: 'case',
          label: 'CASE',
        },
        {
          id: 'quoteAmount',
          label: 'AMOUNT',
        },
        {
          id: 'status',
          label: 'STATUS',
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
        actions: actionButtonsCash ? actionButtonsCash(getCashCollectionFormDataFromSchema(y)) : undefined,
      }
    })

    const addButtonExtraCallback = () => addCashCollectionButtonCallback(x.id || ID_DEFAULT)

    return (
      <Table
        componentName={COLLECTION_TYPES.CASH_COLLECTION.replace('_', ' ')}
        headerData={cashCollectionsHeaderData}
        tableData={cashCollectionsTableData}
        addModelComponent={tableAddButtonComponent(
          COMPONENT_STATUS_NAME.COLLECTIONS,
          addModalStateCash,
          addButtonExtraCallback,
        )}
        defaultDense
        isDisablePagination
      />
    )
  }

  const collectionsTableData = (): TableData[] => {
    return Array.from(caseCollectionsList, (x: CaseCollectionSchema) => {
      return {
        ...collectionsTableDataCommon(x, false),
        cashCollections: getCashCollectionsTable(x),
        actions: actionButtonsCase ? actionButtonsCase(getCaseCollectionFormDataFromSchema(x)) : undefined,
      }
    })
  }

  return (
    <Table
      componentName={COLLECTION_TYPES.CASE_COLLECTION.replace('_', ' ')}
      headerData={collectionsTableHeaderData(false)}
      tableData={collectionsTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.COLLECTIONS, addModalStateCase)}
      getSoftDeletedCallback={() => (softDeleteCallback ? softDeleteCallback({ isIncludeDeleted: true }) : undefined)}
    />
  )
}

export default CollectionTable
