import Button from '@mui/material/Button'
import { Dayjs } from 'dayjs'
import React from 'react'

import { convertDateToLocaleString, Link, Table, TableData, TableHeaderData } from '../../app'
import { CourtCaseSchema } from '../../cases'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
  CALENDAR_OBJECT_TYPES,
  ID_ACTION_BUTTON,
} from '../../constants'
import { FormSchema } from '../../forms'
import {
  HearingCalendarSchema,
  HistoryHearingCalendarSchema,
  HistoryTaskCalendarSchema,
  TaskCalendarSchema,
} from '../types/calendars.data.types'

interface CalendarTableProps {
  isHistoryView: boolean
  calendarType: string
  calendarsList: HearingCalendarSchema[] | TaskCalendarSchema[]
  historyCalendarsList: HistoryHearingCalendarSchema[] | HistoryTaskCalendarSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedCalendar?: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  setSelectedCalendarForReset?: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  courtCasesList: CourtCaseSchema[]
  formsList: FormSchema[]
}

const CalendarTable = (props: CalendarTableProps): React.ReactElement => {
  const { isHistoryView, calendarType, calendarsList, historyCalendarsList } = props
  const { setModal, setSelectedId, setSelectedCalendar, setSelectedCalendarForReset } = props

  const calendarTypeForDisplay = calendarType === CALENDAR_OBJECT_TYPES.HEARING ? 'Hearing Calendar' : 'Task Calendar'

  const calendarsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'calendarDate',
        label: 'Date',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'calendarType',
        label: 'Type',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'courtCase',
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

  const actionButtons = (id: number, calendar: HearingCalendarSchema | TaskCalendarSchema) => (
    <>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_UPDATE)
          setSelectedId && setSelectedId(id)
          setSelectedCalendar && setSelectedCalendar(calendar)
          setSelectedCalendarForReset && setSelectedCalendarForReset(calendar)
        }}
      >
        {BUTTON_UPDATE}
      </Button>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_DELETE)
          setSelectedId && setSelectedId(id)
          setSelectedCalendar && setSelectedCalendar(calendar)
        }}
      >
        {BUTTON_DELETE}
      </Button>
    </>
  )

  const linkToCalendar = (calendarDate?: Dayjs, calendarId?: number) =>
    calendarDate && calendarId ? (
      isHistoryView ? (
        calendarDate.toISOString()
      ) : (
        <Link text={calendarDate.toISOString()} navigateToPage={`/calendar/${calendarType}/${calendarId}`} />
      )
    ) : (
      ''
    )

  const calendarsTableDataCommon = (
    x: HearingCalendarSchema | TaskCalendarSchema | HistoryHearingCalendarSchema | HistoryTaskCalendarSchema,
  ) => {
    return {
      calendarDate:
        'hearingDate' in x
          ? linkToCalendar(x.hearingDate, x.id)
          : 'taskDate' in x
          ? linkToCalendar(x.taskDate, x.id)
          : '',
      calendarType: 'hearingTypeId' in x ? x.hearingTypeId : 'taskTypeId' in x ? x.taskTypeId : '',
      courtCase: x.courtCaseId,
      status: x.status,
    }
  }

  const calendarsTableData = (): TableData[] => {
    let tableData: TableData[]
    if (isHistoryView) {
      tableData = Array.from(historyCalendarsList, (x: HistoryHearingCalendarSchema | HistoryTaskCalendarSchema) => {
        return {
          ...calendarsTableDataCommon(x),
          user: x.userName,
          date: convertDateToLocaleString(x.created),
        }
      })
    } else {
      tableData = Array.from(calendarsList, (x: HearingCalendarSchema | TaskCalendarSchema) => {
        return {
          ...calendarsTableDataCommon(x),
          action: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    }
    return tableData
  }

  const addButton = () =>
    isHistoryView ? undefined : (
      <Button onClick={() => setModal && setModal(ACTION_ADD)}>{`Add New ${calendarTypeForDisplay}`}</Button>
    )

  return (
    <Table
      componentName={calendarTypeForDisplay}
      headerData={calendarsTableHeaderData()}
      tableData={calendarsTableData()}
      addModelComponent={addButton()}
    />
  )
}

export default CalendarTable
