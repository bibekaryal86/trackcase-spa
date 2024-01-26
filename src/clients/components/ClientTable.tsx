import Button from '@mui/material/Button'
import React from 'react'

import { convertDateToLocaleString, getFullAddress, Link, Table, TableData, TableHeaderData } from '../../app'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
  ID_ACTION_BUTTON,
} from '../../constants'
import { JudgeSchema } from '../../judges'
import { ClientSchema, HistoryClientSchema } from '../types/clients.data.types'

interface ClientTableProps {
  isHistoryView: boolean
  clientsList: ClientSchema[]
  historyClientsList: HistoryClientSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedClient?: (client: ClientSchema) => void
  setSelectedClientForReset?: (client: ClientSchema) => void
  selectedJudge?: JudgeSchema
}

const ClientTable = (props: ClientTableProps): React.ReactElement => {
  const { isHistoryView, clientsList, historyClientsList, selectedJudge } = props
  const { setModal, setSelectedId, setSelectedClient, setSelectedClientForReset } = props

  const clientsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'name',
        label: 'Name',
        isDisableSorting: isHistoryView,
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
        isDisableSorting: isHistoryView,
      },
      {
        id: 'status',
        label: 'Status',
        isDisableSorting: isHistoryView,
      },
    ]
    if (isHistoryView) {
      tableHeaderData.push(
        {
          id: 'user',
          label: 'User',
          isDisableSorting: true,
        },
        {
          id: 'date',
          label: 'Date (UTC)',
          isDisableSorting: true,
        },
      )
    } else {
      tableHeaderData.push({
        id: 'actions',
        label: 'Actions',
        align: 'center' as const,
        isDisableSorting: true,
      })
    }
    return tableHeaderData
  }

  const actionButtons = (id: number, client: ClientSchema) => (
    <>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_UPDATE)
          setSelectedId && setSelectedId(id)
          setSelectedClient && setSelectedClient(client)
          setSelectedClientForReset && setSelectedClientForReset(client)
        }}
      >
        {BUTTON_UPDATE}
      </Button>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_DELETE)
          setSelectedId && setSelectedId(id)
          setSelectedClient && setSelectedClient(client)
        }}
      >
        {BUTTON_DELETE}
      </Button>
    </>
  )

  const linkToJudge = (x: JudgeSchema) => (
    <Link text={x.name} navigateToPage={`/judge/${x.id}?backTo=${window.location.pathname}&prevPage=Clients`} />
  )

  const linkToClient = (x: ClientSchema | HistoryClientSchema) => (
    <Link text={x.name || ''} navigateToPage={`/client/${x.id}`} />
  )

  const clientsTableDataCommon = (x: ClientSchema | HistoryClientSchema) => {
    return {
      name: isHistoryView ? x.name || '' : linkToClient(x),
      aNumber: x.aNumber || '',
      email: x.email || '',
      phone: x.phoneNumber || '',
      address: getFullAddress(x.streetAddress, x.city, x.state, x.zipCode),
      judge: isHistoryView
        ? x.judge?.name || ''
        : selectedJudge?.name
        ? selectedJudge.name || ''
        : x.judge
        ? linkToJudge(x.judge)
        : '',
      status: x.status || '',
    }
  }

  const clientsTableData = (): TableData[] => {
    let tableData: TableData[]
    if (isHistoryView) {
      tableData = Array.from(historyClientsList, (x) => {
        return {
          ...clientsTableDataCommon(x),
          user: x.userName,
          date: convertDateToLocaleString(x.created),
        }
      })
    } else {
      tableData = Array.from(clientsList, (x) => {
        return {
          ...clientsTableDataCommon(x),
          actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    }
    return tableData
  }

  const addButton = () =>
    isHistoryView ? undefined : <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Client</Button>

  return (
    <Table
      componentName="Client"
      headerData={clientsTableHeaderData()}
      tableData={clientsTableData()}
      addModelComponent={addButton()}
    />
  )
}

export default ClientTable
