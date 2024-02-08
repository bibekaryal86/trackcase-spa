import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import dayjs from 'dayjs'
import React from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, dayjsLocalizer, Navigate, ToolbarProps } from 'react-big-calendar'

const localizer = dayjsLocalizer(dayjs)

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

const Toolbar = (props: ToolbarProps) => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
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

const CalendarView = (): React.ReactElement => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        defaultDate={dayjs().toDate()}
        defaultView="month"
        events={[]}
        startAccessor="start"
        endAccessor="end"
        popup={true}
        style={{ height: '100vh' }}
        components={{
          toolbar: Toolbar,
        }}
      />
    </div>
  )
}

export default CalendarView
