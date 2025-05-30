import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from 'react'

import {
  addModalComponent,
  deleteModalComponent,
  handleFormChange,
  pageTitleComponent,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  tableAddButtonComponent,
  updateModalComponent,
} from '@app/components/CommonComponents'
import { FormSelectField } from '@app/components/FormFields'
import Table from '@app/components/Table'
import { useGlobalDispatch } from '@app/store/redux'
import { useModal } from '@app/utils/app.hooks'
import { getNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ACTION_TYPES, ActionTypes, USER_ADMIN_REGISTRY } from '@constants/index'

import { appRolesPermissionsAdmin, getAppRolesPermissions } from '../action/users.action'
import {
  AppRolePermissionFormData,
  AppRolePermissionResponse,
  AppRolePermissionSchema,
  DefaultAppRolePermissionFormData,
  DefaultAppRolePermissionFormErrorData,
} from '../types/users.data.types'
import {
  appRolePermissionTableData,
  appRolePermissionTableHeader,
  validateAppRolePermission,
} from '../utils/users.utils'

const UserAdminAppRolesPermissions = (): React.ReactElement => {
  const dispatch = useGlobalDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const [appRolePermissionsList, setAppRolesPermissionsList] = useState([] as AppRolePermissionSchema[])
  const [formData, setFormData] = useState(DefaultAppRolePermissionFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultAppRolePermissionFormData)
  const [formErrors, setFormErrors] = useState(DefaultAppRolePermissionFormErrorData)

  useEffect(() => {
    getAppRolesPermissions(dispatch).then((r) => setAppRolesPermissionsList(r.data))
  }, [dispatch])

  const getAppRolesPermissionsWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getAppRolesPermissions(dispatch, requestMetadata).then((r) => setAppRolesPermissionsList(r.data))
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateAppRolePermission(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let appRolePermissionResponse: AppRolePermissionResponse = { data: [] }
    if (action === ACTION_TYPES.CREATE) {
      const appRolesPermissionsRequest: AppRolePermissionSchema = { ...formData }
      appRolePermissionResponse = await appRolesPermissionsAdmin({ action, appRolesPermissionsRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const appRolesPermissionsRequest: AppRolePermissionSchema = { ...formData }
      appRolePermissionResponse = await appRolesPermissionsAdmin({
        action: action,
        appRolesPermissionsRequest: appRolesPermissionsRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (appRolePermissionResponse && !appRolePermissionResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultAppRolePermissionFormData,
        DefaultAppRolePermissionFormErrorData,
      )
      action !== ACTION_TYPES.READ && getAppRolesPermissionsWithMetadata({})
    }
  }

  const appRolesMenuItems = () =>
    appRolePermissionsList.map((x) => (
      <MenuItem key={`${x.appRoleId}-${x.appPermissionId}`} value={x.appRoleId}>
        {x.roleName}
      </MenuItem>
    ))

  const appPermissionsMenuItems = () =>
    appRolePermissionsList.map((x) => (
      <MenuItem key={`${x.appPermissionId}-${x.appRoleId}`} value={x.appPermissionId}>
        {x.permissionName}
      </MenuItem>
    ))

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FormSelectField
        componentLabel="APP ROLE PERMISSION--APP ROLE ID"
        name="appRoleId"
        required
        value={formData.appRoleId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={appRolesMenuItems()}
        error={!!formErrors.appRoleId}
        helperText={formErrors.appRoleId}
      />
      <FormSelectField
        componentLabel="APP ROLE PERMISSION--APP PERMISSION ID"
        name="appPermissionId"
        required
        value={formData.appPermissionId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        menuItems={appPermissionsMenuItems()}
        error={!!formErrors.appPermissionId}
        helperText={formErrors.appPermissionId}
      />
    </Box>
  )

  const addModal = () =>
    addModalComponent(
      USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppRolePermissionFormData,
      DefaultAppRolePermissionFormErrorData,
      formDataReset,
    )

  const updateModal = () =>
    updateModalComponent(
      USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppRolePermissionFormData,
      DefaultAppRolePermissionFormErrorData,
      formDataReset,
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } PERMISSION ${formData.permissionName} FOR ROLE ${formData.roleName}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppRolePermissionFormData,
      DefaultAppRolePermissionFormErrorData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: AppRolePermissionFormData) =>
    tableActionButtonsComponent(
      USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS,
      formDataModal,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const appRolePermissionTable = () => (
    <Table
      componentName={USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS}
      headerData={appRolePermissionTableHeader()}
      tableData={appRolePermissionTableData(appRolePermissionsList, actionButtons)}
      addModelComponent={tableAddButtonComponent(
        USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS,
        USER_ADMIN_REGISTRY.APP_ROLES_PERMISSIONS,
        addModalState,
      )}
      getSoftDeletedCallback={() => getAppRolesPermissionsWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent('APP ROLES PERMISSIONS MANAGEMENT')}
        </Grid>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {appRolePermissionTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default UserAdminAppRolesPermissions
