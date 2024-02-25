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
import { CourtCaseSchema } from '../types/courtCases.data.types'

interface CourtCaseTableProps {
  courtCasesList: CourtCaseSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedCourtCase?: (courtCase: CourtCaseSchema) => void
  setSelectedCourtCaseForReset?: (courtCase: CourtCaseSchema) => void
  selectedClient?: ClientSchema
}

const CourtCaseTable = (props: CourtCaseTableProps): React.ReactElement => {
  const { courtCasesList, selectedClient } = props
  const { setModal, setSelectedId, setSelectedCourtCase, setSelectedCourtCaseForReset } = props

  const courtCasesTableHeaderData = (): TableHeaderData[] => {
    return [
      {
        id: 'clientCaseType',
        label: 'Case',
      },
      {
        id: 'client',
        label: 'Client',
      },
      {
        id: 'status',
        label: 'Status',
      },
      {
        id: 'created',
        label: 'Created',
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'center' as const,
        isDisableSorting: true,
      },
    ]
  }

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

  const linkToCourtCase = (x: CourtCaseSchema) => (
    <Link text={`${x.caseType?.name}`} navigateToPage={`/court_case/${x.id}`} />
  )

  const linkToClient = (x: CourtCaseSchema) =>
    selectedClient ? (
      selectedClient.name
    ) : (
      <Link text={x.client?.name} navigateToPage={`/client/${x.id}?backTo=${window.location.pathname}`} />
    )

  const courtCasesTableDataCommon = (x: CourtCaseSchema) => {
    return {
      clientCaseType: linkToCourtCase(x),
      client: linkToClient(x),
      status: x.status,
    }
  }

  const courtCasesTableData = (): TableData[] => {
    return Array.from(courtCasesList, (x) => {
      return {
        ...courtCasesTableDataCommon(x),
        created: convertDateToLocaleString(x.created, true),
        actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
      }
    })
  }

  const addButton = () => <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Case</Button>

  return (
    <Table
      componentName="Case"
      headerData={courtCasesTableHeaderData()}
      tableData={courtCasesTableData()}
      addModelComponent={addButton()}
    />
  )
}

export default CourtCaseTable
