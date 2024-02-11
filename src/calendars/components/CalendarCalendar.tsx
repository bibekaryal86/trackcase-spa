import StarsIcon from '@mui/icons-material/Stars'
import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { green, grey, red } from '@mui/material/colors'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { styled } from '@mui/material/styles'
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

import { getDayjs, getNumber, getString, Modal } from '../../app'
import {
  ACTION_ADD,
  ACTION_UPDATE,
  BUTTON_CANCEL,
  CALENDAR_OBJECT_TYPES,
  DATE_FORMAT,
  USE_MEDIA_QUERY_INPUT,
} from '../../constants'
import {
  CalendarEvents,
  DefaultCalendarSchema,
  HearingCalendarSchema,
  TaskCalendarSchema,
} from '../types/calendars.data.types'
import { getCalendarEventBgColor } from '../utils/calendars.utils'

interface CalendarViewProps {
  calendarEvents: CalendarEvents[]
  setModal: (action: string) => void
  setSelectedId: (id: number) => void
  setSelectedType: (type: string) => void
  setSelectedCalendar: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
  setSelectedCalendarForReset: (calendar: HearingCalendarSchema | TaskCalendarSchema) => void
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
  const { calendarEvents, setModal, setSelectedId, setSelectedType, setSelectedCalendar, setSelectedCalendarForReset } =
    props
  const { hearingCalendarsList, taskCalendarsList } = props
  const { minCalendarDate, maxCalendarDate } = props
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)

  const addCalendarModalCallback = (type: string) => {
    setShowAddModal(false)
    if (type === CALENDAR_OBJECT_TYPES.HEARING) {
      setSelectedCalendar({ ...DefaultCalendarSchema, hearingDate: selectedDate || dayjs() })
      setSelectedCalendarForReset({ ...DefaultCalendarSchema, hearingDate: selectedDate || dayjs() })
    } else {
      setSelectedCalendar({ ...DefaultCalendarSchema, taskDate: selectedDate || dayjs() })
      setSelectedCalendarForReset({ ...DefaultCalendarSchema, taskDate: selectedDate || dayjs() })
    }
    setSelectedType(type)
    setModal(ACTION_ADD)
  }

  const addCalendarModal = () => {
    if (selectedDate?.isBefore(minCalendarDate, 'day') || selectedDate?.isAfter(maxCalendarDate, 'day')) {
      return (
        <Modal
          isOpen={true}
          setIsOpen={setShowAddModal}
          title={'Add Calendar Event'}
          primaryButtonText={BUTTON_CANCEL}
          primaryButtonCallback={() => setShowAddModal(false)}
          contentText={`Selected Date is not within the allowed range of between ${minCalendarDate.format(
            DATE_FORMAT,
          )} and ${maxCalendarDate.format(DATE_FORMAT)} to add a new event!`}
        />
      )
    }
    return (
      <Modal
        isOpen={true}
        setIsOpen={setShowAddModal}
        title={'Add Calendar Event'}
        primaryButtonText={CALENDAR_OBJECT_TYPES.HEARING.split('_')[0]}
        primaryButtonCallback={() => addCalendarModalCallback(CALENDAR_OBJECT_TYPES.HEARING)}
        secondaryButtonText={CALENDAR_OBJECT_TYPES.TASK.split('_')[0]}
        secondaryButtonCallback={() => addCalendarModalCallback(CALENDAR_OBJECT_TYPES.TASK)}
        resetButtonText={BUTTON_CANCEL}
        resetButtonCallback={() => setShowAddModal(false)}
        contentText="Select Calendar Type to Add..."
      />
    )
  }

  const [selectedDatePickerDate, setSelectedDatePickerDate] = useState(dayjs())
  const handleDateChange = (date: Dayjs | null) => {
    console.log('in handle date change, ', date)
    setSelectedDatePickerDate(dayjs(date))
  }

  const handleConfirm = () => {
    console.log('Selected date:', selectedDatePickerDate)
    setShowDatePicker(false)
  }

  const datePickerModal = () => {
    return (
      <div>
        <Dialog open={showDatePicker} onClose={() => setShowDatePicker(false)}>
          <DialogTitle>Select Month and Year</DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                openTo="month"
                views={['year', 'month']}
                value={dayjs(selectedDatePickerDate)}
                onChange={(newDate) => handleDateChange(newDate)}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDatePicker(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  const onClickDateHeader = (date: Date) => {
    setSelectedDate(dayjs(date))
    setShowAddModal(true)
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
  // this app's events do not span multiple days, so use same date for start/end
  const endAccessor = (event: { date?: Dayjs }) => getDayjs(event.date)?.toDate() || dayjs().toDate()

  const onSelectSlot = (slot: SlotInfo) => {
    console.log('onSelectSlot is disabled, events handled with onClickDateHeader: ', slot.action)
    return
  }

  const getSelectedCalendar = (id: number, type: string) => {
    let calendar: HearingCalendarSchema | TaskCalendarSchema | undefined
    if (type === CALENDAR_OBJECT_TYPES.HEARING) {
      calendar = hearingCalendarsList.find((h) => h.id === id)
    } else if (type === CALENDAR_OBJECT_TYPES.TASK) {
      calendar = taskCalendarsList.find((t) => t.id === id)
    }
    return calendar || DefaultCalendarSchema
  }
  const onSelectEvent = (event: SelectEvent) => {
    console.log('Selected event:', event.calendar)
    const id = getNumber(event.id)
    const calendarType = getString(event.calendar)
    const calendar = getSelectedCalendar(id, calendarType)
    setSelectedId(id)
    setSelectedType(calendarType)
    setSelectedCalendar(calendar)
    setSelectedCalendarForReset(calendar)
    setModal(ACTION_UPDATE)
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
      {showAddModal && addCalendarModal()}
      {showDatePicker && datePickerModal()}
    </>
  )
}

export default CalendarCalendar
