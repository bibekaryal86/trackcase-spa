import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import {
  addModalComponent,
  deleteModalComponent,
  pageTitleComponent,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  updateModalComponent,
} from '@app/components/CommonComponents'
import { GlobalState, useGlobalDispatch } from '@app/store/redux'
import { useModal } from '@app/utils/app.hooks'
import { getNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { getCourtCases } from '@cases/actions/courtCases.action'
import { CourtCaseFormData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { getClients } from '@clients/actions/clients.action'
import { ClientSchema } from '@clients/types/clients.data.types'
import {
  ACTION_TYPES,
  ActionTypes,
  CALENDAR_TYPES,
  COMPONENT_STATUS_NAME,
  ID_DEFAULT,
  INVALID_INPUT,
} from '@constants/index'
import { getFilings } from '@filings/actions/filings.action'
import { FilingSchema } from '@filings/types/filings.data.types'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import CalendarCalendar from './CalendarCalendar'
import CalendarChooseView from './CalendarChooseView'
import { CalendarFormHc, CalendarFormTc } from './CalendarForm'
import CalendarTable from './CalendarTable'
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
import {
  isAreTwoHearingCalendarsSame,
  isAreTwoTaskCalendarsSame,
  validateHearingCalendar,
  validateTaskCalendar,
} from '../utils/calendars.utils'

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
  selectedCourtCase?: CourtCaseFormData
}

const Calendars = (props: CalendarsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useGlobalDispatch()
  const [
    addModalStateHc,
    addModalStateTc,
    updateModalStateHc,
    updateModalStateTc,
    deleteModalStateHc,
    deleteModalStateTc,
  ] = [useModal(), useModal(), useModal(), useModal(), useModal(), useModal()]

  const { calendarEventsList, hearingCalendarsList, taskCalendarsList, getCalendars } = props
  const { refTypes, getRefTypes } = props
  const { courtCasesList, getCourtCasesList } = props
  const { filingsList, getFilingsList } = props
  const { clientsList, getClientsList } = props
  const { selectedCourtCase } = props

  const minCalendarDate = dayjs().subtract(1, 'month')
  const maxCalendarDate = dayjs().add(1, 'year')

  const [isShowListView, setIsShowListView] = useState(false)
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
    if (selectedCourtCase) {
      formDataHc.courtCaseId = selectedCourtCase.id || ID_DEFAULT
    }
  }, [formDataHc, selectedCourtCase])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const getCalendarsWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getCalendars(requestMetadata)
  }

  const primaryButtonCallback = async (action: ActionTypes, type?: string) => {
    const isHc = type === CALENDAR_TYPES.HEARING_CALENDAR
    const calendarId = isHc ? getNumber(formDataHc.id) : getNumber(formDataTc.id)

    if (!isHc) {
      if (formDataTc.hearingCalendarId && formDataTc.hearingCalendarId === ID_DEFAULT) {
        formDataTc.hearingCalendarId = undefined
      } else if (formDataTc.filingId && formDataTc.filingId === ID_DEFAULT) {
        formDataTc.filingId = undefined
      }
    }

    const calendarsRequest: HearingCalendarBase | TaskCalendarBase = isHc ? { ...formDataHc } : { ...formDataTc }

    let hearingCalendarTc = undefined
    if (!isHc && getNumber(formDataTc.hearingCalendarId) > 0) {
      hearingCalendarTc = hearingCalendarsList.find((x) => x.id === formDataTc.hearingCalendarId)
    }

    const hasFormErrors = isHc
      ? validateHearingCalendar(formDataHc, setFormErrorsHc)
      : validateTaskCalendar(formDataTc, setFormErrorsTc, hearingCalendarTc)
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
        type,
        action,
        calendarsRequest: calendarsRequest,
        id: calendarId,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: isHc ? formDataHc.isHardDelete : formDataTc.isHardDelete,
      })(dispatch)
    }

    if (calendarResponse && !calendarResponse.detail) {
      isHc
        ? secondaryButtonCallback(
            addModalStateHc,
            updateModalStateHc,
            deleteModalStateHc,
            setFormDataHc,
            setFormErrorsHc,
            DefaultHearingCalendarFormData,
            DefaultHearingCalendarFormErrorData,
          )
        : secondaryButtonCallback(
            addModalStateTc,
            updateModalStateTc,
            deleteModalStateTc,
            setFormDataTc,
            setFormErrorsTc,
            DefaultTaskCalendarFormData,
            DefaultTaskCalendarFormErrorData,
          )
      isForceFetch.current = true
      calendarEventsList.length === 0 && getCalendars({})
    }
  }

  const addUpdateModalContentHc = () => (
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
        selectedCourtCase={selectedCourtCase}
      />
    </Box>
  )

  const addUpdateModalContentTc = () => (
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
        selectedCourtCase={selectedCourtCase}
      />
    </Box>
  )

  const addModalHc = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.CALENDARS,
      addUpdateModalContentHc(),
      primaryButtonCallback,
      addModalStateHc,
      updateModalStateHc,
      deleteModalStateHc,
      setFormDataHc,
      setFormErrorsHc,
      DefaultHearingCalendarFormData,
      DefaultHearingCalendarFormErrorData,
      formDataResetHc,
      CALENDAR_TYPES.HEARING_CALENDAR,
      isAreTwoHearingCalendarsSame(formDataHc, formDataResetHc),
      false,
      isAreTwoHearingCalendarsSame(formDataHc, formDataResetHc),
    )

  const addModalTc = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.CALENDARS,
      addUpdateModalContentTc(),
      primaryButtonCallback,
      addModalStateTc,
      updateModalStateTc,
      deleteModalStateTc,
      setFormDataTc,
      setFormErrorsTc,
      DefaultTaskCalendarFormData,
      DefaultTaskCalendarFormErrorData,
      formDataResetTc,
      CALENDAR_TYPES.TASK_CALENDAR,
      isAreTwoTaskCalendarsSame(formDataTc, formDataResetTc),
      false,
      isAreTwoTaskCalendarsSame(formDataTc, formDataResetTc),
    )

  const updateModalHc = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.CALENDARS,
      addUpdateModalContentHc(),
      primaryButtonCallback,
      addModalStateHc,
      updateModalStateHc,
      deleteModalStateHc,
      setFormDataHc,
      setFormErrorsHc,
      DefaultHearingCalendarFormData,
      DefaultHearingCalendarFormErrorData,
      formDataResetHc,
      CALENDAR_TYPES.HEARING_CALENDAR,
      isAreTwoHearingCalendarsSame(formDataHc, formDataResetHc),
      false,
      isAreTwoHearingCalendarsSame(formDataHc, formDataResetHc),
    )

  const updateModalTc = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.CALENDARS,
      addUpdateModalContentTc(),
      primaryButtonCallback,
      addModalStateTc,
      updateModalStateTc,
      deleteModalStateTc,
      setFormDataTc,
      setFormErrorsTc,
      DefaultTaskCalendarFormData,
      DefaultTaskCalendarFormErrorData,
      formDataResetTc,
      CALENDAR_TYPES.TASK_CALENDAR,
      isAreTwoTaskCalendarsSame(formDataTc, formDataResetTc),
      false,
      isAreTwoTaskCalendarsSame(formDataTc, formDataResetTc),
    )

  const deleteModalContextTextHc = `ARE YOU SURE YOU WANT TO ${
    formDataHc.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } CALENDAR EVENT FOR ${formDataHc.hearingDate}?!?`

  const deleteModalContextTextTc = `ARE YOU SURE YOU WANT TO ${
    formDataTc.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } CALENDAR EVENT FOR ${formDataTc.taskDate}?!?`

  const deleteModalHc = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.CALENDARS,
      deleteModalContextTextHc,
      primaryButtonCallback,
      addModalStateHc,
      updateModalStateHc,
      deleteModalStateHc,
      setFormDataHc,
      setFormErrorsHc,
      DefaultHearingCalendarFormData,
      DefaultHearingCalendarFormErrorData,
      formDataHc,
      formErrorsHc,
      CALENDAR_TYPES.HEARING_CALENDAR,
    )

  const deleteModalTc = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.CALENDARS,
      deleteModalContextTextTc,
      primaryButtonCallback,
      addModalStateTc,
      updateModalStateTc,
      deleteModalStateTc,
      setFormDataTc,
      setFormErrorsTc,
      DefaultTaskCalendarFormData,
      DefaultTaskCalendarFormErrorData,
      formDataTc,
      formErrorsTc,
      CALENDAR_TYPES.TASK_CALENDAR,
    )

  const actionButtonsHc = (formDataModal: HearingCalendarFormData | TaskCalendarFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.CALENDARS,
      formDataModal as HearingCalendarFormData,
      updateModalStateHc,
      deleteModalStateHc,
      setFormDataHc,
      setFormDataResetHc,
    )

  const actionButtonsTc = (formDataModal: TaskCalendarFormData | HearingCalendarFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.CALENDARS,
      formDataModal as TaskCalendarFormData,
      updateModalStateTc,
      deleteModalStateTc,
      setFormDataTc,
      setFormDataResetTc,
    )

  const hearingCalendarsTable = () => (
    <CalendarTable
      type={CALENDAR_TYPES.HEARING_CALENDAR}
      calendarsList={selectedCourtCase ? selectedCourtCase.hearingCalendars || [] : hearingCalendarsList}
      actionButtons={actionButtonsHc}
      addModalState={addModalStateHc}
      softDeleteCallback={getCalendarsWithMetadata}
      courtCasesList={courtCasesList}
      filingsList={filingsList}
      componentStatusList={calendarStatusList()}
      hearingTypesList={refTypes.hearingType}
      selectedCourtCase={selectedCourtCase}
    />
  )

  const getTaskCalendarsForTable = (taskCalendarsList: TaskCalendarSchema[]) => {
    if (selectedCourtCase) {
      return taskCalendarsList.filter((taskCalendar) => {
        return (
          taskCalendar.hearingCalendar?.courtCaseId === selectedCourtCase.id ||
          taskCalendar.filing?.courtCaseId === selectedCourtCase.id
        )
      })
    }
    return taskCalendarsList
  }

  const taskCalendarsTable = () => (
    <CalendarTable
      type={CALENDAR_TYPES.TASK_CALENDAR}
      calendarsList={getTaskCalendarsForTable(taskCalendarsList)}
      actionButtons={actionButtonsTc}
      addModalState={addModalStateTc}
      softDeleteCallback={getCalendarsWithMetadata}
      courtCasesList={courtCasesList}
      filingsList={filingsList}
      componentStatusList={calendarStatusList()}
      taskTypesList={refTypes.taskType}
      hearingCalendarsList={hearingCalendarsList}
      selectedCourtCase={selectedCourtCase}
    />
  )

  const getCalendarEventsForCalendarView = (calendarEvents: CalendarEvents[]) => {
    if (selectedCourtCase) {
      return calendarEvents.filter((calendarEvent) => calendarEvent.courtCaseId === selectedCourtCase.id)
    }
    return calendarEvents
  }

  const calendarsShowCalendarView = () => (
    <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
      <CalendarCalendar
        calendarEvents={getCalendarEventsForCalendarView(calendarEventsList)}
        setFormDataHc={setFormDataHc}
        setFormDataTc={setFormDataTc}
        setFormDataResetHc={setFormDataResetHc}
        setFormDataResetTc={setFormDataResetTc}
        addModalStateHc={addModalStateHc}
        addModalStateTc={addModalStateTc}
        updateModalStateHc={updateModalStateHc}
        updateModalStateTc={updateModalStateTc}
        minCalendarDate={minCalendarDate}
        maxCalendarDate={maxCalendarDate}
        hearingCalendarsList={hearingCalendarsList}
        taskCalendarsList={taskCalendarsList}
      />
    </Grid>
  )

  const calendarsShowListView = () => (
    <>
      <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
        {hearingCalendarsTable()}
      </Grid>
      <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
        {taskCalendarsTable()}
      </Grid>
    </>
  )

  const calendarViewChooser = () => (
    <CalendarChooseView isShowListView={isShowListView} setIsShowListView={setIsShowListView} />
  )
  const showModals = () => (
    <>
      {addModalHc()}
      {addModalTc()}
      {updateModalHc()}
      {updateModalTc()}
      {deleteModalHc()}
      {deleteModalTc()}
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
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
