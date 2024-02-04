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
  getNumber,
  getString,
  GridFormWrapper,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ID_LIST } from '../../constants'
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
  calendarTypesList: HearingTypeSchema[] | TaskTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  hearingCalendarsList: HearingCalendarSchema[]
  setSelectedCalendar: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  calendarStatusList: string[]
  isShowOneCalendar: boolean
}

const CalendarForm = (props: CalendarFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const { calendarType, selectedCalendar, setSelectedCalendar, calendarTypesList, isShowOneCalendar } = props
  const { courtCasesList, hearingCalendarsList, calendarStatusList } = props
  const isHearingCalendarForm = isHearingCalendar(calendarType)

  const calendarDate = () => {
    const label = isHearingCalendarForm ? 'Hearing Calendar--Calendar Date' : 'Task Calendar--Calendar Date'
    const value = 'hearingDate' in selectedCalendar ? selectedCalendar.hearingDate : selectedCalendar.taskDate
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

  const calendarHearingTaskTypesListForSelect = () =>
    calendarTypesList.map((x: HearingTypeSchema | TaskTypeSchema) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const calendarHearingTaskTypesList = () => {
    const label = isHearingCalendarForm ? 'Hearing Calendar--Calendar Type' : 'Task Calendar--Calendar Type'
    const value = 'hearingTypeId' in selectedCalendar ? selectedCalendar.hearingTypeId : selectedCalendar.taskTypeId
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
        {x.clientId}, {x.caseTypeId}
      </MenuItem>
    ))

  const calendarCourtCasesList = () => {
    const label = isHearingCalendarForm ? 'Hearing Calendar--Client Case' : 'Task Calendar--Client Case'
    return (
      <FormSelectField
        componentLabel={label}
        value={selectedCalendar.courtCaseId}
        onChange={(e) =>
          handleCalendarFormOnChange('courtCaseId', e.target.value, selectedCalendar, setSelectedCalendar, getNumber)
        }
        menuItems={calendarCourtCasesListForSelect()}
        error={isCalendarFormFieldError('courtCaseId', selectedCalendar.courtCaseId, undefined)}
        required
      />
    )
  }

  const calendarHearingCalendarListForSelect = () =>
    hearingCalendarsList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.hearingDate?.toISOString()}, {x.hearingTypeId}
      </MenuItem>
    ))

  const calendarHearingCalendarList = () => {
    const value =
      'hearingCalendarId' in selectedCalendar
        ? selectedCalendar.hearingCalendarId
          ? selectedCalendar.hearingCalendarId
          : ID_LIST
        : ID_LIST
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
      <Grid item xs={6}>
        {calendarHearingTaskTypesList()}
      </Grid>
      <Grid item xs={6}>
        {calendarCourtCasesList()}
      </Grid>
      {!isHearingCalendarForm && (
        <Grid item xs={4}>
          {calendarHearingCalendarList()}
        </Grid>
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
