import Button from '@mui/material/Button'
import React from 'react'

import { getFullAddress, Link, Table, TableData, TableHeaderData } from '../../app'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
  ID_ACTION_BUTTON,
} from '../../constants'
import { JudgeSchema } from '../../judges'
import { ClientSchema } from '../types/clients.data.types'

interface ClientTableProps {
  clientsList: ClientSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedClient?: (client: ClientSchema) => void
  setSelectedClientForReset?: (client: ClientSchema) => void
  selectedJudge?: JudgeSchema
}

const ClientTable = (props: ClientTableProps): React.ReactElement => {
  const { clientsList, selectedJudge } = props
  const { setModal, setSelectedId, setSelectedClient, setSelectedClientForReset } = props

  const clientsTableHeaderData = (): TableHeaderData[] => {
    return [
      {
        id: 'name',
        label: 'Name',
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

  const linkToJudge = (x?: JudgeSchema) =>
    selectedJudge ? (
      selectedJudge.name
    ) : x ?

      (
      <Link text={x?.name} navigateToPage={`/judge/${x?.id}?backTo=${window.location.pathname}&prevPage=Clients`} />
    ) : ''

  const linkToClient = (x: ClientSchema) => <Link text={x.name} navigateToPage={`/client/${x.id}`} />

  const clientsTableDataCommon = (x: ClientSchema) => {
    return {
      name: linkToClient(x),
      aNumber: x.aNumber,
      email: x.email,
      phone: x.phoneNumber,
      address: getFullAddress(x.streetAddress, x.city, x.state, x.zipCode),
      judge: linkToJudge(x.judge),
      status: x.status,
    }
  }

  const clientsTableData = (): TableData[] => {
    return Array.from(clientsList, (x) => {
      return {
        ...clientsTableDataCommon(x),
        actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
      }
    })
  }

  const addButton = () => <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Client</Button>

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
