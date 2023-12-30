import Button from '@mui/material/Button'
import React from 'react'

import { convertDateToLocaleString, getFullAddress, Link, Table, TableData, TableHeaderData } from '../../app'
import { ACTION_ADD, ACTION_DELETE, ACTION_UPDATE, BUTTON_DELETE, BUTTON_UPDATE } from '../../constants'
import { JudgeSchema } from '../../judges'
import { ClientSchema, HistoryClientSchema } from '../types/clients.data.types'

interface ClientTableProps {
  isHistoryView: boolean
  clientsList: ClientSchema[]
  historyClientsList: HistoryClientSchema[]
  selectedJudge?: JudgeSchema
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedClient?: (client: ClientSchema) => void
  setSelectedClientForReset?: (client: ClientSchema) => void
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
        id: 'status',
        label: 'Status',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'judge',
        label: 'Judge',
        isDisableSorting: isHistoryView,
      },
    ]
    if (isHistoryView) {
      tableHeaderData.push(
        {
          id: 'user_name',
          label: 'User',
          isDisableSorting: true,
        },
        {
          id: 'created',
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

  const linkToJudge = (judge: JudgeSchema) => (
    <Link text={judge.name} navigateToPage={`/judge/${judge.id}?backTo=${window.location.pathname}&prevPage=Clients`} />
  )

  const linkToClients = (client: ClientSchema) => <Link text={client.name} navigateToPage={`/client/${client.id}`} />

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

  const clientsTableData = (): TableData[] => {
    let tableData: TableData[]
    if (isHistoryView) {
      tableData = Array.from(historyClientsList, (x) => {
        return {
          name: x.name || '',
          aNumber: x.a_number || '',
          email: x.email || '',
          phone: x.phone_number || '',
          address: getFullAddress(x.street_address, x.city, x.state, x.zip_code),
          status: x.status || '',
          judge: x.judge?.name || '',
          user_name: x.user_name,
          date: convertDateToLocaleString(x.created),
        }
      })
    } else {
      tableData = Array.from(clientsList, (x) => {
        return {
          name: linkToClients(x),
          aNumber: x.a_number || '',
          email: x.email || '',
          phone: x.phone_number || '',
          address: getFullAddress(x.street_address, x.city, x.state, x.zip_code),
          status: x.status,
          judge: selectedJudge?.name ? selectedJudge.name || '' : x.judge ? linkToJudge(x.judge) : '',
          actions: actionButtons(x.id || -1, x),
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
