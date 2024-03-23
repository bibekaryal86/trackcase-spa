import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  addUpdateModalComponent,
  deleteModalComponent,
  FetchRequestMetadata,
  FormTextField,
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
import { appPermissionsAdmin, getAppPermissions } from '../action/users.action'
import {
  AppPermissionFormData,
  AppPermissionResponse,
  AppPermissionSchema,
  DefaultAppPermissionFormData,
} from '../types/users.data.types'
import { appPermissionsTableData, appPermissionsTableHeader, validateAppPermission } from '../utils/users.utils'

const UserAdminAppPermissions = (): React.ReactElement => {
  const dispatch = useDispatch()
  const [addUpdateModalState, deleteModalState] = [useModal(), useModal()]

  const [appPermissionsList, setAppPermissionsList] = useState([] as AppPermissionSchema[])
  const [formData, setFormData] = useState(DefaultAppPermissionFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultAppPermissionFormData)
  const [formErrors, setFormErrors] = useState(DefaultAppPermissionFormData)

  const componentName = USER_ADMIN_REGISTRY.APP_PERMISSIONS
  const componentNameNoUnderscore = componentName.replace('_', ' ')

  useEffect(() => {
    getAppPermissions(dispatch).then((r) => setAppPermissionsList(r.data))
  }, [dispatch])

  const getAppPermissionsWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getAppPermissions(dispatch, requestMetadata).then((r) => setAppPermissionsList(r.data))
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateAppPermission(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let appPermissionResponse: AppPermissionResponse = { data: [] }
    if (action === ACTION_TYPES.CREATE) {
      const appPermissionRequest: AppPermissionSchema = { ...formData }
      appPermissionResponse = await (await appPermissionsAdmin({ action, appPermissionRequest }))(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const appPermissionRequest: AppPermissionSchema = { ...formData }
      appPermissionResponse = await (
        await appPermissionsAdmin({
          action: action,
          appPermissionRequest: appPermissionRequest,
          id: formData.id,
          isRestore: action === ACTION_TYPES.RESTORE,
          isHardDelete: formData.isHardDelete,
        })
      )(dispatch)
    }

    if (appPermissionResponse && !appPermissionResponse.detail) {
      secondaryButtonCallback(
        addUpdateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultAppPermissionFormData,
        DefaultAppPermissionFormData,
      )
      action !== ACTION_TYPES.READ && getAppPermissionsWithMetadata({})
    }
  }

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FormTextField
        componentLabel="APP PERMISSION--NAME"
        name="name"
        required
        value={formData.name}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.name}
        helperText={formErrors.name}
      />
      <FormTextField
        componentLabel="APP PERMISSION--DESCRIPTION"
        name="description"
        required
        value={formData.description}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.description}
        helperText={formErrors.description}
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
      DefaultAppPermissionFormData,
      DefaultAppPermissionFormData,
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
      DefaultAppPermissionFormData,
      DefaultAppPermissionFormData,
      formDataReset,
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } ${formData.name}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      componentNameNoUnderscore,
      deleteModalContextText,
      primaryButtonCallback,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppPermissionFormData,
      DefaultAppPermissionFormData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: AppPermissionFormData) =>
    tableActionButtonsComponent(
      USER_ADMIN_REGISTRY.APP_PERMISSIONS,
      formDataModal,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const appPermissionTable = () => (
    <Table
      componentName={componentNameNoUnderscore}
      headerData={appPermissionsTableHeader()}
      tableData={appPermissionsTableData(appPermissionsList, actionButtons)}
      addModelComponent={tableAddButtonComponent(USER_ADMIN_REGISTRY.APP_PERMISSIONS, addUpdateModalState)}
      getSoftDeletedCallback={() => getAppPermissionsWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent('APP PERMISSIONS MANAGEMENT')}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {appPermissionTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default UserAdminAppPermissions
