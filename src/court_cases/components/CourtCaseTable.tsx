import Button from '@mui/material/Button'
import React from 'react'

import { convertDateToLocaleString, Link, Table, TableData, TableHeaderData } from '../../app'
import { ClientSchema } from '../../clients'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
  ID_ACTION_BUTTON,
} from '../../constants'
import { CourtCaseSchema, HistoryCourtCaseSchema } from '../types/court_cases.data.types'

interface CourtCaseTableProps {
  isHistoryView: boolean
  courtCasesList: CourtCaseSchema[]
  historyCourtCasesList: HistoryCourtCaseSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedCourtCase?: (courtCase: CourtCaseSchema) => void
  setSelectedCourtCaseForReset?: (courtCase: CourtCaseSchema) => void
  selectedClient?: ClientSchema
}

const CourtCaseTable = (props: CourtCaseTableProps): React.ReactElement => {
  const { isHistoryView, courtCasesList, historyCourtCasesList, selectedClient } = props
  const { setModal, setSelectedId, setSelectedCourtCase, setSelectedCourtCaseForReset } = props

  const courtCasesTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'clientCaseType',
        label: 'Case',
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
          id: 'user_name',
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
      tableHeaderData.push(
        {
          id: 'created',
          label: 'Created',
          isDisableSorting: isHistoryView,
        },
        {
          id: 'actions',
          label: 'Actions',
          align: 'center' as const,
          isDisableSorting: true,
        },
      )
    }
    return tableHeaderData
  }

  const linkToCourtCases = (courtCase: CourtCaseSchema) => (
    <Link
      text={`${courtCase.client?.name}, ${courtCase.case_type?.name}`}
      navigateToPage={`/court_case/${courtCase.id}`}
    />
  )

  const actionButtons = (id: number, courtCase: CourtCaseSchema) => (
    <>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_UPDATE)
          setSelectedId && setSelectedId(id)
          setSelectedCourtCase && setSelectedCourtCase(courtCase)
          setSelectedCourtCaseForReset && setSelectedCourtCaseForReset(courtCase)
        }}
      >
        {BUTTON_UPDATE}
      </Button>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_DELETE)
          setSelectedId && setSelectedId(id)
          setSelectedCourtCase && setSelectedCourtCase(courtCase)
        }}
      >
        {BUTTON_DELETE}
      </Button>
    </>
  )

  const courtCasesTableData = (): TableData[] => {
    let tableData: TableData[]
    if (isHistoryView) {
      tableData = Array.from(historyCourtCasesList, (x) => {
        return {
          clientCaseType:
            x.case_type && x.client ? `${x.client}, ${x.case_type.name}` : `${x.client_id}, ${x.case_type_id}`,
          status: x.status || '',
          user_name: x.user_name,
          date: convertDateToLocaleString(x.created),
        }
      })
    } else {
      tableData = Array.from(selectedClient ? selectedClient.court_cases || [] : courtCasesList, (x) => {
        return {
          clientCaseType: linkToCourtCases(x),
          status: x.status || '',
          created: convertDateToLocaleString(x.created),
          actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    }
    return tableData
  }

  const addButton = () =>
    isHistoryView ? undefined : <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New CourtCase</Button>

  return (
    <Table
      componentName="CourtCase"
      headerData={courtCasesTableHeaderData()}
      tableData={courtCasesTableData()}
      addModelComponent={addButton()}
    />
  )
}

export default CourtCaseTable
