import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'

const UserAdminAppPermissions = (): React.ReactElement => {
  const userAdminAppPermissionsTitle = () => (
    <>
      <Typography component="h1" variant="h6" color="primary">
        App Permissions Management
      </Typography>
      <Divider />
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {userAdminAppPermissionsTitle()}
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserAdminAppPermissions
