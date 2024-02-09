import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'
import React, { SyntheticEvent } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, DateLocalizer, dayjsLocalizer, Formats, Navigate, SlotInfo, ToolbarProps } from 'react-big-calendar'

import { getDayjs } from '../../app'
import { USE_MEDIA_QUERY_INPUT } from '../../constants'

interface CustomToolbarProps extends ToolbarProps {
  isSmallScreen: boolean
}

interface CustomDateHeaderProps {
  date: Date
  label: string
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
    .rbc-month-row {
        cursor: pointer;
    }
  .rbc-off-range-bg {
    background: ${({ theme }) => theme.palette.action.selected};
    cursor: default;
  }
    .rbc-off-range {
    cursor: default;
  }
  .rbc-today {
    background: ${({ theme }) => (theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : '#eaf6ff')};
  }
  .rbc-now {
    .rbc-button-link {
      color: ${({ theme }) => (theme.palette.mode === 'dark' ? 'palevioletred' : 'red')};
      font-weight: bolder;
    }
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

const CustomDateHeader: React.FC<CustomDateHeaderProps> = ({ date, label, onClick }) => {
  const handleClick = () => {
    onClick(date)
  }

  return (
    <div className="custom-month-date-header" onClick={handleClick}>
      {label}
    </div>
  )
}

const CalendarView = (): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)

  // this function is created to disable navigating to day view when date is clicked
  // so this function doesn't return or execute anything further
  const disableDateClickNavigate = (date: Date) => {
    console.log('Click on Date Text Disabled: ', date)
    return
  }

  const components: Partial<{
    toolbar: (toolbarProps: ToolbarProps<Event>) => React.ReactElement
    month: {
      dateHeader: (props: { date: Date; label: string }) => React.ReactElement
    }
  }> = {
    toolbar: (toolbarProps) => <CustomToolbar isSmallScreen={isSmallScreen} {...toolbarProps} />,
    month: {
      dateHeader: (props) => <CustomDateHeader {...props} onClick={disableDateClickNavigate} />,
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
    const selectedSlotDate = getDayjs(slot.slots[0])?.month()
    const currentMonth = dayjs().month()
    if (selectedSlotDate !== currentMonth) {
      console.log('Month not same as currently selected, returning...')
      return
    } else {
      console.log('Same month, proceed...')
    }
    return
  }

  const onSelectEvent = (event: object, e: SyntheticEvent<HTMLElement, Event>) => {
    console.log('Selected event:', event)
    console.log('Synthetic event: ', e)
    return
  }

  return (
    <div>
      <RbcCalendar
        localizer={globalLocalizer}
        defaultDate={dayjs().toDate()}
        defaultView="month"
        events={[]}
        startAccessor={startAccessor}
        endAccessor={endAccessor}
        popup={true}
        selectable={true}
        style={{ height: '100vh' }}
        components={components}
        formats={formats}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
      />
    </div>
  )
}

export default CalendarView
