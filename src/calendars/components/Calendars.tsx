import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import CalendarForm from './CalendarForm'
import CalendarTable from './CalendarTable'
import { getStatusesList, GlobalState, Modal, StatusSchema, unmountPage } from '../../app'
import { CourtCaseSchema, getCourtCases } from '../../cases'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_RESET,
  BUTTON_UPDATE,
  CALENDAR_OBJECT_TYPES,
  ID_DEFAULT,
} from '../../constants'
import { FormSchema, getForms } from '../../forms'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'
import { getHearingTypes } from '../../types/actions/hearingTypes.action'
import { getTaskTypes } from '../../types/actions/taskTypes.action'
import { addCalendar, deleteCalendar, editCalendar, getCalendars } from '../actions/calendars.action'
import { CALENDARS_UNMOUNT } from '../types/calendars.action.types'
import { DefaultCalendar, HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'
import { isAreTwoCalendarsSame } from '../utils/calendars.utils'

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
  getTaskTypesList: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCasesList: () => void
  formsList: FormSchema[]
  getFormsList: () => void
}

const Calendars = (props: CalendarsProps): React.ReactElement => {
  const {
    hearingCalendarsList,
    taskCalendarsList,
    getHearingCalendars,
    getTaskCalendars,
    addHearingCalendar,
    addTaskCalendar,
    editHearingCalendar,
    editTaskCalendar,
    deleteHearingCalendar,
    deleteTaskCalendar,
  } = props
  const { unmountPage } = props
  const { isCloseModal, isForceFetch } = props
  const { statusList, getStatusesList } = props
  const { hearingTypesList, getHearingTypesList, taskTypesList, getTaskTypesList } = props
  const { courtCasesList, getCourtCasesList, formsList, getFormsList } = props

  const [modal, setModal] = useState('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedCalendar, setSelectedCalendar] = useState<HearingCalendarSchema | TaskCalendarSchema>(DefaultCalendar)
  const [selectedCalendarForReset, setSelectedCalendarForReset] = useState<HearingCalendarSchema | TaskCalendarSchema>(
    DefaultCalendar,
  )
  const [calendarStatusList, setCalendarStatusList] = useState<string[]>([])

  useEffect(() => {
    if (isForceFetch) {
      hearingCalendarsList.length === 0 && getHearingCalendars()
      taskCalendarsList.length === 0 && getTaskCalendars()
      statusList.calendars.all.length === 0 && getStatusesList()
      hearingTypesList.length === 0 && getHearingTypesList()
      taskTypesList.length === 0 && getTaskTypesList()
      courtCasesList.length === 0 && getCourtCasesList()
      formsList.length === 0 && getFormsList()
    }
  }, [
    isForceFetch,
    hearingCalendarsList.length,
    getHearingCalendars,
    taskCalendarsList.length,
    getTaskCalendars,
    statusList.calendars.all,
    getStatusesList,
    hearingTypesList.length,
    getHearingTypesList,
    taskTypesList.length,
    getTaskTypesList,
    courtCasesList.length,
    getCourtCasesList,
    formsList.length,
    getFormsList,
  ])

  useEffect(() => {
    if (statusList.calendars.all.length > 0) {
      setCalendarStatusList(statusList.calendars.all)
    }
  }, [statusList.calendars.all])

  useEffect(() => {
    if (isCloseModal) {
      secondaryButtonCallback()
    }
  }, [isCloseModal])

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const primaryButtonCallback = (action: string, type: string, id?: number) => {
    if (id && action === ACTION_DELETE) {
      type === CALENDAR_OBJECT_TYPES.HEARING && deleteHearingCalendar(id)
      type === CALENDAR_OBJECT_TYPES.TASK && deleteTaskCalendar(id)
    } else if (id && action === ACTION_UPDATE) {
      type === CALENDAR_OBJECT_TYPES.HEARING && editHearingCalendar(id, selectedCalendar as HearingCalendarSchema)
      type === CALENDAR_OBJECT_TYPES.TASK && editTaskCalendar(id, selectedCalendar as TaskCalendarSchema)
    } else {
      type === CALENDAR_OBJECT_TYPES.HEARING && addHearingCalendar(selectedCalendar as HearingCalendarSchema)
      type === CALENDAR_OBJECT_TYPES.TASK && addTaskCalendar(selectedCalendar as TaskCalendarSchema)
    }
  }

  const secondaryButtonCallback = () => {
    setModal('')
    setSelectedId(ID_DEFAULT)
    setSelectedCalendar(DefaultCalendar)
    setSelectedCalendarForReset(DefaultCalendar)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedCalendar(DefaultCalendar)
    action === ACTION_UPDATE && setSelectedCalendar(selectedCalendarForReset)
  }

  const calendarForm = (calendarType: string) => (
    <CalendarForm
      calendarType={calendarType}
      selectedCalendar={selectedCalendar}
      calendarTypesList={calendarType === CALENDAR_OBJECT_TYPES.HEARING ? hearingTypesList : taskTypesList}
      courtCasesList={courtCasesList}
      hearingCalendarsList={hearingCalendarsList}
      setSelectedCalendar={setSelectedCalendar}
      calendarStatusList={calendarStatusList}
      isShowOneCalendar={false}
    />
  )

  const addModal = (calendarType: string) => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title={calendarType === CALENDAR_OBJECT_TYPES.HEARING ? 'Add Hearing Calendar' : 'Add Task Calendar'}
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, calendarType)}
      primaryButtonDisabled={isAreTwoCalendarsSame(selectedCalendar, selectedCalendarForReset, calendarType)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={calendarForm(calendarType)}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
      resetButtonDisabled={isAreTwoCalendarsSame(selectedCalendar, selectedCalendarForReset, calendarType)}
    />
  )

  const updateModal = (calendarType: string) => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title={calendarType === CALENDAR_OBJECT_TYPES.HEARING ? 'Update Hearing Calendar' : 'Update Task Calendar'}
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, calendarType, selectedId)}
        primaryButtonDisabled={isAreTwoCalendarsSame(selectedCalendar, selectedCalendarForReset, calendarType)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={calendarForm(calendarType)}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
        resetButtonDisabled={isAreTwoCalendarsSame(selectedCalendar, selectedCalendarForReset, calendarType)}
      />
    )
  }

  const getDeleteContextText = (calendarType: string) => {
    const calendarDate =
      calendarType === CALENDAR_OBJECT_TYPES.HEARING
        ? (selectedCalendar as HearingCalendarSchema).hearingDate
        : (selectedCalendar as TaskCalendarSchema).taskDate
    if (calendarType === CALENDAR_OBJECT_TYPES.HEARING) {
      return `Are you sure you want to delete Hearing Calendar for date ${calendarDate.toISOString()} for case ${
        selectedCalendar.courtCaseId
      }?!?`
    } else {
      return `Are you sure you want to delete Task Calendar for date ${calendarDate.toISOString()} for case ${
        selectedCalendar.courtCaseId
      }?!?`
    }
  }

  const deleteModal = (calendarType: string) => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title={calendarType === CALENDAR_OBJECT_TYPES.HEARING ? 'Delete Hearing Calendar' : 'Delete Task Calendar'}
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, calendarType, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={getDeleteContextText(calendarType)}
      />
    )
  }

  const showModal = (calendarType: string) =>
    modal === ACTION_ADD
      ? addModal(calendarType)
      : modal === ACTION_UPDATE
      ? updateModal(calendarType)
      : modal === ACTION_DELETE
      ? deleteModal(calendarType)
      : null

  const calendarsPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      Calendars
    </Typography>
  )

  const hearingCalendarsTable = () => (
    <CalendarTable
      isHistoryView={false}
      calendarType={CALENDAR_OBJECT_TYPES.HEARING}
      calendarsList={hearingCalendarsList}
      historyCalendarsList={[]}
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedCalendar={setSelectedCalendar}
      setSelectedCalendarForReset={setSelectedCalendarForReset}
      courtCasesList={[]}
      formsList={[]}
    />
  )

  const taskCalendarsTable = () => (
    <CalendarTable
      isHistoryView={false}
      calendarType={CALENDAR_OBJECT_TYPES.TASK}
      calendarsList={taskCalendarsList}
      historyCalendarsList={[]}
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedCalendar={setSelectedCalendar}
      setSelectedCalendarForReset={setSelectedCalendarForReset}
      courtCasesList={[]}
      formsList={[]}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {calendarsPageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {hearingCalendarsTable()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {taskCalendarsTable()}
        </Grid>
      </Grid>
      {modal && showModal(CALENDAR_OBJECT_TYPES.HEARING)}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendars)
