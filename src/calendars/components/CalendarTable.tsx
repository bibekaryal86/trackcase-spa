import Button from '@mui/material/Button'
import { Dayjs } from 'dayjs'
import React from 'react'

import { getDayjsString, Link, Table, TableData, TableHeaderData } from '../../app'
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
import { HearingTypeSchema, TaskTypeSchema } from '../../types'
import { HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'
import { isHearingCalendar } from '../utils/calendars.utils'

interface CalendarTableProps {
  calendarType: string
  calendarsList: HearingCalendarSchema[] | TaskCalendarSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedType?: (type: string) => void
  setSelectedCalendar?: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  setSelectedCalendarForReset?: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  courtCasesList: CourtCaseSchema[]
  formsList: FormSchema[]
  selectedCourtCase?: CourtCaseSchema
  hearingTypesList?: HearingTypeSchema[]
  selectedForm?: FormSchema
  taskTypesList?: TaskTypeSchema[]
}

const CalendarTable = (props: CalendarTableProps): React.ReactElement => {
  const { calendarType, calendarsList, selectedCourtCase, hearingTypesList, selectedForm, taskTypesList } = props
  const { setModal, setSelectedId, setSelectedType, setSelectedCalendar, setSelectedCalendarForReset } = props
  const { courtCasesList, formsList } = props

  const isHearingCalendarTable = isHearingCalendar(calendarType)
  const calendarTypeForDisplay = isHearingCalendarTable ? 'Hearing Calendar' : 'Task Calendar'

  const calendarsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'calendarDate',
        label: 'Date',
      },
      {
        id: 'calendarType',
        label: 'Type',
      },
    ]
    if (isHearingCalendarTable) {
      tableHeaderData.push({
        id: 'courtCase',
        label: 'Client Case',
      })
    } else {
      tableHeaderData.push(
        {
          id: 'dueDate',
          label: 'Due Date',
        },
        {
          id: 'hearingCalendar',
          label: 'Hearing Calendar',
        },
        {
          id: 'form',
          label: 'Form',
        },
      )
    }
    tableHeaderData.push({
      id: 'status',
      label: 'Status',
    })
    tableHeaderData.push({
      id: 'actions',
      label: 'Actions',
      align: 'center' as const,
      isDisableSorting: true,
    })
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

  const linkToCalendar = (calendarTypePage: string, calendarDate?: Dayjs, calendarId?: number) =>
    calendarDate && calendarId ? (
      <Link text={getDayjsString(calendarDate)} navigateToPage={`/calendar/${calendarTypePage}/${calendarId}`} />
    ) : (
      ''
    )

  const linkToCourtCase = (x: HearingCalendarSchema) => {
    if (selectedCourtCase) {
      return `${selectedCourtCase?.client?.name}, ${selectedCourtCase?.caseType?.name}`
    }
    const courtCase = courtCasesList.find((cc) => cc.id === x.courtCaseId)
    return (
      <Link
        text={`${courtCase?.client?.name}, ${courtCase?.caseType?.name}`}
        navigateToPage={`/court_case/${courtCase?.id}?backTo=${window.location.pathname}&prevPage=Calendars`}
      />
    )
  }

  const linkToForm = (x: TaskCalendarSchema) => {
    if (selectedForm) {
      return `${selectedForm.courtCase?.client?.name}, ${selectedForm.courtCase?.caseType?.name} [${selectedForm.formType?.name}]`
    }
    const form = formsList.find((f) => f.id === x.formId)
    if (form) {
      const courtCase = courtCasesList.find((cc) => cc.id === form.courtCaseId)
      return (
        <Link
          text={`${courtCase?.client?.name}, ${courtCase?.caseType?.name}, [${form.formType?.name}]`}
          navigateToPage={`/form/${courtCase?.id}?backTo=${window.location.pathname}&prevPage=Calendars`}
        />
      )
    }
    return ''
  }

  const getHearingType = (x: HearingCalendarSchema) => {
    let hearingType = x.hearingType
    if (!hearingType) {
      hearingType = hearingTypesList?.find((y) => y.id === x.hearingTypeId)
    }
    return hearingType?.name
  }

  const getTaskType = (x: TaskCalendarSchema) => {
    let taskType = x.taskType
    if (!taskType) {
      taskType = taskTypesList?.find((y) => y.id === x.taskTypeId)
    }
    return taskType?.name
  }

  const calendarsTableDataCommon = (x: HearingCalendarSchema | TaskCalendarSchema) => {
    if (isHearingCalendarTable) {
      const hearingCalendar = x as HearingCalendarSchema
      return {
        calendarDate: linkToCalendar(CALENDAR_OBJECT_TYPES.HEARING, hearingCalendar.hearingDate, hearingCalendar.id),
        calendarType: getHearingType(x as HearingCalendarSchema),
        courtCase: linkToCourtCase(hearingCalendar),
        status: x.status,
      }
    } else {
      const taskCalendar = x as TaskCalendarSchema
      return {
        calendarDate: linkToCalendar(CALENDAR_OBJECT_TYPES.TASK, taskCalendar.taskDate, x.id),
        calendarType: getTaskType(x as TaskCalendarSchema),
        dueDate: getDayjsString(taskCalendar.dueDate),
        hearingCalendar: linkToCalendar(
          CALENDAR_OBJECT_TYPES.HEARING,
          taskCalendar.hearingCalendar?.hearingDate,
          taskCalendar.hearingCalendarId,
        ),
        form: linkToForm(taskCalendar),
        status: x.status,
      }
    }
  }

  const calendarsTableData = (): TableData[] => {
    return Array.from(calendarsList, (x: HearingCalendarSchema | TaskCalendarSchema) => {
      return {
        ...calendarsTableDataCommon(x),
        actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
      }
    })
  }

  const addButton = () => (
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
