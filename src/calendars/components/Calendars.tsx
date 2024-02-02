import React from 'react'
import { connect } from 'react-redux'

import { getStatusesList, GlobalState, StatusSchema, unmountPage } from '../../app'
import { CourtCaseSchema, getCourtCases } from '../../cases'
import { CALENDAR_OBJECT_TYPES } from '../../constants'
import { FormSchema, getForms } from '../../forms'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'
import { getHearingTypes } from '../../types/actions/hearingTypes.action'
import { getTaskTypes } from '../../types/actions/taskTypes.action'
import { addCalendar, deleteCalendar, editCalendar, getCalendars } from '../actions/calendars.action'
import { CALENDARS_UNMOUNT } from '../types/calendars.action.types'
import { HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'

const mapStateToProps = ({ calendars, statuses, hearingTypes, taskTypes, courtCases, forms }: GlobalState) => {
  return {
    isForceFetch: calendars.isForceFetch,
    isCloseModal: calendars.isCloseModal,
    hearingCalendarsList: calendars.hearingCalendars,
    taskCalendarsList: calendars.taskCalendars,
    statusList: statuses.statuses,
    hearingTypesList: hearingTypes.hearingTypes,
    taskTypesList: taskTypes.taskTypes,
    courtCasesList: courtCases.courtCases,
    formsList: forms.forms,
  }
}

const mapDispatchToProps = {
  getHearingCalendars: () => getCalendars(CALENDAR_OBJECT_TYPES.HEARING),
  getTaskCalendars: () => getCalendars(CALENDAR_OBJECT_TYPES.TASK),
  addHearingCalendar: (calendar: HearingCalendarSchema) => addCalendar(calendar, CALENDAR_OBJECT_TYPES.HEARING),
  addTaskCalendar: (calendar: TaskCalendarSchema) => addCalendar(calendar, CALENDAR_OBJECT_TYPES.TASK),
  editHearingCalendar: (id: number, calendar: HearingCalendarSchema) =>
    editCalendar(id, CALENDAR_OBJECT_TYPES.HEARING, calendar),
  editTaskCalendar: (id: number, calendar: TaskCalendarSchema) =>
    editCalendar(id, CALENDAR_OBJECT_TYPES.TASK, calendar),
  deleteHearingCalendar: (id: number) => deleteCalendar(id, CALENDAR_OBJECT_TYPES.HEARING),
  deleteTaskCalendar: (id: number) => deleteCalendar(id, CALENDAR_OBJECT_TYPES.TASK),
  unmountPage: () => unmountPage(CALENDARS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getHearingTypesList: () => getHearingTypes(),
  getTaskTypesList: () => getTaskTypes(),
  getCourtCasesList: () => getCourtCases(),
  getFormsList: () => getForms(),
}

interface CalendarsProps {
  isForceFetch: boolean
  isCloseModal: boolean
  hearingCalendarsList: HearingCalendarSchema[]
  getHearingCalendars: () => void
  taskCalendarsList: TaskCalendarSchema[]
  getTaskCalendars: () => void
  addHearingCalendar: (calendar: HearingCalendarSchema) => void
  addTaskCalendar: (calendar: TaskCalendarSchema) => void
  editHearingCalendar: (id: number, calendar: HearingCalendarSchema) => void
  editTaskCalendar: (id: number, calendar: TaskCalendarSchema) => void
  deleteHearingCalendar: (id: number) => void
  deleteTaskCalendar: (id: number) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  hearingTypesList: HearingTypeSchema[]
  getHearingTypesList: () => void
  taskTypesList: TaskTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  getCourtCasesList: () => void
  formsList: FormSchema[]
  getFormsList: () => void
}

const Calendars = (props: CalendarsProps): React.ReactElement => {
  console.log(props)
  const pageText = () => (
    <>
      <h5>This is the Calendars!</h5>
    </>
  )

  return <>{pageText()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendars)
