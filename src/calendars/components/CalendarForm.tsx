import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import dayjs from 'dayjs'
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
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ClientSchema } from '../../clients'
import { ID_LIST, USE_MEDIA_QUERY_INPUT } from '../../constants'
import { FormSchema } from '../../forms'
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
}

const CalendarForm = (props: CalendarFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { calendarType, selectedCalendar, setSelectedCalendar, calendarTypesList, isShowOneCalendar } = props
  const { courtCasesList, formsList, clientsList, calendarStatusList, hearingCalendarList } = props
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
        minDate={dayjs().subtract(1, 'month')}
        maxDate={dayjs().add(1, 'year')}
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
        minDate={dayjs().subtract(1, 'month')}
        maxDate={dayjs().add(1, 'year')}
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
        : ID_LIST
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

  const calendarCourtCasesListForSelect = () =>
    courtCasesList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.client?.name}, {x.caseType?.name}
      </MenuItem>
    ))

  const calendarCourtCasesList = () => {
    const value = 'courtCaseId' in selectedCalendar ? selectedCalendar.courtCaseId : ID_LIST
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

  const calendarHearingCalendarListForSelect = () =>
    hearingCalendarList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {calendarHearingCalendarForSelect(x)}
      </MenuItem>
    ))

  const calendarHearingCalendarList = () => {
    const value = 'hearingCalendarId' in selectedCalendar ? getNumber(selectedCalendar.hearingCalendarId) : ID_LIST
    const formId = 'formId' in selectedCalendar ? getNumber(selectedCalendar.formId) : ID_LIST
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
        disabled={formId > 0}
      />
    )
  }

  const calendarFormForSelect = (x: FormSchema) => {
    const client = clientsList.find((y) => x.courtCase?.clientId === y.id)
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    return `${client?.name}, ${courtCase?.caseType?.name} [${x.formType?.name}]`
  }

  const calendarFormListForSelect = () =>
    formsList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {calendarFormForSelect(x)}
      </MenuItem>
    ))

  const calendarFormList = () => {
    const value = 'formId' in selectedCalendar ? getNumber(selectedCalendar.formId) : ID_LIST
    const hearingCalendarId =
      'hearingCalendarId' in selectedCalendar ? getNumber(selectedCalendar.hearingCalendarId) : ID_LIST
    return (
      <FormSelectField
        componentLabel="Task Calendar--Form"
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
