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
  getComments,
  getDayjsString,
  getNumber,
  getString,
  GridFormWrapper,
  StatusSchema,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ClientSchema } from '../../clients'
import { ID_DEFAULT, USE_MEDIA_QUERY_INPUT } from '../../constants'
import { FormSchema } from '../../filings'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'
import { HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'
import {
  handleCalendarDateOnChange,
  handleCalendarFormOnChange,
  isCalendarFormFieldError,
  isHearingCalendar,
} from '../utils/calendars.utils'

interface CalendarFormProps {
  calendarType: string
  selectedCalendar: HearingCalendarSchema | TaskCalendarSchema
  setSelectedCalendar: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  calendarTypesList: HearingTypeSchema[] | TaskTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  formsList: FormSchema[]
  clientsList: ClientSchema[]
  calendarStatusList: string[]
  hearingCalendarList: HearingCalendarSchema[]
  isShowOneCalendar: boolean
  minCalendarDate: Dayjs
  maxCalendarDate: Dayjs
  formId?: string
  courtCaseId?: string
  statusList: StatusSchema<string>
}

const CalendarForm = (props: CalendarFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { calendarType, selectedCalendar, setSelectedCalendar, calendarTypesList, isShowOneCalendar } = props
  const { courtCasesList, formsList, clientsList, calendarStatusList, hearingCalendarList } = props
  const { minCalendarDate, maxCalendarDate } = props
  const { formId, courtCaseId, statusList } = props
  const isHearingCalendarForm = isHearingCalendar(calendarType)

  const calendarDate = () => {
    const label = isHearingCalendarForm ? 'Hearing Calendar--Hearing Date' : 'Task Calendar--Task Date'
    const value =
      isHearingCalendarForm && 'hearingDate' in selectedCalendar
        ? selectedCalendar.hearingDate
        : !isHearingCalendarForm && 'taskDate' in selectedCalendar
        ? selectedCalendar.taskDate
        : undefined
    const name = isHearingCalendarForm ? 'hearingDate' : 'taskDate'
    return (
      <FormDatePickerField
        componentLabel={label}
        value={value}
        onChange={(newValue) => handleCalendarDateOnChange(name, newValue, selectedCalendar, setSelectedCalendar)}
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
        required
      />
    )
  }

  const calendarDueDate = () => {
    const value = !isHearingCalendarForm && 'dueDate' in selectedCalendar ? selectedCalendar.dueDate : undefined
    return (
      <FormDatePickerField
        componentLabel="Task Calendar--Due Date"
        value={value}
        onChange={(newValue) => handleCalendarDateOnChange('dueDate', newValue, selectedCalendar, setSelectedCalendar)}
        minDate={minCalendarDate}
        maxDate={maxCalendarDate}
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
    const label = isHearingCalendarForm ? 'Hearing Calendar--Hearing Type' : 'Task Calendar--Task Type'
    const value =
      isHearingCalendarForm && 'hearingTypeId' in selectedCalendar
        ? selectedCalendar.hearingTypeId
        : !isHearingCalendarForm && 'taskTypeId' in selectedCalendar
        ? selectedCalendar.taskTypeId
        : ID_DEFAULT
    const name = isHearingCalendarForm ? 'hearingTypeId' : 'taskTypeId'
    return (
      <FormSelectField
        componentLabel={label}
        value={value}
        onChange={(e) =>
          handleCalendarFormOnChange(name, e.target.value, selectedCalendar, setSelectedCalendar, getNumber)
        }
        menuItems={calendarHearingTaskTypesListForSelect()}
        error={isCalendarFormFieldError(name, value, undefined)}
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
        .filter(
          (x) =>
            ('courtCaseId' in selectedCalendar && selectedCalendar.courtCaseId === x.id) ||
            statusList.court_case.active.includes(x.status),
        )
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.client?.name}, {x.caseType?.name}
          </MenuItem>
        ))
    }
    return []
  }

  const calendarCourtCasesList = () => {
    const value = 'courtCaseId' in selectedCalendar ? selectedCalendar.courtCaseId : ID_DEFAULT
    return (
      <FormSelectField
        componentLabel="Hearing Calendar--Court Case"
        value={value}
        onChange={(e) =>
          handleCalendarFormOnChange('courtCaseId', e.target.value, selectedCalendar, setSelectedCalendar, getNumber)
        }
        menuItems={calendarCourtCasesListForSelect()}
        error={isCalendarFormFieldError('courtCaseId', value, undefined)}
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
            ('hearingCalendarId' in selectedCalendar && selectedCalendar.hearingCalendarId === x.id) ||
            statusList.calendars.active.includes(x.status),
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
    const value = 'hearingCalendarId' in selectedCalendar ? getNumber(selectedCalendar.hearingCalendarId) : ID_DEFAULT
    const tcFormId = 'formId' in selectedCalendar ? getNumber(selectedCalendar.formId) : ID_DEFAULT
    return (
      <FormSelectField
        componentLabel="Task Calendar--Hearing Calendar"
        value={value}
        onChange={(e) =>
          handleCalendarFormOnChange(
            'hearingCalendarId',
            e.target.value,
            selectedCalendar,
            setSelectedCalendar,
            getNumber,
          )
        }
        menuItems={calendarHearingCalendarListForSelect()}
        disabled={tcFormId > 0 || Number(formId) > 0}
      />
    )
  }

  const calendarFormForSelect = (x: FormSchema) => {
    const client = clientsList.find((y) => x.courtCase?.clientId === y.id)
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    return `${client?.name}, ${courtCase?.caseType?.name} [${x.formType?.name}]`
  }

  const calendarFormListForSelect = () => {
    if (getNumber(formId) > 0) {
      const selectedForm = formsList.find((x) => x.id === Number(formId))
      if (selectedForm) {
        return [
          <MenuItem key={selectedForm.id} value={selectedForm.id}>
            {calendarFormForSelect(selectedForm)}
          </MenuItem>,
        ]
      }
    } else if (getNumber(courtCaseId) > 0) {
      const selectedForms = formsList.filter((x) => x.courtCaseId === Number(courtCaseId))
      return selectedForms
        .filter(
          (x) =>
            ('formId' in selectedCalendar && selectedCalendar.formId === x.id) ||
            statusList.form.active.includes(x.status),
        )
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {calendarFormForSelect(x)}
          </MenuItem>
        ))
    } else {
      return formsList
        .filter(
          (x) =>
            ('formId' in selectedCalendar && selectedCalendar.formId === x.id) ||
            statusList.form.active.includes(x.status),
        )
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {calendarFormForSelect(x)}
          </MenuItem>
        ))
    }
    return []
  }

  const calendarFormList = () => {
    const value = 'formId' in selectedCalendar ? getNumber(selectedCalendar.formId) : ID_DEFAULT
    const hearingCalendarId =
      'hearingCalendarId' in selectedCalendar ? getNumber(selectedCalendar.hearingCalendarId) : ID_DEFAULT
    return (
      <FormSelectField
        componentLabel="Task Calendar--Filing"
        value={value}
        onChange={(e) =>
          handleCalendarFormOnChange('formId', e.target.value, selectedCalendar, setSelectedCalendar, getNumber)
        }
        menuItems={calendarFormListForSelect()}
        disabled={hearingCalendarId > 0}
      />
    )
  }

  const calendarStatus = () => (
    <FormSelectStatusField
      componentLabel="Calendar--Status"
      value={selectedCalendar.status}
      onChange={(e) =>
        handleCalendarFormOnChange('status', e.target.value, selectedCalendar, setSelectedCalendar, getString)
      }
      statusList={calendarStatusList}
      error={isCalendarFormFieldError('status', selectedCalendar.status, undefined)}
    />
  )

  const calendarComments = () => (
    <FormCommentsField
      componentLabel="Calendar--Comments"
      value={selectedCalendar.comments}
      onChange={(e) =>
        handleCalendarFormOnChange('comments', e.target.value, selectedCalendar, setSelectedCalendar, getComments)
      }
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
            {calendarFormList()}
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
