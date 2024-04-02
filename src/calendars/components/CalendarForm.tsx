import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import { Dayjs } from 'dayjs'
import React from 'react'

import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStatusField,
  getDayjsString,
  getNumber,
  GridFormWrapper,
  handleFormChange,
  handleFormDateChange,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ClientSchema } from '../../clients'
import { CALENDAR_TYPES, CalendarTypes, ID_DEFAULT, USE_MEDIA_QUERY_INPUT } from '../../constants'
import { FilingSchema } from '../../filings'
import { ComponentStatusSchema, HearingTypeSchema, TaskTypeSchema } from '../../types'
import {
  HearingCalendarFormData,
  HearingCalendarFormErrorData,
  HearingCalendarSchema,
  TaskCalendarFormData,
  TaskCalendarFormErrorData,
} from '../types/calendars.data.types'

interface CalendarFormProps {
  calendarType: CalendarTypes
  formData: HearingCalendarFormData | TaskCalendarFormData
  setFormData: (formData: HearingCalendarFormData | TaskCalendarFormData) => void
  formErrors: HearingCalendarFormErrorData | TaskCalendarFormErrorData
  setFormErrors: (formErrors: HearingCalendarFormErrorData | TaskCalendarFormErrorData) => void
  calendarStatusList: ComponentStatusSchema[]
  calendarTypesList: HearingTypeSchema[] | TaskTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  filingsList: FilingSchema[]
  clientsList: ClientSchema[]
  hearingCalendarList: HearingCalendarSchema[]
  isShowOneCalendar: boolean
  minCalendarDate: Dayjs
  maxCalendarDate: Dayjs
  filingId?: number
  courtCaseId?: number
}

