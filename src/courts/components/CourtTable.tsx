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
import { CourtSchema, HistoryCourtSchema } from '../types/courts.data.types'

interface CourtTableProps {
  isHistoryView: boolean
  courtsList: CourtSchema[]
  historyCourtsList: HistoryCourtSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedCourt?: (court: CourtSchema) => void
  setSelectedCourtForReset?: (court: CourtSchema) => void
}

const CourtTable = (props: CourtTableProps): React.ReactElement => {
  const { isHistoryView, courtsList, historyCourtsList } = props
  const { setModal, setSelectedId, setSelectedCourt, setSelectedCourtForReset } = props

  const courtsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'name',
        label: 'Name',
        isDisableSorting: isHistoryView,
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

  const linkToCourt = (court: CourtSchema | HistoryCourtSchema) => (
    <Link text={`${court.name}, ${court.state}`} navigateToPage={`/court/${court.id}`} />
  )

  const courtsTableDataCommon = (x: CourtSchema | HistoryCourtSchema) => {
    return {
      name: isHistoryView ? `${x.name}, ${x.state}` : linkToCourt(x),
      address: getFullAddress(x.streetAddress, x.city, x.state, x.zipCode),
      phone: x.phoneNumber || '',
      dhsAddress: x.dhsAddress || '',
      status: x.status || '',
    }
  }

  const courtsTableData = (): TableData[] => {
    let tableData: TableData[]
    if (isHistoryView) {
      tableData = Array.from(historyCourtsList, (x) => {
        return {
          ...courtsTableDataCommon(x),
          user: x.userName,
          date: convertDateToLocaleString(x.created),
        }
      })
    } else {
      tableData = Array.from(courtsList, (x) => {
        return {
          ...courtsTableDataCommon(x),
          actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    }
    return tableData
  }

  const addButton = () =>
    isHistoryView ? undefined : <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Court</Button>

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
