import Button from '@mui/material/Button'
import React from 'react'

import { Link, Table, TableData, TableHeaderData } from '../../app'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
  ID_ACTION_BUTTON,
} from '../../constants'
import { CourtSchema } from '../../courts'
import { JudgeSchema } from '../types/judges.data.types'

interface JudgeTableProps {
  judgesList: JudgeSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedJudge?: (judge: JudgeSchema) => void
  setSelectedJudgeForReset?: (judge: JudgeSchema) => void
  selectedCourt?: CourtSchema
}

const JudgeTable = (props: JudgeTableProps): React.ReactElement => {
  const { judgesList, selectedCourt } = props
  const { setModal, setSelectedId, setSelectedJudge, setSelectedJudgeForReset } = props

  const judgesTableHeaderData = (): TableHeaderData[] => {
    return [
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'court',
        label: 'Court',
      },
      {
        id: 'webex',
        label: 'Webex Address',
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

  const actionButtons = (id: number, judge: JudgeSchema) => (
    <>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_UPDATE)
          setSelectedId && setSelectedId(id)
          setSelectedJudge && setSelectedJudge(judge)
          setSelectedJudgeForReset && setSelectedJudgeForReset(judge)
        }}
      >
        {BUTTON_UPDATE}
      </Button>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_DELETE)
          setSelectedId && setSelectedId(id)
          setSelectedJudge && setSelectedJudge(judge)
        }}
      >
        {BUTTON_DELETE}
      </Button>
    </>
  )

  const linkToWebex = (webex?: string) =>
    webex ? <Link text={webex} href={webex.toLowerCase()} target="_blank" /> : ''

  const linkToCourt = (x?: CourtSchema) =>
    selectedCourt ? (
      selectedCourt.name
    ) : (
      <Link
        text={`${x?.name}, ${x?.state}`}
        navigateToPage={`/court/${x?.id}?backTo=${window.location.pathname}`}
      />
    )

  const linkToJudge = (x: JudgeSchema) => <Link text={x.name} navigateToPage={`/judge/${x.id}`} />

  const judgesTableDataCommon = (x: JudgeSchema) => {
    return {
      name: linkToJudge(x),
      court: linkToCourt(x.court),
      webex: linkToWebex(x.webex),
      status: x.status,
    }
  }

  const judgesTableData = (): TableData[] => {
    return Array.from(judgesList, (x) => {
      return {
        ...judgesTableDataCommon(x),
        actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
      }
    })
  }

  const addButton = () => <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Judge</Button>

  return (
    <Table
      componentName="Judge"
      headerData={judgesTableHeaderData()}
      tableData={judgesTableData()}
      addModelComponent={addButton()}
    />
  )
}

export default JudgeTable
