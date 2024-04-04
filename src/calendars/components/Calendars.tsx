import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import CalendarCalendar from './CalendarCalendar'
import CalendarChooseView from './CalendarChooseView'
import { CalendarFormHc, CalendarFormTc } from './CalendarForm'
import CalendarTable from './CalendarTable'
import {
  addModalComponent,
  deleteModalComponent,
  FetchRequestMetadata,
  getNumber,
  GlobalState,
  pageTitleComponent,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  updateModalComponent,
  useModal,
} from '../../app'
import { CourtCaseSchema, getCourtCases } from '../../cases'
import { ClientSchema, getClients } from '../../clients'
import {
  ACTION_TYPES,
  ActionTypes,
  CALENDAR_TYPES,
  CalendarTypes,
  COMPONENT_STATUS_NAME,
  INVALID_INPUT,
} from '../../constants'
import { FilingSchema, getFilings } from '../../filings'
import { getRefTypes, RefTypesState } from '../../types'
import { calendarsAction, getCalendars } from '../actions/calendars.action'
import {
  CalendarEvents,
  DefaultHearingCalendarFormData,
  DefaultHearingCalendarFormErrorData,
  DefaultTaskCalendarFormData,
  DefaultTaskCalendarFormErrorData,
  HearingCalendarBase,
  HearingCalendarFormData,
  HearingCalendarResponse,
  HearingCalendarSchema,
  TaskCalendarBase,
  TaskCalendarFormData,
  TaskCalendarResponse,
  TaskCalendarSchema,
} from '../types/calendars.data.types'
import { validateHearingCalendar, validateTaskCalendar } from '../utils/calendars.utils'

