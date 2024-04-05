import { CalendarMonth, FormatListBulletedOutlined } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import React from 'react'

import { CALENDAR_EVENT_BG_COLOR } from '../utils/calendars.utils'

interface CalendarViewSelectorProps {
  isShowListView: boolean
  setIsShowListView: (isShowListView: boolean) => void
}

const CalendarChooseView = (props: CalendarViewSelectorProps): React.ReactElement => {
  const { isShowListView, setIsShowListView } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ padding: '5px' }}>
        <Tooltip title="CALENDAR VIEW">
          <CalendarMonth
            color="primary"
            sx={{ cursor: 'pointer', height: '0.75em', width: '0.75em' }}
            onClick={() => setIsShowListView(false)}
          />
        </Tooltip>
      </Box>

      <Box sx={{ padding: '5px' }}>
        <Tooltip title="LIST VIEW">
          <FormatListBulletedOutlined
            color="primary"
            sx={{ cursor: 'pointer', height: '0.75em', width: '0.75em' }}
            onClick={() => setIsShowListView(true)}
          />
        </Tooltip>
      </Box>

      {!isShowListView &&
        Array.from(CALENDAR_EVENT_BG_COLOR.entries()).map(([eventType, color]) => (
          <Box key={eventType} sx={{ padding: '5px' }}>
            <Tooltip title={eventType}>
              <Box sx={{ height: '0.75em', width: '0.75em', backgroundColor: color }} />
            </Tooltip>
          </Box>
        ))}
    </Box>
  )
}

export default CalendarChooseView
