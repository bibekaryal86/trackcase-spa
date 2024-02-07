import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import { getStatusesList, GlobalState, StatusSchema, unmountPage } from '../../app'
import { CourtCaseSchema, getCourtCases } from '../../cases'
import { CALENDAR_OBJECT_TYPES } from '../../constants'
import { FormSchema, getForms } from '../../forms'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'
import { getHearingTypes } from '../../types/actions/hearingTypes.action'
import { getTaskTypes } from '../../types/actions/taskTypes.action'
import { editCalendar, getCalendar } from '../actions/calendars.action'
import { CALENDARS_UNMOUNT } from '../types/calendars.action.types'
import { HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'

const mapStateToProps = ({ calendars, statuses, hearingTypes, taskTypes, courtCases, forms }: GlobalState) => {
  return {
    isForceFetch: calendars.isForceFetch,
    selectedHearingCalendar: calendars.selectedHearingCalendar,
    selectedTaskCalendar: calendars.selectedTaskCalendar,
    statusList: statuses.statuses,
    hearingTypesList: hearingTypes.hearingTypes,
    taskTypesList: taskTypes.taskTypes,
    courtCasesList: courtCases.courtCases,
    formsList: forms.forms,
  }
}

const mapDispatchToProps = {
  getHearingCalendar: (calendarId: number) => getCalendar(calendarId, CALENDAR_OBJECT_TYPES.HEARING),
  getTaskCalendar: (calendarId: number) => getCalendar(calendarId, CALENDAR_OBJECT_TYPES.TASK),
  editHearingCalendar: (calendarId: number, calendar: HearingCalendarSchema) =>
    editCalendar(calendarId, CALENDAR_OBJECT_TYPES.HEARING, calendar),
  editTaskCalendar: (calendarId: number, calendar: TaskCalendarSchema) =>
    editCalendar(calendarId, CALENDAR_OBJECT_TYPES.TASK, calendar),
  unmountPage: () => unmountPage(CALENDARS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getHearingTypesList: () => getHearingTypes(),
  getTaskTypesList: () => getTaskTypes(),
  getCourtCasesList: () => getCourtCases(),
  getFormsList: () => getForms(),
}

interface CalendarProps {
  isForceFetch: boolean
  selectedHearingCalendar: HearingCalendarSchema
  selectedTaskCalendar: TaskCalendarSchema
  getHearingCalendar: (calendarId: number) => void
  getTaskCalendar: (calendarId: number) => void
  editHearingCalendar: (calendarId: number, calendar: HearingCalendarSchema) => void
  editTaskCalendar: (calendarId: number, calendar: TaskCalendarSchema) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  hearingTypesList: HearingTypeSchema[]
  getHearingTypesList: () => void
  taskTypesList: TaskTypeSchema[]
  getTaskTypesList: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCasesList: () => void
  formsList: FormSchema[]
  getFormsList: () => void
}

const Calendar = (props: CalendarProps): React.ReactElement => {
  console.log(props)
  const { id, type } = useParams()
  console.log(id, type)
  const pageText = () => (
    <>
      <h5>This is the Calendar!</h5>
    </>
  )

  return <>{pageText()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar)
