import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import Link from './Link'

const NotFound = (): React.ReactElement => {
  return (
    <Box display="block">
      <Typography variant="h4">Oops! Page Not Found!!!</Typography>
      <Typography variant="subtitle2">The Requested Page is Under Construction and Not Available!!</Typography>
      <Link text="Home!" navigateToPage="/home" />
    </Box>
  )
}

export default NotFound
