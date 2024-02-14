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
  ID_ACTION_BUTTON,
} from '../../constants'
import { CollectionMethodSchema } from '../../types'
import { CaseCollectionSchema, CashCollectionSchema } from '../types/collections.data.types'

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
  const { clientsList, courtCasesList } = props

  const collectionsTableHeaderData = (): TableHeaderData[] => {
    return [
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
    ]
  }

  const actionButtons = (id: number, collection: CaseCollectionSchema | CashCollectionSchema) => (
    <>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_UPDATE)
          setSelectedId && setSelectedId(id)
          setSelectedType && setSelectedType(collectionType)
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
          setSelectedType && setSelectedType(collectionType)
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
    const courtCase = courtCasesList.find((cc) => cc.id === x.courtCaseId)
    return (
      <Link
        text={courtCase?.caseType?.name}
        navigateToPage={`/court_case/${courtCase?.id}?backTo=${window.location.pathname}&prevPage=Collections`}
      />
    )
  }

  const collectionsTableDataCommon = (x: CaseCollectionSchema) => {
    return {
      client: linkToClient(x),
      case: linkToCase(x),
      quoteDate: getDayjsString(x.quoteDate),
      quoteAmount: getCurrency(x.quoteAmount),
      status: x.status,
    }
  }

  const collectionsTableData = (): TableData[] => {
    return Array.from(caseCollectionsList, (x: CaseCollectionSchema) => {
      return {
        ...collectionsTableDataCommon(x),
        actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
      }
    })
  }

  const addButton = () => (
    <Button
      onClick={() => {
        setModal && setModal(ACTION_ADD)
        setSelectedType && setSelectedType(collectionType)
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
