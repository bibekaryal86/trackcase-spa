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

import { appRolesAdmin, getAppRoles } from '../action/users.action'
import { AppRoleFormData, AppRoleResponse, AppRoleSchema, DefaultAppRoleFormData } from '../types/users.data.types'
import { appRolesTableData, appRolesTableHeader, validateAppRole } from '../utils/users.utils'

const UserAdminAppRoles = (): React.ReactElement => {
  const dispatch = useGlobalDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const [appRolesList, setAppRolesList] = useState([] as AppRoleSchema[])
  const [formData, setFormData] = useState(DefaultAppRoleFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultAppRoleFormData)
  const [formErrors, setFormErrors] = useState(DefaultAppRoleFormData)

  useEffect(() => {
    getAppRoles(dispatch).then((r) => setAppRolesList(r.data))
  }, [dispatch])

  const getAppRolesWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getAppRoles(dispatch, requestMetadata).then((r) => setAppRolesList(r.data))
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateAppRole(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let appRoleResponse: AppRoleResponse = { data: [] }
    if (action === ACTION_TYPES.CREATE) {
      const appRoleRequest: AppRoleSchema = { ...formData }
      appRoleResponse = await appRolesAdmin({ action, appRoleRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const appRoleRequest: AppRoleSchema = { ...formData }
      appRoleResponse = await appRolesAdmin({
        action: action,
        appRoleRequest: appRoleRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (appRoleResponse && !appRoleResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultAppRoleFormData,
        DefaultAppRoleFormData,
      )
      action !== ACTION_TYPES.READ && getAppRolesWithMetadata({})
    }
  }

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FormTextField
        componentLabel="APP ROLE--NAME"
        name="name"
        value={formData.name}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.name}
        helperText={formErrors.name}
        required
      />
      <FormTextField
        componentLabel="APP ROLE--DESCRIPTION"
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
      USER_ADMIN_REGISTRY.APP_ROLES,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppRoleFormData,
      DefaultAppRoleFormData,
      formDataReset,
    )

  const updateModal = () =>
    updateModalComponent(
      USER_ADMIN_REGISTRY.APP_ROLES,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppRoleFormData,
      DefaultAppRoleFormData,
      formDataReset,
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } ${formData.name}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      USER_ADMIN_REGISTRY.APP_ROLES,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppRoleFormData,
      DefaultAppRoleFormData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: AppRoleFormData) =>
    tableActionButtonsComponent(
      USER_ADMIN_REGISTRY.APP_ROLES,
      formDataModal,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const appRoleTable = () => (
    <Table
      componentName={USER_ADMIN_REGISTRY.APP_ROLES}
      headerData={appRolesTableHeader()}
      tableData={appRolesTableData(appRolesList, actionButtons)}
      addModelComponent={tableAddButtonComponent(
        USER_ADMIN_REGISTRY.APP_ROLES,
        USER_ADMIN_REGISTRY.APP_ROLES,
        addModalState,
      )}
      getSoftDeletedCallback={() => getAppRolesWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent('APP ROLES MANAGEMENT')}
        </Grid>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {appRoleTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default UserAdminAppRoles
