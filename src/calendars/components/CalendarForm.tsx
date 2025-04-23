import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Dayjs } from 'dayjs'
import React from 'react'

import {
  courtCasesListForSelect,
  filingListForSelect,
  handleFormChange,
  handleFormDateChange,
  hearingCalendarListForSelect,
  refTypesListForSelect,
} from '@app/components/CommonComponents'
import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStatusField,
  GridFormWrapper,
} from '@app/components/FormFields'
import { getNumber } from '@app/utils/app.utils'
import { CourtCaseFormData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ClientSchema } from '@clients/types/clients.data.types'
import { USE_MEDIA_QUERY_INPUT } from '@constants/index'
import { FilingSchema } from '@filings/types/filings.data.types'
import { ComponentStatusSchema, HearingTypeSchema, TaskTypeSchema } from '@ref_types/types/refTypes.data.types'

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
  selectedCourtCase?: CourtCaseFormData
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
}

export const CalendarFormHc = (props: CalendarFormPropsHc): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, setFormData, formErrors, setFormErrors } = props
  const { calendarStatusList, calendarTypesList, courtCasesList } = props
  const { isShowOneCalendar, minCalendarDate, maxCalendarDate } = props
  const { selectedCourtCase } = props

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

  const calendarHearingTypesList = () => {
    return (
      <FormSelectField
        componentLabel="HEARING CALENDAR--HEARING TYPE"
        name="hearingTypeId"
        value={formData.hearingTypeId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={refTypesListForSelect(calendarTypesList)}
        error={!!formErrors.hearingTypeError}
        helperText={formErrors.hearingTypeError}
        required
      />
    )
  }

  const calendarCourtCasesList = () => {
    return (
      <FormSelectField
        componentLabel="HEARING CALENDAR--COURT CASE"
        name="courtCaseId"
        value={formData.courtCaseId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={courtCasesListForSelect(courtCasesList, selectedCourtCase, formData.courtCaseId)}
        error={!!formErrors.courtCaseError}
        helperText={formErrors.courtCaseError}
        required
        disabled={!!selectedCourtCase}
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
      <Grid size={6}>{calendarHearingDate()}</Grid>
      <Grid size={6}>{calendarHearingTypesList()}</Grid>
      <Grid size={6}>{calendarCourtCasesList()}</Grid>
      <Grid size={6}>{calendarStatus()}</Grid>
      <Grid size={12}>{calendarComments()}</Grid>
    </GridFormWrapper>
  )
}

export const CalendarFormTc = (props: CalendarFormPropsTc): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, setFormData, formErrors, setFormErrors } = props
  const { calendarStatusList, calendarTypesList, courtCasesList, filingsList, clientsList, hearingCalendarList } = props
  const { isShowOneCalendar, minCalendarDate, maxCalendarDate } = props
  const { selectedCourtCase } = props

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

  const calendarTaskTypesList = () => {
    return (
      <FormSelectField
        componentLabel="TASK CALENDAR--TASK TYPE"
        name="taskTypeId"
        value={formData.taskTypeId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={refTypesListForSelect(calendarTypesList)}
        error={!!formErrors.taskTypeError}
        helperText={formErrors.taskTypeError}
        required
      />
    )
  }

  const calendarHearingCalendarList = () => {
    const filingId = getNumber(formData.filingId)
    return (
      <FormSelectField
        componentLabel="TASK CALENDAR--HEARING CALENDAR"
        name="hearingCalendarId"
        value={getNumber(formData.hearingCalendarId)}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={hearingCalendarListForSelect(
          hearingCalendarList,
          clientsList,
          courtCasesList,
          selectedCourtCase,
          formData.hearingCalendarId,
        )}
        disabled={filingId > 0}
        error={!!formErrors.hearingCalendarError}
        helperText={formErrors.hearingCalendarError}
      />
    )
  }

  const calendarFilingList = () => {
    const hearingCalendarId = getNumber(formData.hearingCalendarId)
    return (
      <FormSelectField
        componentLabel="TASK CALENDAR--FILING"
        name="filingId"
        value={getNumber(formData.filingId)}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={filingListForSelect(filingsList, clientsList, courtCasesList, selectedCourtCase, formData.filingId)}
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
      <Grid size={6}>{calendarTaskDate()}</Grid>
      <Grid size={6}>{calendarDueDate()}</Grid>
      <Grid size={6}>{calendarTaskTypesList()}</Grid>
      <Grid size={6}>{calendarHearingCalendarList()}</Grid>
      <Grid size={6}>{calendarFilingList()}</Grid>
      <Grid size={6}>{calendarStatus()}</Grid>
      <Grid size={12}>{calendarComments()}</Grid>
    </GridFormWrapper>
  )
}