const CalendarForm = (props: CalendarFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { calendarType, formData, setFormData, formErrors, setFormErrors } = props
  const { calendarStatusList, calendarTypesList, courtCasesList, filingsList, clientsList, hearingCalendarList } = props
  const { isShowOneCalendar, minCalendarDate, maxCalendarDate } = props
  const { filingId, courtCaseId } = props

  const isHearingCalendarForm = calendarType === CALENDAR_TYPES.HEARING_CALENDAR

  const calendarDate = () => {
    const label = isHearingCalendarForm ? 'HEARING CALENDAR--HEARING DATE' : 'TASK CALENDAR--TASK DATE'
    const value =
      isHearingCalendarForm && 'hearingDate' in formData
        ? formData.hearingDate
        : !isHearingCalendarForm && 'taskDate' in formData
        ? formData.taskDate
        : undefined
    const name = isHearingCalendarForm ? 'hearingDate' : 'taskDate'
    const helperText =
      isHearingCalendarForm && 'hearingDateError' in formErrors
        ? formErrors.hearingDateError
        : !isHearingCalendarForm && 'taskDateError' in formErrors
        ? formErrors.taskDateError
        : undefined
    return (
      <FormDatePickerField
        componentLabel={label}
        name={name}
        value={value}
        onChange={(value) => handleFormDateChange(name, value, formData, formErrors, setFormData, setFormErrors)}
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
        helperText={helperText}
        required
      />
    )
  }

  const calendarDueDate = () => {
    const value = !isHearingCalendarForm && 'dueDate' in formData ? formData.dueDate : undefined
    const helperText = !isHearingCalendarForm && 'dueDateError' in formErrors ? formErrors.dueDateError : undefined
    return (
      <FormDatePickerField
        componentLabel="TASK CALENDAR--DUE DATE"
        name="dueDate"
        value={value}
        onChange={(value) => handleFormDateChange('dueDate', value, formData, formErrors, setFormData, setFormErrors)}
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
        helperText={helperText}
        required
      />
    )
  }

  const calendarHearingTaskTypesListForSelect = () =>
    calendarTypesList.map((x: HearingTypeSchema | TaskTypeSchema) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const calendarHearingTaskTypesList = () => {
    const label = isHearingCalendarForm ? 'HEARING CALENDAR--HEARING TYPE' : 'TASK CALENDAR--TASK TYPE'
    const value =
      isHearingCalendarForm && 'hearingTypeId' in formData
        ? formData.hearingTypeId
        : !isHearingCalendarForm && 'taskTypeId' in formData
        ? formData.taskTypeId
        : ID_DEFAULT
    const name = isHearingCalendarForm ? 'hearingTypeId' : 'taskTypeId'
    const helperText =
      isHearingCalendarForm && 'hearingTypeError' in formErrors
        ? formErrors.hearingTypeError
        : !isHearingCalendarForm && 'taskTypeError' in formErrors
        ? formErrors.taskTypeError
        : undefined
    const error =
      isHearingCalendarForm && 'hearingTypeError' in formErrors
        ? !!formErrors.hearingTypeError
        : !isHearingCalendarForm && 'taskTypeError' in formErrors
        ? !!formErrors.taskTypeError
        : false
    return (
      <FormSelectField
        componentLabel={label}
        name={name}
        value={value}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarHearingTaskTypesListForSelect()}
        error={error}
        helperText={helperText}
        required
      />
    )
  }

  const calendarCourtCasesListForSelect = () => {
    if (getNumber(courtCaseId) > 0) {
      const selectedCourtCase = courtCasesList.find((x) => x.id === Number(courtCaseId))
      if (selectedCourtCase) {
        return [
          <MenuItem key={selectedCourtCase.id} value={selectedCourtCase.id}>
            {selectedCourtCase.client?.name}, {selectedCourtCase.caseType?.name}
          </MenuItem>,
        ]
      }
    } else {
      return courtCasesList
        .filter((x) => ('courtCaseId' in formData && formData.courtCaseId === x.id) || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.client?.name}, {x.caseType?.name}
          </MenuItem>
        ))
    }
    return []
  }

  const calendarCourtCasesList = () => {
    let value = ID_DEFAULT
    let error = false
    let helperText = undefined
    if ('courtCaseId' in formData && 'courtCaseError' in formErrors) {
      value = formData.courtCaseId
      error = !!formErrors.courtCaseError
      helperText = formErrors.courtCaseError
    }
    return (
      <FormSelectField
        componentLabel="HEARING CALENDAR--COURT CASE"
        name="courtCaseId"
        value={value}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarCourtCasesListForSelect()}
        error={error}
        helperText={helperText}
        required
      />
    )
  }

  const calendarHearingCalendarForSelect = (x: HearingCalendarSchema) => {
    const client = clientsList.find((y) => x.courtCase?.clientId === y.id)
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    return `${client?.name}, ${courtCase?.caseType?.name} [${getDayjsString(x.hearingDate)}]`
  }

  const calendarHearingCalendarListForSelect = () => {
    if (getNumber(courtCaseId) > 0) {
      const selectedHearingCalendar = hearingCalendarList.find((x) => x.courtCaseId === Number(courtCaseId))
      if (selectedHearingCalendar) {
        return [
          <MenuItem key={selectedHearingCalendar.id} value={selectedHearingCalendar.id}>
            {calendarHearingCalendarForSelect(selectedHearingCalendar)}
          </MenuItem>,
        ]
      }
    } else {
      return hearingCalendarList
        .filter(
          (x) =>
            ('hearingCalendarId' in formData && formData.hearingCalendarId === x.id) || x.componentStatus?.isActive,
        )
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {calendarHearingCalendarForSelect(x)}
          </MenuItem>
        ))
    }
    return []
  }

  const calendarHearingCalendarList = () => {
    let value = ID_DEFAULT
    let error = false
    let helperText = undefined
    if ('hearingCalendarId' in formData && 'hearingCalendarError' in formErrors) {
      value = getNumber(formData.hearingCalendarId)
      error = !!formErrors.hearingCalendarError
      helperText = formErrors.hearingCalendarError
    }
    const tcFilingId = 'filingId' in formData ? getNumber(formData.filingId) : getNumber(filingId)
    return (
      <FormSelectField
        componentLabel="TASK CALENDAR--HEARING CALENDAR"
        name="hearingCalendarId"
        value={value}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarHearingCalendarListForSelect()}
        disabled={tcFilingId > 0}
        error={error}
        helperText={helperText}
      />
    )
  }

  const calendarFilingForSelect = (x: FilingSchema) => {
    const client = clientsList.find((y) => x.courtCase?.clientId === y.id)
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    return `${client?.name}, ${courtCase?.caseType?.name} [${x.filingType?.name}]`
  }

  const calendarFilingListForSelect = () => {
    if (getNumber(filingId) > 0) {
      const selectedFiling = filingsList.find((x) => x.id === getNumber(filingId))
      if (selectedFiling) {
        return [
          <MenuItem key={selectedFiling.id} value={selectedFiling.id}>
            {calendarFilingForSelect(selectedFiling)}
          </MenuItem>,
        ]
      }
    } else if (getNumber(courtCaseId) > 0) {
      const selectedFilings = filingsList.filter((x) => x.courtCaseId === Number(courtCaseId))
      return selectedFilings
        .filter((x) => ('filingId' in formData && formData.filingId === x.id) || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {calendarFilingForSelect(x)}
          </MenuItem>
        ))
    } else {
      return filingsList
        .filter((x) => ('filingId' in formData && formData.filingId === x.id) || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {calendarFilingForSelect(x)}
          </MenuItem>
        ))
    }
    return []
  }

  const calendarFilingList = () => {
    let value = ID_DEFAULT
    let error = false
    let helperText = undefined
    if ('filingId' in formData && 'filingError' in formErrors) {
      value = getNumber(formData.filingId)
      error = !!formErrors.filingError
      helperText = formErrors.filingError
    }
    const hearingCalendarId = 'hearingCalendarId' in formData ? getNumber(formData.hearingCalendarId) : ID_DEFAULT
    return (
      <FormSelectField
        componentLabel="TASK CALENDAR--FILING"
        name="filingId"
        value={value}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarFilingListForSelect()}
        disabled={hearingCalendarId > 0}
        error={error}
        helperText={helperText}
      />
    )
  }

  const calendarStatus = () => (
    <FormSelectStatusField
      componentLabel="CALENDAR--STATUS"
      value={formData.componentStatusId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      statusList={calendarStatusList}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
    />
  )

  const calendarComments = () => (
    <FormCommentsField
      componentLabel="CALENDAR--COMMENTS"
      value={formData.comments}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
    />
  )

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneCalendar}
      justifyContent={isShowOneCalendar ? 'flex-start' : 'flex-end'}
    >
      <Grid item xs={6}>
        {calendarDate()}
      </Grid>
      {!isHearingCalendarForm && (
        <Grid item xs={6}>
          {calendarDueDate()}
        </Grid>
      )}
      <Grid item xs={6}>
        {calendarHearingTaskTypesList()}
      </Grid>
      {isHearingCalendarForm ? (
        <Grid item xs={6}>
          {calendarCourtCasesList()}
        </Grid>
      ) : (
        <>
          <Grid item xs={6}>
            {calendarHearingCalendarList()}
          </Grid>
          <Grid item xs={6}>
            {calendarFilingList()}
          </Grid>
        </>
      )}
      <Grid item xs={6}>
        {calendarStatus()}
      </Grid>
      <Grid item xs={12}>
        {calendarComments()}
      </Grid>
    </GridFormWrapper>
  )
}

export default CalendarForm
