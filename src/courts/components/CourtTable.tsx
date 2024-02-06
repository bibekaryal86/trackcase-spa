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
import { CourtSchema } from '../types/courts.data.types'

interface CourtTableProps {
  courtsList: CourtSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedCourt?: (court: CourtSchema) => void
  setSelectedCourtForReset?: (court: CourtSchema) => void
}

const CourtTable = (props: CourtTableProps): React.ReactElement => {
  const { courtsList } = props
  const { setModal, setSelectedId, setSelectedCourt, setSelectedCourtForReset } = props

  const courtsTableHeaderData = (): TableHeaderData[] => {
    return [
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'address',
        label: 'Address',
        isDisableSorting: true,
      },
      {
        id: 'phone',
        label: 'Phone Number',
        isDisableSorting: true,
      },
      {
        id: 'dhsAddress',
        label: 'DHS Address',
        isDisableSorting: true,
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

  const actionButtons = (id: number, court: CourtSchema) => (
    <>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_UPDATE)
          setSelectedId && setSelectedId(id)
          setSelectedCourt && setSelectedCourt(court)
          setSelectedCourtForReset && setSelectedCourtForReset(court)
        }}
      >
        {BUTTON_UPDATE}
      </Button>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_DELETE)
          setSelectedId && setSelectedId(id)
          setSelectedCourt && setSelectedCourt(court)
        }}
      >
        {BUTTON_DELETE}
      </Button>
    </>
  )

  const linkToCourt = (x: CourtSchema) => <Link text={`${x.name}, ${x.state}`} navigateToPage={`/court/${x.id}`} />

  const courtsTableDataCommon = (x: CourtSchema) => {
    return {
      name: linkToCourt(x),
      address: getFullAddress(x.streetAddress, x.city, x.state, x.zipCode),
      phone: x.phoneNumber,
      dhsAddress: x.dhsAddress,
      status: x.status,
    }
  }

  const courtsTableData = (): TableData[] => {
    return Array.from(courtsList, (x) => {
      return {
        ...courtsTableDataCommon(x),
        actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
      }
    })
  }

  const addButton = () => <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Court</Button>

  return (
    <Table
      componentName="Court"
      headerData={courtsTableHeaderData()}
      tableData={courtsTableData()}
      addModelComponent={addButton()}
    />
  )
}

export default CourtTable
