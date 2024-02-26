import Button from '@mui/material/Button'
import React from 'react'

import { getDayjsString, getNumber, Link, Table, TableData, TableHeaderData } from '../../app'
import { CourtCaseSchema } from '../../cases'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
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
  hearingCalendarsList?: HearingCalendarSchema[]
}

const CalendarTable = (props: CalendarTableProps): React.ReactElement => {
  const {
    calendarType,
    calendarsList,
    selectedCourtCase,
    hearingTypesList,
    selectedForm,
    taskTypesList,
    hearingCalendarsList,
  } = props
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
      {
        id: 'client',
        label: 'Client',
      },
      {
        id: 'case',
        label: 'Case',
      },
    ]
    if (!isHearingCalendarTable) {
      tableHeaderData.push(
        {
          id: 'hearingCalendar',
          label: 'Hearing Calendar',
        },
        {
          id: 'form',
          label: 'Filing',
        },
        {
          id: 'dueDate',
          label: 'Due Date',
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

  const linkToClientHc = (x: HearingCalendarSchema) => {
    let courtCaseId = x.courtCaseId
    if (selectedCourtCase) {
      courtCaseId = getNumber(selectedCourtCase.id)
    }
    const courtCase = courtCasesList.find((y) => y.id === courtCaseId)
    return (
      <Link
        text={courtCase?.client?.name}
        navigateToPage={`/client/${courtCase?.client?.id}?backTo=${window.location.pathname}`}
      />
    )
  }

  const linkToCourtCaseHc = (x: HearingCalendarSchema) => {
    if (selectedCourtCase) {
      return selectedCourtCase?.caseType?.name
    }
    const courtCase = courtCasesList.find((y) => y.id === x.courtCaseId)
    return (
      <Link
        text={courtCase?.caseType?.name}
        navigateToPage={`/court_case/${courtCase?.id}?backTo=${window.location.pathname}`}
      />
    )
  }

  const linkToForm = (x: TaskCalendarSchema) => {
    if (selectedForm) {
      return selectedForm.formType?.name
    }
    const form = formsList.find((y) => y.id === x.formId)
    return form ? (
      <Link text={form?.formType?.name} navigateToPage={`/form/${form?.id}?backTo=${window.location.pathname}`} />
    ) : (
      ''
    )
  }

  const linkToClientTc = (x: TaskCalendarSchema) => {
    let formId = x.formId
    if (selectedForm) {
      formId = selectedForm.id
    }
    if (getNumber(formId) > 0) {
      const form = formsList.find((y) => y.id === x.formId)
      if (form) {
        const courtCase = courtCasesList.find((z) => z.id === form.courtCaseId)
        return (
          <Link
            text={courtCase?.client?.name}
            navigateToPage={`/client/${courtCase?.client?.id}?backTo=${window.location.pathname}`}
          />
        )
      }
    } else if (getNumber(x.hearingCalendarId) > 0) {
      const hearingCalendar = hearingCalendarsList?.find((y) => y.id === x.hearingCalendarId)
      if (hearingCalendar) {
        const courtCase = courtCasesList.find((z) => z.id === hearingCalendar.courtCaseId)
        return (
          <Link
            text={courtCase?.client?.name}
            navigateToPage={`/client/${courtCase?.client?.id}?backTo=${window.location.pathname}`}
          />
        )
      }
    }
    return ''
  }

  const linkToCourtCaseTc = (x: TaskCalendarSchema) => {
    let formId = x.formId
    if (selectedForm) {
      formId = selectedForm.id
    }
    if (getNumber(formId) > 0) {
      const form = formsList.find((y) => y.id === x.formId)
      if (form) {
        const courtCase = courtCasesList.find((z) => z.id === form.courtCaseId)
        return (
          <Link
            text={courtCase?.caseType?.name}
            navigateToPage={`/court_case/${courtCase?.id}?backTo=${window.location.pathname}`}
          />
        )
      }
    } else if (getNumber(x.hearingCalendarId) > 0) {
      const hearingCalendar = hearingCalendarsList?.find((y) => y.id === x.hearingCalendarId)
      if (hearingCalendar) {
        const courtCase = courtCasesList.find((z) => z.id === hearingCalendar.courtCaseId)
        return (
          <Link
            text={courtCase?.caseType?.name}
            navigateToPage={`/court_case/${courtCase?.id}?backTo=${window.location.pathname}`}
          />
        )
      }
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
        calendarDate: getDayjsString(hearingCalendar.hearingDate),
        calendarType: getHearingType(x as HearingCalendarSchema),
        client: linkToClientHc(hearingCalendar),
        case: linkToCourtCaseHc(hearingCalendar),
        status: hearingCalendar.status,
      }
    } else {
      const taskCalendar = x as TaskCalendarSchema
      return {
        calendarDate: getDayjsString(taskCalendar.taskDate),
        calendarType: getTaskType(taskCalendar),
        client: linkToClientTc(taskCalendar),
        case: linkToCourtCaseTc(taskCalendar),
        hearingCalendar: getDayjsString(taskCalendar.hearingCalendar?.hearingDate),
        form: linkToForm(taskCalendar),
        dueDate: getDayjsString(taskCalendar.dueDate),
        status: taskCalendar.status,
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
