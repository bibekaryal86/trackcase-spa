import StarsIcon from '@mui/icons-material/Stars'
import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { green, grey, red } from '@mui/material/colors'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  Calendar,
  DateHeaderProps,
  DateLocalizer,
  dayjsLocalizer,
  Formats,
  Navigate,
  SlotInfo,
  ToolbarProps,
  Views,
} from 'react-big-calendar'

import Modal from '@app/components/Modal'
import { ModalState } from '@app/types/app.data.types'
import { useModal } from '@app/utils/app.hooks'
import { getDayjs, getNumber, getString } from '@app/utils/app.utils'
import { ACTION_TYPES, CALENDAR_TYPES, CalendarTypes, DATE_FORMAT, USE_MEDIA_QUERY_INPUT } from '@constants/index'

import {
  CalendarEvents,
  DefaultCalendarSchema,
  DefaultHearingCalendarFormData,
  DefaultTaskCalendarFormData,
  HearingCalendarFormData,
  HearingCalendarSchema,
  TaskCalendarFormData,
  TaskCalendarSchema,
} from '../types/calendars.data.types'
import { getCalendarEventBgColor, getCalendarFormDataFromSchema } from '../utils/calendars.utils'

interface CalendarViewProps {
  calendarEvents: CalendarEvents[]
  setFormDataHc: (formData: HearingCalendarFormData) => void
  setFormDataTc: (formData: TaskCalendarFormData) => void
  setFormDataResetHc: (formData: HearingCalendarFormData) => void
  setFormDataResetTc: (formData: TaskCalendarFormData) => void
  addModalStateHc: ModalState
  updateModalStateHc: ModalState
  addModalStateTc: ModalState
  updateModalStateTc: ModalState
  minCalendarDate: Dayjs
  maxCalendarDate: Dayjs
  hearingCalendarsList: HearingCalendarSchema[]
  taskCalendarsList: TaskCalendarSchema[]
}

interface RbcToolbarProps extends ToolbarProps {
  isSmallScreen: boolean
  setShowDatePicker: (show: boolean) => void
}

interface RbcDateHeaderProps {
  date: Date
  label: string
  isOffRange: boolean
  onClick: (date: Date) => void
}

interface SelectEvent {
  id?: number
  calendar?: string
  type?: string
  date?: Dayjs
  title?: string
  status?: string
}

const globalLocalizer = dayjsLocalizer(dayjs)

const StyledRbcCalendar = styled(Calendar)`
  .rbc-calendar,
  .rbc-month-view,
  .rbc-week-view,
  .rbc-day-view {
    color: ${({ theme }) => theme.palette.primary.main};
  }
  .rbc-header {
    font-size: 100%;
  }
  .rbc-row-content {
    cursor: pointer;
  }
  .rbc-off-range-bg {
    background: ${({ theme }) => theme.palette.action.selected};
    cursor: default;
  }
  .rbc-off-range {
    .rbc-button-link {
      cursor: default;
    }
  }
  .rbc-today {
    background: inherit;
  }
`

const StyledRbcToolbar = styled(Box)`
  button {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.primary.main};
  }
`

const StyledRbcButton = styled(Button)`
  && {
    font-size: 1.5rem;
    border: 0;
  }
`

const RbcToolbar: React.FC<RbcToolbarProps> = ({ ...props }) => {
  //const goToDay = () => props.onView(Views.DAY)
  //const goToWeek = () => props.onView(Views.WEEK)
  const goToMonth = () => props.onView(Views.MONTH)
  const goToAgenda = () => props.onView(Views.AGENDA)
  const goToBack = () => props.onNavigate(Navigate.PREVIOUS)
  const goToNext = () => props.onNavigate(Navigate.NEXT)
  const goToToday = () => props.onNavigate(Navigate.TODAY)

  const selectedDateMonth = props.date.getMonth()
  const actualDateMonth = new Date().getMonth()

  return (
    <StyledRbcToolbar className="rbc-toolbar">
      <Box className="rbc-btn-group">
        <Button className="rbc-btn" id="rbc-btn-previous" onClick={goToBack}>
          Prev
        </Button>
        <Button
          className="rbc-btn"
          id="rbc-btn-today"
          onClick={goToToday}
          disabled={selectedDateMonth === actualDateMonth}
        >
          Today
        </Button>
        <Button className="rbc-btn" id="rbc-btn-next" onClick={goToNext}>
          Next
        </Button>
      </Box>
      <Box sx={{ justifyContent: 'center' }} className="rbc-toolbar-label rbc-date">
        <StyledRbcButton
          className="rbc-btn"
          id="rbc-btn-label"
          onClick={() => props.setShowDatePicker(true)}
          variant="text"
        >
          {props.label}
        </StyledRbcButton>
      </Box>
      <Box className="rbc-btn-group">
        {/*<Button className="rbc-btn" id="rbc-btn-day" onClick={goToDay}>*/}
        {/*  Day*/}
        {/*</Button>*/}
        {/*<Button className="rbc-btn" id="rbc-btn-week" onClick={goToWeek}>*/}
        {/*  Week*/}
        {/*</Button>*/}
        <Button className="rbc-btn" id="rbc-btn-month" onClick={goToMonth}>
          Month View
        </Button>
        <Button className="rbc-btn" id="rbc-btn-agenda" onClick={goToAgenda}>
          Events View
        </Button>
      </Box>
    </StyledRbcToolbar>
  )
}

