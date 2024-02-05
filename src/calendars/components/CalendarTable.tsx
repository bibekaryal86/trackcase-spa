import Button from '@mui/material/Button'
import dayjs, { Dayjs } from 'dayjs'
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
import { isHearingCalendar } from '../utils/calendars.utils'

interface CalendarTableProps {
  isHistoryView: boolean
  calendarType: string
  calendarsList: HearingCalendarSchema[] | TaskCalendarSchema[]
  historyCalendarsList: HistoryHearingCalendarSchema[] | HistoryTaskCalendarSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedType?: (type: string) => void
  setSelectedCalendar?: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  setSelectedCalendarForReset?: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  courtCasesList: CourtCaseSchema[]
  formsList: FormSchema[]
}

const CalendarTable = (props: CalendarTableProps): React.ReactElement => {
  const { isHistoryView, calendarType, calendarsList, historyCalendarsList } = props
  const { setModal, setSelectedId, setSelectedType, setSelectedCalendar, setSelectedCalendarForReset } = props
  const { courtCasesList, formsList } = props

  const isHearingCalendarTable = isHearingCalendar(calendarType)
  const calendarTypeForDisplay = isHearingCalendarTable ? 'Hearing Calendar' : 'Task Calendar'

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
    ]
    if (isHearingCalendarTable) {
      tableHeaderData.push({
        id: 'courtCase',
        label: 'Case',
        isDisableSorting: isHistoryView,
      })
    } else {
      tableHeaderData.push(
        {
          id: 'dueDate',
          label: 'Due Date',
          isDisableSorting: isHistoryView,
        },
        {
          id: 'hearingCalendar',
          label: 'Hearing Calendar',
          isDisableSorting: isHistoryView,
        },
        {
          id: 'form',
          label: 'Form',
          isDisableSorting: isHistoryView,
        },
      )
    }
    tableHeaderData.push({
      id: 'status',
      label: 'Status',
      isDisableSorting: isHistoryView,
    })
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
          setSelectedType && setSelectedType(calendarType)
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
          setSelectedType && setSelectedType(calendarType)
          setSelectedCalendar && setSelectedCalendar(calendar)
        }}
      >
        {BUTTON_DELETE}
      </Button>
    </>
  )

  const linkToCalendar = (calendarDate?: Dayjs, calendarId?: number, calendarTypePage?: string) =>
    calendarDate && calendarId && calendarTypePage ? (
      isHistoryView ? (
        dayjs(calendarDate).format('YYYY-MM-DD')
      ) : (
        <Link
          text={dayjs(calendarDate).format('YYYY-MM-DD')}
          navigateToPage={`/calendar/${calendarTypePage}/${calendarId}`}
        />
      )
    ) : (
      ''
    )

  const getCourtCase = (calendar: HearingCalendarSchema | HistoryHearingCalendarSchema) => {
    const courtCase = courtCasesList.find((cc) => cc.id === calendar.courtCaseId)
    return `${courtCase?.client?.name}, ${courtCase?.caseType?.name}`
  }

  const getForm = (calendar: TaskCalendarSchema | HistoryTaskCalendarSchema) => {
    const form = formsList.find((f) => f.id === calendar.formId)
    if (form) {
      const courtCase = courtCasesList.find((cc) => cc.id === form.courtCaseId)
      return `${courtCase?.client?.name}, ${courtCase?.caseType?.name}`
    }
    return ''
  }

  const calendarsTableDataCommon = (
    x: HearingCalendarSchema | TaskCalendarSchema | HistoryHearingCalendarSchema | HistoryTaskCalendarSchema,
  ) => {
    if (isHearingCalendarTable) {
      const hearingCalendar = x as HearingCalendarSchema
      return {
        calendarDate: linkToCalendar(hearingCalendar.hearingDate, hearingCalendar.id, CALENDAR_OBJECT_TYPES.HEARING),
        calendarType: hearingCalendar.hearingType?.name,
        courtCase: getCourtCase(hearingCalendar),
        status: x.status,
      }
    } else {
      const taskCalendar = x as TaskCalendarSchema
      return {
        calendarDate: linkToCalendar(taskCalendar.taskDate, x.id, CALENDAR_OBJECT_TYPES.TASK),
        calendarType: taskCalendar.taskType?.name,
        dueDate: taskCalendar.dueDate ? dayjs(taskCalendar.dueDate).format('YYYY-MM-DD') : '',
        hearingCalendar: linkToCalendar(taskCalendar.hearingCalendar?.hearingDate, taskCalendar.hearingCalendarId, CALENDAR_OBJECT_TYPES.HEARING),
        form: getForm(taskCalendar),
        status: x.status,
      }
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
          actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    }
    return tableData
  }

  const addButton = () =>
    isHistoryView ? undefined : (
      <Button
        onClick={() => {
          setModal && setModal(ACTION_ADD)
          setSelectedType && setSelectedType(calendarType)
        }}
      >
        {`Add New ${calendarTypeForDisplay}`}
      </Button>
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
