import { Tab, Tabs } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useState } from 'react'

import UserAdminAppPermissions from './UserAdminAppPermissions'
import UserAdminAppRoles from './UserAdminAppRoles'
import UserAdminAppRolesPermissions from './UserAdminAppRolesPermissions'
import UserAdminAppUsers from './UserAdminAppUsers'
import UserAdminAppUsersRoles from './UserAdminAppUsersRoles'
import { USER_ADMIN_TABS } from '../../constants'

const UserAdmin = (): React.ReactElement => {
  const [tabValue, setTabValue] = useState(USER_ADMIN_TABS.USERS.toString())
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => setTabValue(newValue)

  const showTabs = () => {
    return (
      <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
        <Tab value={USER_ADMIN_TABS.USERS.toString()} label={USER_ADMIN_TABS.USERS.toString()} />
        <Tab value={USER_ADMIN_TABS.ROLES.toString()} label={USER_ADMIN_TABS.ROLES.toString()} />
        <Tab value={USER_ADMIN_TABS.PERMISSIONS.toString()} label={USER_ADMIN_TABS.PERMISSIONS.toString()} />
        <Tab value={USER_ADMIN_TABS.USERS_ROLES.toString()} label={USER_ADMIN_TABS.USERS_ROLES.toString()} />
        <Tab
          value={USER_ADMIN_TABS.ROLES_PERMISSIONS.toString()}
          label={USER_ADMIN_TABS.ROLES_PERMISSIONS.toString()}
        />
      </Tabs>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {showTabs()}
        </Grid>
        {tabValue === USER_ADMIN_TABS.USERS.toString() && (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppUsers />
          </Grid>
        )}
        {tabValue === USER_ADMIN_TABS.ROLES.toString() && (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppRoles />
          </Grid>
        )}
        {tabValue === USER_ADMIN_TABS.PERMISSIONS.toString() && (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppPermissions />
          </Grid>
        )}
        {tabValue === USER_ADMIN_TABS.USERS_ROLES.toString() && (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppUsersRoles />
          </Grid>
        )}
        {tabValue === USER_ADMIN_TABS.ROLES_PERMISSIONS.toString() && (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppRolesPermissions />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default UserAdmin
