import StarsIcon from '@mui/icons-material/Stars'
import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { green, grey, red } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'
import React, { SyntheticEvent, useState } from 'react'
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
} from 'react-big-calendar'

import { getDayjs, Modal } from '../../app'
import { ACTION_ADD, BUTTON_CANCEL, CALENDAR_OBJECT_TYPES, DATE_FORMAT, USE_MEDIA_QUERY_INPUT } from '../../constants'
import { HearingTypeSchema, TaskTypeSchema } from '../../types'
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
  hearingTypesList: HearingTypeSchema[]
  taskTypesList: TaskTypeSchema[]
  minCalendarDate: Dayjs
  maxCalendarDate: Dayjs
}

interface CustomToolbarProps extends ToolbarProps {
  isSmallScreen: boolean
}

interface CustomDateHeaderProps {
  date: Date
  label: string
  isOffRange: boolean
  onClick: (date: Date) => void
}

const globalLocalizer = dayjsLocalizer(dayjs)

const RbcCalendar = styled(Calendar)`
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

const RbcToolbar = styled(Box)`
  button {
    font-size: 1rem;
    color: ${({ theme }) => theme.palette.primary.main};
  }
`

const RbcButton = styled(Button)`
  && {
    font-size: 1.5rem;
  }
`

const CustomToolbar: React.FC<CustomToolbarProps> = ({ isSmallScreen, ...props }) => {
  // const goToDayView = () => props.onView('day')
  // const goToWeekView = () => props.onView('week')
  // const goToMonthView = () => props.onView('month')
  const goToBack = () => props.onNavigate(Navigate.PREVIOUS)
  const goToNext = () => props.onNavigate(Navigate.NEXT)
  const goToToday = () => props.onNavigate(Navigate.TODAY)

  return (
    <RbcToolbar className="rbc-toolbar">
      <Box
        className="rbc-toolbar-flex-box"
        display="flex"
        flexDirection={isSmallScreen ? 'column' : 'row'}
        alignItems="center"
      >
        <Box className="rbc-btn-group">
          <Button className="rbc-btn" id="rbc-btn-previous" onClick={goToBack}>
            Previous
          </Button>
        </Box>
        <Box sx={{ justifyContent: 'center' }} className="rbc-toolbar-label rbc-date">
          <RbcButton className="rbc-btn" id="rbc-btn-label" onClick={goToToday}>
            {props.label}
          </RbcButton>
        </Box>
        <Box className="rbc-btn-group">
          <Button className="rbc-btn" id="rbc-btn-next" onClick={goToNext}>
            Next
          </Button>
        </Box>
        {/*<Box className="rbc-btn-group">*/}
        {/*  <Button className="rbc-btn" id="rbc-btn-month" onClick={goToMonthView}>*/}
        {/*    Month*/}
        {/*  </Button>*/}
        {/*  <Button className="rbc-btn" id="rbc-btn-week" onClick={goToWeekView}>*/}
        {/*    Week*/}
        {/*  </Button>*/}
        {/*  <Button className="rbc-btn" id="rbc-btn-day" onClick={goToDayView}>*/}
        {/*    Day*/}
        {/*  </Button>*/}
        {/*</Box>*/}
      </Box>
    </RbcToolbar>
  )
}

const CustomDateHeader: React.FC<CustomDateHeaderProps> = ({ date, label, isOffRange, onClick }) => {
  const isToday = new Date().toDateString() === date.toDateString()
  const handleClick = () => !isOffRange && onClick(date)

  return (
    <div className="rbc-button-link" onClick={handleClick}>
      {label} {isToday && <StarsIcon fontSize="inherit" />}
    </div>
  )
}

const CalendarCalendar = (props: CalendarViewProps): React.ReactElement => {
  const { calendarEvents, setModal, setSelectedType, setSelectedCalendar, setSelectedCalendarForReset } = props
  const { minCalendarDate, maxCalendarDate } = props
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
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
    toolbar: (toolbarProps) => <CustomToolbar isSmallScreen={isSmallScreen} {...toolbarProps} />,
    month: {
      dateHeader: (dateHeaderProps) => <CustomDateHeader {...dateHeaderProps} onClick={onClickDateHeader} />,
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

  const onSelectEvent = (event: object, e: SyntheticEvent<HTMLElement, Event>) => {
    console.log('Selected event:', event)
    console.log('Synthetic event: ', e)
    return
  }

  const eventStyleGetter = (event: {
    id?: number
    calendar?: string
    type?: string
    date?: Dayjs
    title?: string
    status?: string
  }) => {
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
      <RbcCalendar
        localizer={globalLocalizer}
        defaultDate={dayjs().toDate()}
        defaultView="month"
        events={calendarEvents}
        startAccessor={startAccessor}
        endAccessor={endAccessor}
        popup={true}
        selectable={true}
        style={{ height: '100vh' }}
        components={components}
        formats={formats}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
      {showAddModal && addCalendarModal()}
    </>
  )
}

export default CalendarCalendar