const RbcDateHeader: React.FC<RbcDateHeaderProps> = ({ date, label, isOffRange, onClick }) => {
  const isToday = new Date().toDateString() === date.toDateString()
  const handleClick = () => !isOffRange && onClick(date)

  return (
    <div className="rbc-button-link" onClick={handleClick}>
      {label} {isToday && <StarsIcon fontSize="inherit" />}
    </div>
  )
}

const CalendarCalendar = (props: CalendarViewProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const calendarModal = useModal()

  const { calendarEvents } = props
  const { setFormDataHc, setFormDataTc, setFormDataResetHc, setFormDataResetTc } = props
  const { addModalStateHc, addModalStateTc, updateModalStateHc, updateModalStateTc } = props
  const { hearingCalendarsList, taskCalendarsList } = props
  const { minCalendarDate, maxCalendarDate } = props

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  //const [selectedDatePickerDate, setSelectedDatePickerDate] = useState(dayjs())

  const addCalendarModalCallback = (type: CalendarTypes) => {
    if (type === CALENDAR_TYPES.HEARING_CALENDAR) {
      setFormDataHc({ ...DefaultHearingCalendarFormData, hearingDate: selectedDate || dayjs() })
      setFormDataResetHc({ ...DefaultHearingCalendarFormData, hearingDate: selectedDate || dayjs() })
      addModalStateHc.toggleModalView()
    } else {
      setFormDataTc({ ...DefaultTaskCalendarFormData, taskDate: selectedDate || dayjs() })
      setFormDataResetTc({ ...DefaultTaskCalendarFormData, taskDate: selectedDate || dayjs() })
      addModalStateTc.toggleModalView()
    }
  }

  const addCalendarModal = () => {
    if (selectedDate?.isBefore(minCalendarDate, 'day') || selectedDate?.isAfter(maxCalendarDate, 'day')) {
      return (
        <Modal
          open={calendarModal.showModal}
          title="ADD CALENDAR EVENT"
          primaryButtonText={ACTION_TYPES.CANCEL}
          primaryButtonCallback={calendarModal.toggleModalView}
          contentText={`SELECTED DATE IS NOT WITHIN THE ALLOWED RANGE OF BETWEEN ${minCalendarDate.format(
            DATE_FORMAT,
          )} AND ${maxCalendarDate.format(DATE_FORMAT)} TO ADD A NEW EVENT!`}
          onClose={() => calendarModal.toggleModalView()}
        />
      )
    }
    return (
      <Modal
        open={calendarModal.showModal}
        title="ADD CALENDAR EVENT"
        primaryButtonText={CALENDAR_TYPES.HEARING_CALENDAR}
        primaryButtonCallback={() => addCalendarModalCallback(CALENDAR_TYPES.HEARING_CALENDAR)}
        secondaryButtonText={CALENDAR_TYPES.TASK_CALENDAR}
        secondaryButtonCallback={() => addCalendarModalCallback(CALENDAR_TYPES.TASK_CALENDAR)}
        resetButtonText={ACTION_TYPES.CANCEL}
        resetButtonCallback={() => calendarModal.toggleModalView()}
        contentText="SELECT CALENDAR TYPE TO ADD..."
        onClose={() => calendarModal.toggleModalView()}
      />
    )
  }

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(dayjs(date))
    setShowDatePicker(false)
  }

  const datePickerModal = () => {
    return (
      <div>
        <Dialog open={showDatePicker} onClose={() => setShowDatePicker(false)}>
          <DialogContent>
            <Typography variant="overline">Select year/month:</Typography>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                openTo="month"
                views={['year', 'month']}
                value={dayjs(selectedDate)}
                onChange={(newDate) => handleDateChange(newDate)}
              />
            </LocalizationProvider>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const onClickDateHeader = (date: Date) => {
    calendarModal.toggleModalView()
    setSelectedDate(dayjs(date))
  }

  const components: Partial<{
    toolbar: (toolbarProps: ToolbarProps<Event>) => React.ReactElement
    month: {
      dateHeader: (dateHeaderProps: DateHeaderProps) => React.ReactElement
    }
  }> = {
    toolbar: (toolbarProps) => (
      <RbcToolbar isSmallScreen={isSmallScreen} setShowDatePicker={setShowDatePicker} {...toolbarProps} />
    ),
    month: {
      dateHeader: (dateHeaderProps) => <RbcDateHeader {...dateHeaderProps} onClick={onClickDateHeader} />,
    },
  }

  const formats: Partial<Formats> = {
    dateFormat: (date: Date, culture: string = 'en-US', localizer: DateLocalizer = globalLocalizer) =>
      localizer.format(date, 'DD', culture),
    weekdayFormat: (date: Date, culture: string = 'en-US', localizer: DateLocalizer = globalLocalizer) =>
      localizer.format(date, isSmallScreen ? 'ddd' : 'dddd', culture),
  }

  const startAccessor = (event: { date?: Dayjs }) => getDayjs(event.date)?.toDate() || dayjs().toDate()

  const endAccessor = (event: { date?: Dayjs }) => getDayjs(event.date)?.toDate() || dayjs().toDate()

  const onSelectSlot = (slot: SlotInfo) => {
    console.log('onSelectSlot is disabled, events handled with onClickDateHeader: ', slot.action)
    return
  }

  const getSelectedCalendar = (id: number, type: CalendarTypes) => {
    let calendar: HearingCalendarSchema | TaskCalendarSchema | undefined
    if (type === CALENDAR_TYPES.HEARING_CALENDAR) {
      calendar = hearingCalendarsList.find((h) => h.id === id)
    } else if (type === CALENDAR_TYPES.TASK_CALENDAR) {
      calendar = taskCalendarsList.find((t) => t.id === id)
    }
    return calendar || DefaultCalendarSchema
  }

  const onSelectEvent = (event: SelectEvent) => {
    const id = getNumber(event.id)
    const calendarType = getString(event.calendar) as CalendarTypes
    const calendar = getSelectedCalendar(id, calendarType)
    const formData = getCalendarFormDataFromSchema(calendar)
    if (calendarType === CALENDAR_TYPES.HEARING_CALENDAR) {
      setFormDataHc(formData as HearingCalendarFormData)
      setFormDataResetHc(formData as HearingCalendarFormData)
      updateModalStateHc.toggleModalView()
    } else {
      setFormDataTc(formData as TaskCalendarFormData)
      setFormDataResetTc(formData as TaskCalendarFormData)
      updateModalStateTc.toggleModalView()
    }
    // prevent default action, return nothing
    return
  }

  const eventStyleGetter = (event: SelectEvent) => {
    return {
      style: {
        backgroundColor: getCalendarEventBgColor(event.type),
        color: event.status
          ? ['PAST_DUE'].includes(event.status)
            ? red.A700
            : ['DONE', 'PAST_DONE'].includes(event.status)
              ? green.A200
              : grey.A200
          : grey.A200,
        opacity: event.status && ['PAST_DUE', 'PAST_DONE'].includes(event.status) ? 0.7 : 1,
        fontWeight: event.status && ['PAST_DUE', 'PAST_DONE'].includes(event.status) ? 'bolder' : '',
      },
    }
  }

  return (
    <>
      <StyledRbcCalendar
        localizer={globalLocalizer}
        date={selectedDate.toDate()}
        defaultView="month"
        events={calendarEvents}
        startAccessor={startAccessor}
        endAccessor={endAccessor}
        popup={true}
        selectable={true}
        style={{ height: '75vh' }}
        components={components}
        formats={formats}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
        onNavigate={(newDate) => setSelectedDate(dayjs(newDate))}
      />
      {addCalendarModal()}
      {showDatePicker && datePickerModal()}
    </>
  )
}

export default CalendarCalendar
