import Button from '@mui/material/Button'
import React from 'react'

import { getCurrency, getDayjsString, Link, Table, TableData, TableHeaderData } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ClientSchema } from '../../clients'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
  COLLECTION_OBJECT_TYPES,
  ID_ACTION_BUTTON,
} from '../../constants'
import { CollectionMethodSchema } from '../../types'
import { CaseCollectionSchema, CashCollectionSchema } from '../types/collections.data.types'
import { isCaseCollection } from '../utils/collections.utils'

interface CollectionTableProps {
  collectionType: string
  caseCollectionsList: CaseCollectionSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedType?: (type: string) => void
  setSelectedCollection?: (collection: CaseCollectionSchema | CashCollectionSchema) => void
  setSelectedCollectionForReset?: (collection: CaseCollectionSchema | CashCollectionSchema) => void
  collectionMethodsList: CollectionMethodSchema[]
  courtCasesList: CourtCaseSchema[]
  clientsList: ClientSchema[]
}

const CollectionTable = (props: CollectionTableProps): React.ReactElement => {
  const { collectionType, caseCollectionsList } = props
  const { setModal, setSelectedId, setSelectedType, setSelectedCollection, setSelectedCollectionForReset } = props
  const { collectionMethodsList, clientsList, courtCasesList } = props

  const isCaseCollectionTable = isCaseCollection(collectionType)

  const collectionsTableHeaderData = (collectionTypeOverride?: string): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = []

    if (isCaseCollectionTable && !(collectionTypeOverride === COLLECTION_OBJECT_TYPES.CASH)) {
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
          id: 'quoteDate',
          label: 'Date',
        },
        {
          id: 'quoteAmount',
          label: 'Amount',
        },
      )
    } else {
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
    }
    tableHeaderData.push(
      {
        id: 'status',
        label: 'Status',
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'center' as const,
        isDisableSorting: true,
      },
    )

    return tableHeaderData
  }

  const actionButtons = (
    id: number,
    collection: CaseCollectionSchema | CashCollectionSchema,
    collectionTypeOverride?: string,
  ) => (
    <>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_UPDATE)
          setSelectedId && setSelectedId(id)
          setSelectedType && setSelectedType(collectionTypeOverride || collectionType)
          setSelectedCollection && setSelectedCollection(collection)
          setSelectedCollectionForReset && setSelectedCollectionForReset(collection)
        }}
      >
        {BUTTON_UPDATE}
      </Button>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_DELETE)
          setSelectedId && setSelectedId(id)
          setSelectedType && setSelectedType(collectionTypeOverride || collectionType)
          setSelectedCollection && setSelectedCollection(collection)
        }}
      >
        {BUTTON_DELETE}
      </Button>
    </>
  )

  const linkToClient = (x: CaseCollectionSchema) => {
    const client = clientsList.find((y) => y.id === x.courtCase?.clientId)
    return (
      <Link
        text={client?.name}
        navigateToPage={`/client/${client?.id}?backTo=${window.location.pathname}&prevPage=Collections`}
      />
    )
  }

  const linkToCase = (x: CaseCollectionSchema) => {
    const courtCase = courtCasesList.find((y) => y.id === x.courtCaseId)
    return (
      <Link
        text={courtCase?.caseType?.name}
        navigateToPage={`/court_case/${courtCase?.id}?backTo=${window.location.pathname}&prevPage=Collections`}
      />
    )
  }

  const collectionMethodName = (x: CashCollectionSchema) => {
    const collectionMethod = collectionMethodsList.find((y) => y.id === x.collectionMethodId)
    return collectionMethod?.name
  }

  const collectionsTableDataCommon = (
    x: CaseCollectionSchema | CashCollectionSchema,
    collectionTypeOverride?: string,
  ) => {
    if (isCaseCollectionTable && !(collectionTypeOverride === COLLECTION_OBJECT_TYPES.CASH)) {
      const y = x as CaseCollectionSchema
      return {
        client: linkToClient(y),
        case: linkToCase(y),
        quoteDate: getDayjsString(y.quoteDate),
        quoteAmount: getCurrency(y.quoteAmount),
        status: x.status,
      }
    } else {
      const y = x as CashCollectionSchema
      return {
        collectionDate: getDayjsString(y.collectionDate),
        collectedAmount: getCurrency(y.collectedAmount),
        waivedAmount: getCurrency(y.waivedAmount),
        collectionMethod: collectionMethodName(y),
        collectionMemo: y.memo,
        status: y.status,
      }
    }
  }

  const getCashCollectionsTable = (x: CaseCollectionSchema) => {
    const cashCollectionsList = x.cashCollections || []
    const cashCollectionsHeaderData = collectionsTableHeaderData(COLLECTION_OBJECT_TYPES.CASH)
    const cashCollectionsTableData = Array.from(cashCollectionsList, (y: CashCollectionSchema) => {
      return {
        ...collectionsTableDataCommon(y, COLLECTION_OBJECT_TYPES.CASH),
        actions: actionButtons(y.id || ID_ACTION_BUTTON, y, COLLECTION_OBJECT_TYPES.CASH),
      }
    })

    return (
      <Table
        componentName="Cash Collections"
        headerData={cashCollectionsHeaderData}
        tableData={cashCollectionsTableData}
        addModelComponent={addButton(COLLECTION_OBJECT_TYPES.CASH)}
        defaultDense={true}
        isDisablePagination={true}
      />
    )
  }

  const collectionsTableData = (): TableData[] => {
    if (isCaseCollectionTable) {
      return Array.from(caseCollectionsList, (x: CaseCollectionSchema) => {
        return {
          ...collectionsTableDataCommon(x),
          cashCollections: getCashCollectionsTable(x),
          actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    } else {
      const cashCollectionsList = caseCollectionsList.flatMap((objA) => objA.cashCollections || [])
      return Array.from(cashCollectionsList, (x: CashCollectionSchema) => {
        return {
          ...collectionsTableDataCommon(x),
          actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    }
  }

  const addButton = (collectionTypeOverride?: string) => (
    <Button
      onClick={() => {
        setModal && setModal(ACTION_ADD)
        setSelectedType && setSelectedType(collectionTypeOverride || collectionType)
      }}
    >
      Add New Collection
    </Button>
  )

  return (
    <Table
      componentName="Case Collections"
      headerData={collectionsTableHeaderData()}
      tableData={collectionsTableData()}
      addModelComponent={addButton()}
    />
  )
}

export default CollectionTable
