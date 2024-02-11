import { CalendarMonth, FormatListBulletedOutlined } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import React from 'react'

interface CalendarViewSelectorProps {
  setIsShowListView: (isShowListView: boolean) => void
}

const CalendarChooseView = (props: CalendarViewSelectorProps): React.ReactElement => {
  const { setIsShowListView } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ padding: '5px' }}>
        <Tooltip title="Calendar View">
          <CalendarMonth
            color="primary"
            sx={{ cursor: 'pointer', height: '0.75em', width: '0.75em' }}
            onClick={() => setIsShowListView(false)}
          />
        </Tooltip>
      </Box>

      <Box sx={{ padding: '5px' }}>
        <Tooltip title="List View">
          <FormatListBulletedOutlined
            color="primary"
            sx={{ cursor: 'pointer', height: '0.75em', width: '0.75em' }}
            onClick={() => setIsShowListView(true)}
          />
        </Tooltip>
      </Box>
    </Box>
  )
}

export default CalendarChooseView
