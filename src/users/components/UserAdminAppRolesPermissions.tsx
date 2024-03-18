import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'

const UserAdminAppRolesPermissions = (): React.ReactElement => {
  const userAdminAppRolesPermissionsTitle = () => (
    <>
      <Typography component="h1" variant="h6" color="primary">
        App Roles Permissions Management
      </Typography>
      <Divider />
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {userAdminAppRolesPermissionsTitle()}
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserAdminAppRolesPermissions
