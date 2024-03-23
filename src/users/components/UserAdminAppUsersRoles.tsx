import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  addUpdateModalComponent,
  deleteModalComponent,
  FetchRequestMetadata,
  FormSelectField,
  getNumber,
  handleFormChange,
  pageTitleComponent,
  secondaryButtonCallback,
  Table,
  tableActionButtonsComponent,
  tableAddButtonComponent,
  useModal,
} from '../../app'
import { ACTION_TYPES, ActionTypes, USER_ADMIN_REGISTRY } from '../../constants'
import { appUsersRolesAdmin, getAppUsersRoles } from '../action/users.action'
import {
  AppUserRoleFormData,
  AppUserRoleResponse,
  AppUserRoleSchema,
  DefaultAppUserRoleFormData,
  DefaultAppUserRoleFormErrorData,
} from '../types/users.data.types'
import { appUserRoleTableData, appUserRoleTableHeader, validateAppUserRole } from '../utils/users.utils'

const UserAdminAppUsersRoles = (): React.ReactElement => {
  const dispatch = useDispatch()
  const [addUpdateModalState, deleteModalState] = [useModal(), useModal()]

  const [appUserRolesList, setAppUsersRolesList] = useState([] as AppUserRoleSchema[])
  const [formData, setFormData] = useState(DefaultAppUserRoleFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultAppUserRoleFormData)
  const [formErrors, setFormErrors] = useState(DefaultAppUserRoleFormErrorData)

  const componentName = USER_ADMIN_REGISTRY.APP_PERMISSIONS
  const componentNameNoUnderscore = componentName.replace('_', ' ')

  useEffect(() => {
    getAppUsersRoles(dispatch).then((r) => setAppUsersRolesList(r.data))
  }, [dispatch])

  const getAppUsersRolesWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getAppUsersRoles(dispatch, requestMetadata).then((r) => setAppUsersRolesList(r.data))
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateAppUserRole(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let appUserRoleResponse: AppUserRoleResponse = { data: [] }
    if (action === ACTION_TYPES.CREATE) {
      const appUserRoleRequest: AppUserRoleSchema = { ...formData }
      appUserRoleResponse = await (await appUsersRolesAdmin({ action, appUserRoleRequest }))(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const appUserRoleRequest: AppUserRoleSchema = { ...formData }
      appUserRoleResponse = await (
        await appUsersRolesAdmin({
          action: action,
          appUserRoleRequest: appUserRoleRequest,
          id: formData.id,
          isRestore: action === ACTION_TYPES.RESTORE,
          isHardDelete: formData.isHardDelete,
        })
      )(dispatch)
    }

    if (appUserRoleResponse && !appUserRoleResponse.detail) {
      secondaryButtonCallback(
        addUpdateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultAppUserRoleFormData,
        DefaultAppUserRoleFormErrorData,
      )
      action !== ACTION_TYPES.READ && getAppUsersRolesWithMetadata({})
    }
  }

  const appUsersMenuItems = () => appUserRolesList
      .map((x) => (
        <MenuItem key={x.appUserId} value={x.appUserId}>
          {x.fullName}
        </MenuItem>
      ))

  const appRolesMenuItems = () => appUserRolesList
      .map((x) => (
        <MenuItem key={x.appRoleId} value={x.appRoleId}>
          {x.roleName}
        </MenuItem>
      ))

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FormSelectField
        componentLabel="APP USER ROLE--APP USER ID"
        name="appUserId"
        required
        value={formData.appUserId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={appUsersMenuItems()}
        error={!!formErrors.appUserId}
        helperText={formErrors.appUserId}
      />
      <FormSelectField
        componentLabel="APP USER ROLE--APP ROLE ID"
        name="appRoleId"
        required
        value={formData.appRoleId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={appRolesMenuItems()}
        error={!!formErrors.appRoleId}
        helperText={formErrors.appRoleId}
      />
    </Box>
  )

  const addModal = () =>
    addUpdateModalComponent(
      ACTION_TYPES.CREATE,
      componentNameNoUnderscore,
      addUpdateModalContent(),
      primaryButtonCallback,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppUserRoleFormData,
      DefaultAppUserRoleFormErrorData,
      formDataReset,
    )

  const updateModal = () =>
    addUpdateModalComponent(
      ACTION_TYPES.UPDATE,
      componentNameNoUnderscore,
      addUpdateModalContent(),
      primaryButtonCallback,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppUserRoleFormData,
      DefaultAppUserRoleFormErrorData,
      formDataReset,
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } ${formData.appRoleId}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      componentNameNoUnderscore,
      deleteModalContextText,
      primaryButtonCallback,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppUserRoleFormData,
      DefaultAppUserRoleFormErrorData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: AppUserRoleFormData) =>
    tableActionButtonsComponent(
      USER_ADMIN_REGISTRY.APP_PERMISSIONS,
      formDataModal,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const appUserRoleTable = () => (
    <Table
      componentName={componentNameNoUnderscore}
      headerData={appUserRoleTableHeader()}
      tableData={appUserRoleTableData(appUserRolesList, actionButtons)}
      addModelComponent={tableAddButtonComponent(USER_ADMIN_REGISTRY.APP_PERMISSIONS, addUpdateModalState)}
      getSoftDeletedCallback={() => getAppUsersRolesWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent('APP USERS ROLES MANAGEMENT')}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {appUserRoleTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default UserAdminAppUsersRoles