const mapStateToProps = ({ calendars, refTypes, courtCases, filings, clients }: GlobalState) => {
  return {
    calendarEventsList: calendars.calendarEvents,
    hearingCalendarsList: calendars.hearingCalendars,
    taskCalendarsList: calendars.taskCalendars,
    refTypes: refTypes,
    courtCasesList: courtCases.courtCases,
    filingsList: filings.filings,
    clientsList: clients.clients,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getCalendars: (requestMetadata: Partial<FetchRequestMetadata>) => getCalendars(requestMetadata),
  getCourtCasesList: () => getCourtCases(),
  getFilingsList: () => getFilings(),
  getClientsList: () => getClients(),
}

interface CalendarsProps {
  calendarEventsList: CalendarEvents[]
  hearingCalendarsList: HearingCalendarSchema[]
  taskCalendarsList: TaskCalendarSchema[]
  getCalendars: (requestMetadata: Partial<FetchRequestMetadata>) => void
  refTypes: RefTypesState
  getRefTypes: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCasesList: () => void
  filingsList: FilingSchema[]
  getFilingsList: () => void
  clientsList: ClientSchema[]
  getClientsList: () => void
  courtCaseId?: number
  selectedCourtCase?: CourtCaseSchema
  filingId?: number
  selectedFiling?: FilingSchema
}

const Calendars = (props: CalendarsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { calendarEventsList, hearingCalendarsList, taskCalendarsList, getCalendars } = props
  const { refTypes, getRefTypes } = props
  const { courtCasesList, getCourtCasesList } = props
  const { filingsList, getFilingsList } = props
  const { clientsList, getClientsList } = props
  const { courtCaseId, selectedCourtCase, filingId, selectedFiling } = props

  const minCalendarDate = dayjs().subtract(1, 'month')
  const maxCalendarDate = dayjs().add(1, 'year')

  const [isShowListView, setIsShowListView] = useState(false)
  const [type, setType] = useState<CalendarTypes>(CALENDAR_TYPES.HEARING_CALENDAR)
  const [formDataHc, setFormDataHc] = useState(DefaultHearingCalendarFormData)
  const [formDataTc, setFormDataTc] = useState(DefaultTaskCalendarFormData)
  const [formDataResetHc, setFormDataResetHc] = useState(DefaultHearingCalendarFormData)
  const [formDataResetTc, setFormDataResetTc] = useState(DefaultTaskCalendarFormData)
  const [formErrorsHc, setFormErrorsHc] = useState(DefaultHearingCalendarFormErrorData)
  const [formErrorsTc, setFormErrorsTc] = useState(DefaultTaskCalendarFormErrorData)

  const calendarStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.CALENDARS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      calendarEventsList.length === 0 && getCalendars({})
      courtCasesList.length === 0 && getCourtCasesList()
      filingsList.length === 0 && getFilingsList()
      clientsList.length === 0 && getClientsList()
      if (
        refTypes.componentStatus.length === 0 ||
        refTypes.hearingType.length === 0 ||
        refTypes.taskType.length === 0
      ) {
        getRefTypes()
      }
    }
  }, [
    calendarEventsList.length,
    clientsList.length,
    courtCasesList.length,
    filingsList.length,
    getCalendars,
    getClientsList,
    getCourtCasesList,
    getFilingsList,
    getRefTypes,
    refTypes.componentStatus.length,
    refTypes.hearingType.length,
    refTypes.taskType.length,
  ])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const getCalendarsWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getCalendars(requestMetadata)
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const isHc = type === CALENDAR_TYPES.HEARING_CALENDAR
    const calendarId = isHc ? getNumber(formDataHc.id) : getNumber(formDataTc.id)
    const calendarsRequest: HearingCalendarBase | TaskCalendarBase = isHc ? { ...formDataHc } : { ...formDataTc }
    const hasFormErrors = isHc
      ? validateHearingCalendar(formDataHc, setFormErrorsHc)
      : validateTaskCalendar(formDataTc, setFormErrorsTc)
    if (hasFormErrors) {
      return
    }

    let calendarResponse: HearingCalendarResponse | TaskCalendarResponse = {
      data: [],
      detail: { error: INVALID_INPUT },
    }
    if (action === ACTION_TYPES.CREATE) {
      calendarResponse = await calendarsAction({ type, action, calendarsRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      calendarId > 0
    ) {
      calendarResponse = await calendarsAction({
        type: type,
        action: action,
        calendarsRequest: calendarsRequest,
        id: formDataHc.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formDataHc.isHardDelete,
      })(dispatch)
    }

    if (calendarResponse && !calendarResponse.detail) {
      isHc
        ? secondaryButtonCallback(
            addModalState,
            updateModalState,
            deleteModalState,
            setFormDataHc,
            setFormErrorsHc,
            DefaultHearingCalendarFormData,
            DefaultHearingCalendarFormErrorData,
          )
        : secondaryButtonCallback(
            addModalState,
            updateModalState,
            deleteModalState,
            setFormDataTc,
            setFormErrorsTc,
            DefaultTaskCalendarFormData,
            DefaultTaskCalendarFormErrorData,
          )
      isForceFetch.current = true
      calendarEventsList.length === 0 && getCalendars({})
    }
  }

  const addUpdateModalContent = () =>
    type === CALENDAR_TYPES.HEARING_CALENDAR ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
        <CalendarFormHc
          formData={formDataHc}
          setFormData={setFormDataHc}
          formErrors={formErrorsHc}
          setFormErrors={setFormErrorsHc}
          calendarStatusList={calendarStatusList()}
          calendarTypesList={refTypes.hearingType}
          courtCasesList={courtCasesList}
          isShowOneCalendar={false}
          minCalendarDate={minCalendarDate}
          maxCalendarDate={maxCalendarDate}
        />
      </Box>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
        <CalendarFormTc
          formData={formDataTc}
          setFormData={setFormDataTc}
          formErrors={formErrorsTc}
          setFormErrors={setFormErrorsTc}
          filingsList={filingsList}
          clientsList={clientsList}
          hearingCalendarList={hearingCalendarsList}
          calendarStatusList={calendarStatusList()}
          calendarTypesList={refTypes.taskType}
          courtCasesList={courtCasesList}
          isShowOneCalendar={false}
          minCalendarDate={minCalendarDate}
          maxCalendarDate={maxCalendarDate}
        />
      </Box>
    )

  const addModal = () =>
    type === CALENDAR_TYPES.HEARING_CALENDAR
      ? addModalComponent(
          COMPONENT_STATUS_NAME.CALENDARS,
          addUpdateModalContent(),
          primaryButtonCallback,
          addModalState,
          updateModalState,
          deleteModalState,
          setFormDataHc,
          setFormErrorsHc,
          DefaultHearingCalendarFormData,
          DefaultHearingCalendarFormErrorData,
          formDataResetHc,
        )
      : addModalComponent(
          COMPONENT_STATUS_NAME.CALENDARS,
          addUpdateModalContent(),
          primaryButtonCallback,
          addModalState,
          updateModalState,
          deleteModalState,
          setFormDataTc,
          setFormErrorsTc,
          DefaultTaskCalendarFormData,
          DefaultTaskCalendarFormErrorData,
          formDataResetTc,
        )

  const updateModal = () =>
    type === CALENDAR_TYPES.HEARING_CALENDAR
      ? updateModalComponent(
          COMPONENT_STATUS_NAME.CALENDARS,
          addUpdateModalContent(),
          primaryButtonCallback,
          addModalState,
          updateModalState,
          deleteModalState,
          setFormDataHc,
          setFormErrorsHc,
          DefaultHearingCalendarFormData,
          DefaultHearingCalendarFormErrorData,
          formDataResetHc,
        )
      : updateModalComponent(
          COMPONENT_STATUS_NAME.CALENDARS,
          addUpdateModalContent(),
          primaryButtonCallback,
          addModalState,
          updateModalState,
          deleteModalState,
          setFormDataTc,
          setFormErrorsTc,
          DefaultTaskCalendarFormData,
          DefaultTaskCalendarFormErrorData,
          formDataResetTc,
        )

  const deleteModalContextText =
    type === CALENDAR_TYPES.HEARING_CALENDAR
      ? `ARE YOU SURE YOU WANT TO ${
          formDataHc.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
        } CALENDAR EVENT FOR ${formDataHc.hearingDate}?!?`
      : `ARE YOU SURE YOU WANT TO ${
          formDataTc.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
        } CALENDAR EVENT FOR ${formDataTc.taskDate}?!?`

  const deleteModal = () =>
    type === CALENDAR_TYPES.HEARING_CALENDAR
      ? deleteModalComponent(
          COMPONENT_STATUS_NAME.CALENDARS,
          deleteModalContextText,
          primaryButtonCallback,
          addModalState,
          updateModalState,
          deleteModalState,
          setFormDataHc,
          setFormErrorsHc,
          DefaultHearingCalendarFormData,
          DefaultHearingCalendarFormErrorData,
          formDataHc,
          formErrorsHc,
        )
      : deleteModalComponent(
          COMPONENT_STATUS_NAME.CALENDARS,
          deleteModalContextText,
          primaryButtonCallback,
          addModalState,
          updateModalState,
          deleteModalState,
          setFormDataTc,
          setFormErrorsTc,
          DefaultTaskCalendarFormData,
          DefaultTaskCalendarFormErrorData,
          formDataTc,
          formErrorsTc,
        )

  const actionButtons = (formDataModal: HearingCalendarFormData | TaskCalendarFormData) =>
    type === CALENDAR_TYPES.HEARING_CALENDAR
      ? tableActionButtonsComponent(
          COMPONENT_STATUS_NAME.CALENDARS,
          formDataModal as HearingCalendarFormData,
          updateModalState,
          deleteModalState,
          setFormDataHc,
          setFormDataResetHc,
        )
      : tableActionButtonsComponent(
          COMPONENT_STATUS_NAME.CALENDARS,
          formDataModal as TaskCalendarFormData,
          updateModalState,
          deleteModalState,
          setFormDataTc,
          setFormDataResetTc,
        )

  const hearingCalendarsTable = () => (
    <CalendarTable
      calendarType={CALENDAR_TYPES.HEARING_CALENDAR}
      calendarsList={
        !(courtCaseId && selectedCourtCase) ? hearingCalendarsList : selectedCourtCase.hearingCalendars || []
      }
      actionButtons={actionButtons}
      addModalState={addModalState}
      softDeleteCallback={getCalendarsWithMetadata}
      courtCasesList={courtCasesList}
      filingsList={filingsList}
      componentStatusList={calendarStatusList()}
      selectedCourtCase={!(courtCaseId && selectedCourtCase) ? undefined : selectedCourtCase}
      hearingTypesList={refTypes.hearingType}
    />
  )

  const getTaskCalendarsList = (taskCalendarsList: TaskCalendarSchema[]) => {
    if (getNumber(courtCaseId) > 0) {
      return taskCalendarsList.filter((taskCalendar) => {
        return (
          taskCalendar.hearingCalendar?.courtCaseId === courtCaseId || taskCalendar.filing?.courtCaseId === courtCaseId
        )
      })
    }
    return taskCalendarsList
  }

  const taskCalendarsTable = () => (
    <CalendarTable
      calendarType={CALENDAR_TYPES.TASK_CALENDAR}
      calendarsList={
        !(filingId && selectedFiling) ? getTaskCalendarsList(taskCalendarsList) : selectedFiling.taskCalendars || []
      }
      actionButtons={actionButtons}
      addModalState={addModalState}
      softDeleteCallback={getCalendarsWithMetadata}
      courtCasesList={courtCasesList}
      filingsList={filingsList}
      componentStatusList={calendarStatusList()}
      selectedCourtCase={!(courtCaseId && selectedCourtCase) ? undefined : selectedCourtCase}
      selectedFiling={!(filingId && selectedFiling) ? undefined : selectedFiling}
      taskTypesList={refTypes.taskType}
      hearingCalendarsList={hearingCalendarsList}
    />
  )

  const getCourtCaseCalendarEvents = (calendarEvents: CalendarEvents[]) => {
    if (getNumber(courtCaseId) > 0) {
      return calendarEvents.filter((calendarEvent) => calendarEvent.courtCaseId === courtCaseId)
    }
    return calendarEvents
  }

  const calendarsShowCalendarView = () => (
    <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
      <CalendarCalendar
        setType={setType}
        calendarEvents={getCourtCaseCalendarEvents(calendarEventsList)}
        setFormDataHc={setFormDataHc}
        setFormDataTc={setFormDataTc}
        setFormDataResetHc={setFormDataResetHc}
        setFormDataResetTc={setFormDataResetTc}
        addModalState={addModalState}
        updateModalState={updateModalState}
        minCalendarDate={minCalendarDate}
        maxCalendarDate={maxCalendarDate}
        hearingCalendarsList={hearingCalendarsList}
        taskCalendarsList={taskCalendarsList}
      />
    </Grid>
  )

  const calendarsShowListView = () => (
    <>
      <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
        {hearingCalendarsTable()}
      </Grid>
      <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
        {taskCalendarsTable()}
      </Grid>
    </>
  )

  const calendarViewChooser = () => <CalendarChooseView setIsShowListView={setIsShowListView} />
  const showModals = () => (
    <>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </>
  )

  return getNumber(courtCaseId) > 0 ? (
    <>
      {calendarViewChooser()}
      {isShowListView && calendarsShowListView()}
      {!isShowListView && calendarsShowCalendarView()}
      {showModals()}
    </>
  ) : getNumber(filingId) > 0 ? (
    <>
      {taskCalendarsTable()}
      {showModals()}
    </>
  ) : (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.CALENDARS)}
          <Divider orientation="vertical" flexItem />
          {calendarViewChooser()}
        </Grid>
        {isShowListView && calendarsShowListView()}
        {!isShowListView && calendarsShowCalendarView()}
      </Grid>
      {showModals()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendars)
