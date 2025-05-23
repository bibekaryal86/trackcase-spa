import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
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
import { FormTextField } from '@app/components/FormFields'
import Table from '@app/components/Table'
import { useGlobalDispatch } from '@app/store/redux'
import { useModal } from '@app/utils/app.hooks'
import { getNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ACTION_TYPES, ActionTypes, USER_ADMIN_REGISTRY } from '@constants/index'

import { appPermissionsAdmin, getAppPermissions } from '../action/users.action'
import {
  AppPermissionFormData,
  AppPermissionResponse,
  AppPermissionSchema,
  DefaultAppPermissionFormData,
} from '../types/users.data.types'
import { appPermissionsTableData, appPermissionsTableHeader, validateAppPermission } from '../utils/users.utils'

const UserAdminAppPermissions = (): React.ReactElement => {
  const dispatch = useGlobalDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const [appPermissionsList, setAppPermissionsList] = useState([] as AppPermissionSchema[])
  const [formData, setFormData] = useState(DefaultAppPermissionFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultAppPermissionFormData)
  const [formErrors, setFormErrors] = useState(DefaultAppPermissionFormData)

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
      appPermissionResponse = await appPermissionsAdmin({ action, appPermissionRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const appPermissionRequest: AppPermissionSchema = { ...formData }
      appPermissionResponse = await appPermissionsAdmin({
        action: action,
        appPermissionRequest: appPermissionRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (appPermissionResponse && !appPermissionResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
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
        value={formData.name}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.name}
        helperText={formErrors.name}
        required
      />
      <FormTextField
        componentLabel="APP PERMISSION--DESCRIPTION"
        name="description"
        value={formData.description}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.description}
        helperText={formErrors.description}
        required
      />
    </Box>
  )

  const addModal = () =>
    addModalComponent(
      USER_ADMIN_REGISTRY.APP_PERMISSIONS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppPermissionFormData,
      DefaultAppPermissionFormData,
      formDataReset,
    )

  const updateModal = () =>
    updateModalComponent(
      USER_ADMIN_REGISTRY.APP_PERMISSIONS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
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
      USER_ADMIN_REGISTRY.APP_PERMISSIONS,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
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
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const appPermissionTable = () => (
    <Table
      componentName={USER_ADMIN_REGISTRY.APP_PERMISSIONS}
      headerData={appPermissionsTableHeader()}
      tableData={appPermissionsTableData(appPermissionsList, actionButtons)}
      addModelComponent={tableAddButtonComponent(
        USER_ADMIN_REGISTRY.APP_PERMISSIONS,
        USER_ADMIN_REGISTRY.APP_PERMISSIONS,
        addModalState,
      )}
      getSoftDeletedCallback={() => getAppPermissionsWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent('APP PERMISSIONS MANAGEMENT')}
        </Grid>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
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
