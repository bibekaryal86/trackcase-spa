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
import { CALENDAR_OBJECT_TYPES, ID_LIST } from '../../constants'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'
import { HearingCalendarSchema, TaskCalendarSchema } from '../types/calendars.data.types'
import {
  handleCalendarDateOnChange,
  handleCalendarFormOnChange,
  isCalendarFormFieldError,
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
  const isHearingCalendar = calendarType === CALENDAR_OBJECT_TYPES.HEARING

  const calendarDate = () => {
    const label = isHearingCalendar ? 'Hearing Calendar--Date' : 'Task Calendar--Date'
    const value = 'hearingDate' in selectedCalendar ? selectedCalendar.hearingDate : selectedCalendar.taskDate
    const name = isHearingCalendar ? 'hearingDate' : 'taskDate'
    return (
      <FormDatePickerField
        componentLabel={label}
        value={value}
        onChange={(newValue) => handleCalendarDateOnChange(name, newValue, selectedCalendar, setSelectedCalendar)}
        minDate={dayjs().subtract(1, 'month')}
        maxDate={dayjs().add(1, 'year')}
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
    const label = isHearingCalendar ? 'Hearing Calendar--Type' : 'Task Calendar--Type'
    const value = 'hearingTypeId' in selectedCalendar ? selectedCalendar.hearingTypeId : selectedCalendar.taskTypeId
    const name = isHearingCalendar ? 'hearingTypeId' : 'taskTypeId'
    return (
      <FormSelectField
        componentLabel={label}
        value={value}
        onChange={(e) =>
          handleCalendarFormOnChange(name, e.target.value, selectedCalendar, setSelectedCalendar, getNumber)
        }
        menuItems={calendarHearingTaskTypesListForSelect()}
        error={isCalendarFormFieldError(name, value, undefined)}
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
    const label = isHearingCalendar ? 'Hearing Calendar--Case' : 'Task Calendar--Case'
    return (
      <FormSelectField
        componentLabel={label}
        value={selectedCalendar.courtCaseId}
        onChange={(e) =>
          handleCalendarFormOnChange('courtCaseId', e.target.value, selectedCalendar, setSelectedCalendar, getNumber)
        }
        menuItems={calendarCourtCasesListForSelect()}
        error={isCalendarFormFieldError('courtCaseId', selectedCalendar.courtCaseId, undefined)}
      />
    )
  }

  const calendarHearingCalendarListForSelect = () =>
    hearingCalendarsList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.hearingDate.toISOString()}, {x.hearingTypeId}
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
      {!isHearingCalendar && (
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
