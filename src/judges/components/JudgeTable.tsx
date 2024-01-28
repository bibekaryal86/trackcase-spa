import Button from '@mui/material/Button'
import React from 'react'

import { convertDateToLocaleString, Link, Table, TableData, TableHeaderData } from '../../app'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
  ID_ACTION_BUTTON,
} from '../../constants'
import { CourtSchema } from '../../courts'
import { HistoryJudgeSchema, JudgeSchema } from '../types/judges.data.types'

interface JudgeTableProps {
  isHistoryView: boolean
  judgesList: JudgeSchema[]
  historyJudgesList: HistoryJudgeSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedJudge?: (judge: JudgeSchema) => void
  setSelectedJudgeForReset?: (judge: JudgeSchema) => void
  selectedCourt?: CourtSchema
}

const JudgeTable = (props: JudgeTableProps): React.ReactElement => {
  const { isHistoryView, judgesList, historyJudgesList, selectedCourt } = props
  const { setModal, setSelectedId, setSelectedJudge, setSelectedJudgeForReset } = props

  const judgesTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'court',
        label: 'Court',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'webex',
        label: 'Webex Address',
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

  const linkToWebex = (webex: string) => <Link text={webex} href={webex} target="_blank" />

  const linkToCourt = (x: CourtSchema) => (
    <Link
      text={`${x.name}, ${x.state}`}
      navigateToPage={`/court/${x.id}?backTo=${window.location.pathname}&prevPage=Judges`}
    />
  )

  const linkToJudge = (x: JudgeSchema | HistoryJudgeSchema) => (
    <Link text={x.name} navigateToPage={`/judge/${x.id}`} />
  )

  const judgesTableDataCommon = (x: JudgeSchema | HistoryJudgeSchema) => {
    return {
      name: isHistoryView ? x.name : linkToJudge(x),
      court: isHistoryView
        ? x.court?.name
        : selectedCourt
        ? selectedCourt.name
        : x.court
        ? linkToCourt(x.court)
        : '',
      webex: isHistoryView ? x.webex : x.webex ? linkToWebex(x.webex) : '',
      status: x.status,
    }
  }

  const judgesTableData = (): TableData[] => {
    let tableData: TableData[]
    if (isHistoryView) {
      tableData = Array.from(historyJudgesList, (x) => {
        return {
          ...judgesTableDataCommon(x),
          user: x.userName,
          date: convertDateToLocaleString(x.created, true),
        }
      })
    } else {
      tableData = Array.from(judgesList, (x) => {
        return {
          ...judgesTableDataCommon(x),
          actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    }
    return tableData
  }

  const addButton = () =>
    isHistoryView ? undefined : <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Judge</Button>

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
