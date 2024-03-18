import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'

const UserAdminAppRoles = (): React.ReactElement => {
  const userAdminAppRolesTitle = () => (
    <>
      <Typography component="h1" variant="h6" color="primary">
        App Roles Management
      </Typography>
      <Divider />
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {userAdminAppRolesTitle()}
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserAdminAppRoles
