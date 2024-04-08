import React from 'react'

import {
  FetchRequestMetadata,
  getDayjsString,
  getNumber,
  Link,
  ModalState,
  Table,
  tableAddButtonComponent,
  TableData,
  TableHeaderData,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ACTION_TYPES, CALENDAR_TYPES, CalendarTypes, COMPONENT_STATUS_NAME } from '../../constants'
import { FilingSchema } from '../../filings'
import { ComponentStatusSchema, HearingTypeSchema, TaskTypeSchema } from '../../types'
import { checkUserHasPermission, isSuperuser } from '../../users'
import {
  HearingCalendarFormData,
  HearingCalendarSchema,
  TaskCalendarFormData,
  TaskCalendarSchema,
} from '../types/calendars.data.types'
import { getCalendarFormDataFromSchema, isHearingCalendar } from '../utils/calendars.utils'

interface CalendarTableProps {
  type: CalendarTypes
  calendarsList: HearingCalendarSchema[] | TaskCalendarSchema[]
  actionButtons?: (formDataForModal: HearingCalendarFormData | TaskCalendarFormData) => React.JSX.Element
  addModalState?: ModalState
  softDeleteCallback?: (requestMetadata: Partial<FetchRequestMetadata>) => void
  courtCasesList: CourtCaseSchema[]
  filingsList: FilingSchema[]
  componentStatusList: ComponentStatusSchema[]
  hearingTypesList?: HearingTypeSchema[]
  taskTypesList?: TaskTypeSchema[]
  hearingCalendarsList?: HearingCalendarSchema[]
  selectedCourtCase?: CourtCaseSchema
  selectedFiling?: FilingSchema
}

const CalendarTable = (props: CalendarTableProps): React.ReactElement => {
  const { type, calendarsList, actionButtons, addModalState, softDeleteCallback } = props
  const { courtCasesList, filingsList, componentStatusList, hearingTypesList, taskTypesList, hearingCalendarsList } =
    props
  const { selectedCourtCase, selectedFiling } = props

  const isHearingCalendarTable = type === CALENDAR_TYPES.HEARING_CALENDAR
  const calendarTypeForDisplay = type.toString().replace('_', ' ')

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
          id: 'filing',
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
    if (isSuperuser()) {
      tableHeaderData.push({
        id: 'isDeleted',
        label: 'IS DELETED?',
      })
    }
    if (
      (checkUserHasPermission(COMPONENT_STATUS_NAME.CALENDARS, ACTION_TYPES.UPDATE) ||
        checkUserHasPermission(COMPONENT_STATUS_NAME.CALENDARS, ACTION_TYPES.DELETE)) &&
      !selectedCourtCase &&
      !selectedFiling
    ) {
      tableHeaderData.push({
        id: 'actions',
        label: 'ACTIONS',
        isDisableSorting: true,
        align: 'center' as const,
      })
    }
    return tableHeaderData
  }

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

  const linkToFiling = (x: TaskCalendarSchema) => {
    if (selectedFiling) {
      return selectedFiling.filingType?.name
    }
    const filing = filingsList.find((y) => y.id === x.filingId)
    return filing ? (
      <Link
        text={filing?.filingType?.name}
        navigateToPage={`/filing/${filing?.id}?backTo=${window.location.pathname}`}
      />
    ) : (
      ''
    )
  }

  const linkToClientTc = (x: TaskCalendarSchema) => {
    let filingId = x.filingId
    if (selectedFiling) {
      filingId = selectedFiling.id
    }
    if (getNumber(filingId) > 0) {
      const filing = filingsList.find((y) => y.id === x.filingId)
      if (filing) {
        const courtCase = courtCasesList.find((z) => z.id === filing.courtCaseId)
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
    let filingId = x.filingId
    if (selectedFiling) {
      filingId = selectedFiling.id
    }
    if (getNumber(filingId) > 0) {
      const filing = filingsList.find((y) => y.id === x.filingId)
      if (filing) {
        const courtCase = courtCasesList.find((z) => z.id === filing.courtCaseId)
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

  const getComponentStatus = (x: HearingCalendarSchema | TaskCalendarSchema) => {
    if (x.componentStatus) {
      return x.componentStatus.statusName
    } else {
      const componentStatus = componentStatusList?.find((y) => y.id === x.componentStatusId)
      return componentStatus?.statusName
    }
  }

  const calendarsTableDataCommon = (x: HearingCalendarSchema | TaskCalendarSchema) => {
    if (isHearingCalendar(x)) {
      const hearingCalendar = x as HearingCalendarSchema
      return {
        calendarDate: getDayjsString(hearingCalendar.hearingDate),
        calendarType: getHearingType(x as HearingCalendarSchema),
        client: linkToClientHc(hearingCalendar),
        case: linkToCourtCaseHc(hearingCalendar),
        status: getComponentStatus(x),
      }
    } else {
      const taskCalendar = x as TaskCalendarSchema
      return {
        calendarDate: getDayjsString(taskCalendar.taskDate),
        calendarType: getTaskType(taskCalendar),
        client: linkToClientTc(taskCalendar),
        case: linkToCourtCaseTc(taskCalendar),
        hearingCalendar: getDayjsString(taskCalendar.hearingCalendar?.hearingDate),
        filing: linkToFiling(taskCalendar),
        dueDate: getDayjsString(taskCalendar.dueDate),
        status: getComponentStatus(x),
      }
    }
  }

  const calendarsTableData = (): TableData[] => {
    return Array.from(calendarsList, (x: HearingCalendarSchema | TaskCalendarSchema) => {
      return {
        ...calendarsTableDataCommon(x),
        isDeleted: x.isDeleted,
        actions: actionButtons ? actionButtons(getCalendarFormDataFromSchema(x)) : undefined,
      }
    })
  }

  return (
    <Table
      componentName={calendarTypeForDisplay}
      headerData={calendarsTableHeaderData()}
      tableData={calendarsTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.CALENDARS, addModalState)}
      getSoftDeletedCallback={() => (softDeleteCallback ? softDeleteCallback({ isIncludeDeleted: true }) : undefined)}
    />
  )
}

export default CalendarTable
