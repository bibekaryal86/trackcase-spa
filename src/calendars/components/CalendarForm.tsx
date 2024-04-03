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
import { USE_MEDIA_QUERY_INPUT } from '../../constants'
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
  calendarStatusList: ComponentStatusSchema[]
  calendarTypesList: HearingTypeSchema[] | TaskTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  isShowOneCalendar: boolean
  minCalendarDate: Dayjs
  maxCalendarDate: Dayjs
  courtCaseId?: number
}

interface CalendarFormPropsHc extends CalendarFormProps {
  formData: HearingCalendarFormData
  setFormData: (formData: HearingCalendarFormData) => void
  formErrors: HearingCalendarFormErrorData
  setFormErrors: (formErrors: HearingCalendarFormErrorData) => void
}

interface CalendarFormPropsTc extends CalendarFormProps {
  formData: TaskCalendarFormData
  setFormData: (formData: TaskCalendarFormData) => void
  formErrors: TaskCalendarFormErrorData
  setFormErrors: (formErrors: TaskCalendarFormErrorData) => void
  filingsList: FilingSchema[]
  clientsList: ClientSchema[]
  hearingCalendarList: HearingCalendarSchema[]
  filingId?: number
}

export const CalendarFormHc = (props: CalendarFormPropsHc): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, setFormData, formErrors, setFormErrors } = props
  const { calendarStatusList, calendarTypesList, courtCasesList } = props
  const { isShowOneCalendar, minCalendarDate, maxCalendarDate } = props
  const { courtCaseId } = props

  const calendarHearingDate = () => {
    return (
      <FormDatePickerField
        componentLabel="HEARING CALENDAR--HEARING DATE"
        name="hearingDate"
        value={formData.hearingDate}
        onChange={(value) =>
          handleFormDateChange('hearingDate', value, formData, formErrors, setFormData, setFormErrors)
        }
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
        helperText={formErrors.hearingDateError}
        required
      />
    )
  }

  const calendarHearingTypesListForSelect = () =>
    calendarTypesList.map((x: HearingTypeSchema) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const calendarHearingTypesList = () => {
    return (
      <FormSelectField
        componentLabel="HEARING CALENDAR--HEARING TYPE"
        name="hearingTypeId"
        value={formData.hearingTypeId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarHearingTypesListForSelect()}
        error={!!formErrors.hearingTypeError}
        helperText={formErrors.hearingTypeError}
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
        .filter((x) => formData.courtCaseId === x.id || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.client?.name}, {x.caseType?.name}
          </MenuItem>
        ))
    }
    return []
  }

  const calendarCourtCasesList = () => {
    return (
      <FormSelectField
        componentLabel="HEARING CALENDAR--COURT CASE"
        name="courtCaseId"
        value={formData.courtCaseId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarCourtCasesListForSelect()}
        error={!!formErrors.courtCaseError}
        helperText={formErrors.courtCaseError}
        required
      />
    )
  }

  const calendarStatus = () => (
    <FormSelectStatusField
      componentLabel="HEARING CALENDAR--STATUS"
      value={formData.componentStatusId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      statusList={calendarStatusList}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
    />
  )

  const calendarComments = () => (
    <FormCommentsField
      componentLabel="HEARING CALENDAR--COMMENTS"
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
        {calendarHearingDate()}
      </Grid>
      <Grid item xs={6}>
        {calendarHearingTypesList()}
      </Grid>
      <Grid item xs={6}>
        {calendarCourtCasesList()}
      </Grid>
      <Grid item xs={6}>
        {calendarStatus()}
      </Grid>
      <Grid item xs={12}>
        {calendarComments()}
      </Grid>
    </GridFormWrapper>
  )
}

export const CalendarFormTc = (props: CalendarFormPropsTc): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, setFormData, formErrors, setFormErrors } = props
  const { calendarStatusList, calendarTypesList, courtCasesList, filingsList, clientsList, hearingCalendarList } = props
  const { isShowOneCalendar, minCalendarDate, maxCalendarDate } = props
  const { filingId, courtCaseId } = props

  const calendarTaskDate = () => {
    return (
      <FormDatePickerField
        componentLabel="TASK CALENDAR--TASK DATE"
        name="taskDate"
        value={formData.taskDate}
        onChange={(value) => handleFormDateChange('taskDate', value, formData, formErrors, setFormData, setFormErrors)}
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
        helperText={formErrors.taskDateError}
        required
      />
    )
  }

  const calendarDueDate = () => {
    return (
      <FormDatePickerField
        componentLabel="TASK CALENDAR--DUE DATE"
        name="dueDate"
        value={formData.dueDate}
        onChange={(value) => handleFormDateChange('dueDate', value, formData, formErrors, setFormData, setFormErrors)}
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
        helperText={formErrors.dueDateError}
        required
      />
    )
  }

  const calendarTaskTypesListForSelect = () =>
    calendarTypesList.map((x: TaskTypeSchema) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const calendarTaskTypesList = () => {
    return (
      <FormSelectField
        componentLabel="TASK CALENDAR--TASK TYPE"
        name="taskTypeId"
        value={formData.taskTypeId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarTaskTypesListForSelect()}
        error={!!formErrors.taskTypeError}
        helperText={formErrors.taskTypeError}
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
        .filter((x) => formData.hearingCalendarId === x.id || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {calendarHearingCalendarForSelect(x)}
          </MenuItem>
        ))
    }
    return []
  }

  const calendarHearingCalendarList = () => {
    const filingId = getNumber(formData.filingId)
    return (
      <FormSelectField
        componentLabel="TASK CALENDAR--HEARING CALENDAR"
        name="hearingCalendarId"
        value={getNumber(formData.hearingCalendarId)}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarHearingCalendarListForSelect()}
        disabled={filingId > 0}
        error={!!formErrors.hearingCalendarError}
        helperText={formErrors.hearingCalendarError}
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
      const selectedFilings = filingsList.filter((x) => x.courtCaseId === getNumber(courtCaseId))
      return selectedFilings
        .filter((x) => formData.filingId === x.id || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {calendarFilingForSelect(x)}
          </MenuItem>
        ))
    } else {
      return filingsList
        .filter((x) => formData.filingId === x.id || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {calendarFilingForSelect(x)}
          </MenuItem>
        ))
    }
    return []
  }

  const calendarFilingList = () => {
    const hearingCalendarId = getNumber(formData.hearingCalendarId)
    return (
      <FormSelectField
        componentLabel="TASK CALENDAR--FILING"
        name="filingId"
        value={getNumber(formData.filingId)}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={calendarFilingListForSelect()}
        disabled={hearingCalendarId > 0}
        error={!!formErrors.filingError}
        helperText={formErrors.filingError}
      />
    )
  }

  const calendarStatus = () => (
    <FormSelectStatusField
      componentLabel="TASK CALENDAR--STATUS"
      value={formData.componentStatusId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      statusList={calendarStatusList}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
    />
  )

  const calendarComments = () => (
    <FormCommentsField
      componentLabel="TASK CALENDAR--COMMENTS"
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
        {calendarTaskDate()}
      </Grid>
      <Grid item xs={6}>
        {calendarDueDate()}
      </Grid>
      <Grid item xs={6}>
        {calendarTaskTypesList()}
      </Grid>
      <Grid item xs={6}>
        {calendarHearingCalendarList()}
      </Grid>
      <Grid item xs={6}>
        {calendarFilingList()}
      </Grid>
      <Grid item xs={6}>
        {calendarStatus()}
      </Grid>
      <Grid item xs={12}>
        {calendarComments()}
      </Grid>
    </GridFormWrapper>
  )
}
