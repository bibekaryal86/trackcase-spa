import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

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
import { FormSelectField, FormTextField } from '@app/components/FormFields'
import Table from '@app/components/Table'
import { GlobalState, useGlobalDispatch } from '@app/store/redux'
import { useModal } from '@app/utils/app.hooks'
import { getNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ACTION_TYPES, ActionTypes, COMPONENT_STATUS_NAME, USER_ADMIN_REGISTRY } from '@constants/index'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import { appUsersAdmin, getAppUsers } from '../action/users.action'
import {
  AppUserFormData,
  AppUserRequest,
  AppUserResponse,
  AppUserSchema,
  DefaultAppUserFormData,
  DefaultAppUserFormErrorData,
} from '../types/users.data.types'
import { appUsersTableData, appUsersTableHeader, validateAppUser } from '../utils/users.utils'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    refTypes: refTypes,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
}

interface AppUserProps {
  refTypes: RefTypesState
  getRefTypes: () => void
}

const UserAdminAppUsers = (props: AppUserProps): React.ReactElement => {
  const dispatch = useGlobalDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { refTypes, getRefTypes } = props

  const [appUsersList, setAppUsersList] = useState([] as AppUserSchema[])
  const [formData, setFormData] = useState(DefaultAppUserFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultAppUserFormData)
  const [formErrors, setFormErrors] = useState(DefaultAppUserFormErrorData)

  useEffect(() => {
    getAppUsers(dispatch).then((r) => setAppUsersList(r.data))
  }, [dispatch])

  useEffect(() => {
    refTypes.componentStatus.length === 0 && getRefTypes()
  }, [getRefTypes, refTypes.componentStatus.length])

  const getAppUsersWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getAppUsers(dispatch, requestMetadata).then((r) => setAppUsersList(r.data))
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateAppUser(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let appUserResponse: AppUserResponse = { data: [] }
    if (action === ACTION_TYPES.CREATE) {
      const appUserRequest: AppUserRequest = { ...formData }
      appUserResponse = await appUsersAdmin({ action, appUserRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const appUserRequest: AppUserRequest = { ...formData }
      appUserResponse = await appUsersAdmin({
        action: action,
        appUserRequest: appUserRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (appUserResponse && !appUserResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultAppUserFormData,
        DefaultAppUserFormErrorData,
      )
      action !== ACTION_TYPES.READ && getAppUsersWithMetadata({})
    }
  }

  const componentStatusMenuItems = () =>
    refTypes.componentStatus
      .filter((x) => x.componentName === COMPONENT_STATUS_NAME.APP_USERS)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.statusName}
        </MenuItem>
      ))

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FormTextField
        componentLabel="APP USER--EMAIL"
        name="email"
        value={formData.email}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.email}
        helperText={formErrors.email}
        required
      />
      <FormTextField
        componentLabel="APP USER--FULL NAME"
        name="fullName"
        value={formData.fullName}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.fullName}
        helperText={formErrors.fullName}
        required
      />
      <FormSelectField
        componentLabel="APP USER--STATUS"
        name="componentStatusId"
        value={formData.componentStatusId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.componentStatusId}
        helperText={formErrors.componentStatusId}
        menuItems={componentStatusMenuItems()}
        required
      />
    </Box>
  )

  const addModal = () =>
    addModalComponent(
      USER_ADMIN_REGISTRY.APP_USERS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppUserFormData,
      DefaultAppUserFormErrorData,
      formDataReset,
    )

  const updateModal = () =>
    updateModalComponent(
      USER_ADMIN_REGISTRY.APP_USERS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppUserFormData,
      DefaultAppUserFormErrorData,
      formDataReset,
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } ${formData.fullName}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      USER_ADMIN_REGISTRY.APP_USERS,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultAppUserFormData,
      DefaultAppUserFormErrorData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: AppUserFormData) =>
    tableActionButtonsComponent(
      USER_ADMIN_REGISTRY.APP_USERS,
      formDataModal,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const appUserTable = () => (
    <Table
      componentName={USER_ADMIN_REGISTRY.APP_USERS}
      headerData={appUsersTableHeader()}
      tableData={appUsersTableData(appUsersList, actionButtons)}
      addModelComponent={tableAddButtonComponent(
        USER_ADMIN_REGISTRY.APP_USERS,
        USER_ADMIN_REGISTRY.APP_USERS,
        addModalState,
      )}
      getSoftDeletedCallback={() => getAppUsersWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent('APP USERS MANAGEMENT')}
        </Grid>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {appUserTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAdminAppUsers)
