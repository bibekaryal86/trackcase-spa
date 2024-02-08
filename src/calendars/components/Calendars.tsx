import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import CalendarForm from './CalendarForm'
import CalendarTable from './CalendarTable'
import { getDayjsString, getNumber, getStatusesList, GlobalState, Modal, StatusSchema, unmountPage } from '../../app'
import { CourtCaseSchema, getCourtCase, getCourtCases } from '../../cases'
import { ClientSchema, getClients } from '../../clients'
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
import { FormSchema, getForm, getForms } from '../../forms'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'
import { getHearingTypes } from '../../types/actions/hearingTypes.action'
import { getTaskTypes } from '../../types/actions/taskTypes.action'
import { addCalendar, deleteCalendar, editCalendar, getCalendars } from '../actions/calendars.action'
import { CALENDARS_UNMOUNT } from '../types/calendars.action.types'
import { DefaultCalendarSchema, HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'
import { isAreTwoCalendarsSame, isHearingCalendar } from '../utils/calendars.utils'

const mapStateToProps = ({ calendars, statuses, hearingTypes, taskTypes, courtCases, forms, clients }: GlobalState) => {
  return {
    isCloseModal: calendars.isCloseModal,
    hearingCalendarsList: calendars.hearingCalendars,
    taskCalendarsList: calendars.taskCalendars,
    statusList: statuses.statuses,
    hearingTypesList: hearingTypes.hearingTypes,
    taskTypesList: taskTypes.taskTypes,
    courtCasesList: courtCases.courtCases,
    formsList: forms.forms,
    clientsList: clients.clients,
    selectedCourtCase: courtCases.selectedCourtCase,
    selectedForm: forms.selectedForm,
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
  getClientsList: () => getClients(),
  getCourtCase: (courtCaseId: number) => getCourtCase(courtCaseId),
  getForm: (formId: number) => getForm(formId),
}

interface CalendarsProps {
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
  clientsList: ClientSchema[]
  getClientsList: () => void
  courtCaseId?: string
  selectedCourtCase?: CourtCaseSchema
  getCourtCase: (courtCaseId: number) => void
  formId?: string
  selectedForm?: FormSchema
  getForm: (formId: number) => void
}

const Calendars = (props: CalendarsProps): React.ReactElement => {
  // to avoid multiple api calls
  const isForceFetch = useRef(true)

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
  const { isCloseModal } = props
  const { statusList, getStatusesList } = props
  const { hearingTypesList, getHearingTypesList, taskTypesList, getTaskTypesList } = props
  const { courtCasesList, getCourtCasesList, formsList, getFormsList, clientsList, getClientsList } = props
  const { courtCaseId, selectedCourtCase, getCourtCase } = props
  const { formId, selectedForm, getForm } = props

  const [modal, setModal] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedCalendar, setSelectedCalendar] = useState<HearingCalendarSchema | TaskCalendarSchema>(
    DefaultCalendarSchema,
  )
  const [selectedCalendarForReset, setSelectedCalendarForReset] = useState<HearingCalendarSchema | TaskCalendarSchema>(
    DefaultCalendarSchema,
  )
  const [calendarStatusList, setCalendarStatusList] = useState<string[]>([])

  useEffect(() => {
    if (isForceFetch.current) {
      hearingCalendarsList.length === 0 && getHearingCalendars()
      taskCalendarsList.length === 0 && getTaskCalendars()
      statusList.calendars.all.length === 0 && getStatusesList()
      hearingTypesList.length === 0 && getHearingTypesList()
      taskTypesList.length === 0 && getTaskTypesList()
      courtCasesList.length === 0 && getCourtCasesList()
      formsList.length === 0 && getFormsList()
      clientsList.length === 0 && getClientsList()

      if (courtCaseId) {
        setSelectedCalendar({ ...DefaultCalendarSchema, courtCaseId: getNumber(courtCaseId) })
        if (!selectedCourtCase) {
          getCourtCase(getNumber(courtCaseId))
        }
      }

      if (formId) {
        setSelectedCalendar({ ...DefaultCalendarSchema, formId: getNumber(formId) })
        if (!selectedForm) {
          getForm(getNumber(formId))
        }
      }
    }
    isForceFetch.current = false
  }, [
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
    clientsList.length,
    getClientsList,
    courtCaseId,
    formId,
    selectedCourtCase,
    getCourtCase,
    selectedForm,
    getForm,
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
      isForceFetch.current = true
      unmountPage()
    }
  }, [unmountPage])

  const primaryButtonCallback = (action: string, type: string, id?: number) => {
    isForceFetch.current = true
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
    setSelectedCalendar(DefaultCalendarSchema)
    setSelectedCalendarForReset(DefaultCalendarSchema)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedCalendar(DefaultCalendarSchema)
    action === ACTION_UPDATE && setSelectedCalendar(selectedCalendarForReset)
  }

  const calendarForm = (calendarType: string) => (
    <CalendarForm
      calendarType={calendarType}
      selectedCalendar={selectedCalendar}
      calendarTypesList={calendarType === CALENDAR_OBJECT_TYPES.HEARING ? hearingTypesList : taskTypesList}
      courtCasesList={courtCasesList}
      formsList={formsList}
      clientsList={clientsList}
      setSelectedCalendar={setSelectedCalendar}
      calendarStatusList={calendarStatusList}
      hearingCalendarList={hearingCalendarsList}
      isShowOneCalendar={false}
    />
  )

  const addModal = () => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title={isHearingCalendar(selectedType) ? 'Add Hearing Calendar' : 'Add Task Calendar'}
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, selectedType)}
      primaryButtonDisabled={isAreTwoCalendarsSame(selectedCalendar, selectedCalendarForReset, selectedType)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={calendarForm(selectedType)}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
      resetButtonDisabled={isAreTwoCalendarsSame(selectedCalendar, selectedCalendarForReset, selectedType)}
    />
  )

  const updateModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title={isHearingCalendar(selectedType) ? 'Update Hearing Calendar' : 'Update Task Calendar'}
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, selectedType, selectedId)}
        primaryButtonDisabled={isAreTwoCalendarsSame(selectedCalendar, selectedCalendarForReset, selectedType)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={calendarForm(selectedType)}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
        resetButtonDisabled={isAreTwoCalendarsSame(selectedCalendar, selectedCalendarForReset, selectedType)}
      />
    )
  }

  const getDeleteContextText = () => {
    const calendarDate = isHearingCalendar(selectedType)
      ? (selectedCalendar as HearingCalendarSchema).hearingDate
      : (selectedCalendar as TaskCalendarSchema).taskDate
    if (isHearingCalendar(selectedType)) {
      return `Are you sure you want to delete Hearing Calendar for date ${getDayjsString(calendarDate)}?!?`
    } else {
      return `Are you sure you want to delete Task Calendar for date ${getDayjsString(calendarDate)}?!?`
    }
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title={selectedType === CALENDAR_OBJECT_TYPES.HEARING ? 'Delete Hearing Calendar' : 'Delete Task Calendar'}
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, selectedType, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={getDeleteContextText()}
      />
    )
  }

  const showModal = () =>
    modal === ACTION_ADD
      ? addModal()
      : modal === ACTION_UPDATE
      ? updateModal()
      : modal === ACTION_DELETE
      ? deleteModal()
      : null

  const calendarsPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      Calendars
    </Typography>
  )

  const hearingCalendarsTable = () => (
    <CalendarTable
      calendarType={CALENDAR_OBJECT_TYPES.HEARING}
      calendarsList={
        !(courtCaseId && selectedCourtCase) ? hearingCalendarsList : selectedCourtCase.hearingCalendars || []
      }
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedType={setSelectedType}
      setSelectedCalendar={setSelectedCalendar}
      setSelectedCalendarForReset={setSelectedCalendarForReset}
      courtCasesList={courtCasesList}
      formsList={formsList}
      selectedCourtCase={!(courtCaseId && selectedCourtCase) ? undefined : selectedCourtCase}
      hearingTypesList={hearingTypesList}
    />
  )

  const taskCalendarsTable = () => (
    <CalendarTable
      calendarType={CALENDAR_OBJECT_TYPES.TASK}
      calendarsList={!(formId && selectedForm) ? taskCalendarsList : selectedForm.taskCalendars || []}
      setModal={setModal}
      setSelectedType={setSelectedType}
      setSelectedId={setSelectedId}
      setSelectedCalendar={setSelectedCalendar}
      setSelectedCalendarForReset={setSelectedCalendarForReset}
      courtCasesList={courtCasesList}
      formsList={formsList}
      selectedForm={!(formId && selectedForm) ? undefined : selectedForm}
      taskTypesList={taskTypesList}
      hearingCalendarsList={hearingCalendarsList}
    />
  )

  return courtCaseId ? (
    <>
      {hearingCalendarsTable()}
      {modal && showModal()}
    </>
  ) : formId ? (
    <>
      {taskCalendarsTable()}
      {modal && showModal()}
    </>
  ) : (
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
      {modal && showModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendars)
