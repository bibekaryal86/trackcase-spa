import { Tab, Tabs } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useState } from 'react'

import { convertToTitleCase } from '@app/utils/app.utils'
import { USER_ADMIN_REGISTRY } from '@constants/index'

import UserAdminAppPermissions from './UserAdminAppPermissions'
import UserAdminAppRoles from './UserAdminAppRoles'
import UserAdminAppRolesPermissions from './UserAdminAppRolesPermissions'
import UserAdminAppUsers from './UserAdminAppUsers'
import UserAdminAppUsersRoles from './UserAdminAppUsersRoles'

const UserAdmin = (): React.ReactElement => {
  const [tabValue, setTabValue] = useState(USER_ADMIN_REGISTRY.APP_USERS.toString())
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => setTabValue(newValue)

  const showTabs = () => {
    return (
      <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
        <Tab
          value={USER_ADMIN_REGISTRY.APP_USERS.toString()}
          label={convertToTitleCase(USER_ADMIN_REGISTRY.APP_USERS, '_')}
        />
        <Tab
          value={USER_ADMIN_REGISTRY.APP_ROLES.toString()}
          label={convertToTitleCase(USER_ADMIN_REGISTRY.APP_ROLES, '_')}
        />
        <Tab
          value={USER_ADMIN_REGISTRY.APP_PERMISSIONS.toString()}
          label={convertToTitleCase(USER_ADMIN_REGISTRY.APP_PERMISSIONS, '_')}
        />
        <Tab
          value={USER_ADMIN_REGISTRY.APP_USERS_ROLES.toString()}
          label={convertToTitleCase(USER_ADMIN_REGISTRY.APP_USERS_ROLES, '_')}
        />
        <Tab
          value={USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS.toString()}
          label={convertToTitleCase(USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS, '_')}
        />
      </Tabs>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {showTabs()}
        </Grid>
        {tabValue === USER_ADMIN_REGISTRY.APP_USERS.toString() && (
          <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppUsers />
          </Grid>
        )}
        {tabValue === USER_ADMIN_REGISTRY.APP_ROLES.toString() && (
          <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppRoles />
          </Grid>
        )}
        {tabValue === USER_ADMIN_REGISTRY.APP_PERMISSIONS.toString() && (
          <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppPermissions />
          </Grid>
        )}
        {tabValue === USER_ADMIN_REGISTRY.APP_USERS_ROLES.toString() && (
          <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppUsersRoles />
          </Grid>
        )}
        {tabValue === USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS.toString() && (
          <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            <UserAdminAppRolesPermissions />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default UserAdmin
