import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import {
  FetchRequestMetadata,
  FormSelectField,
  FormTextField,
  getNumber,
  GlobalState,
  handleFormChange,
  hardDeleteCheckboxComponent,
  Modal2,
  pageTitleComponent,
  resetButtonCallback,
  secondaryButtonCallback,
  Table,
  tableActionButtonsComponent,
  tableAddButtonComponent,
  useModal,
} from '../../app'
import { ACTION_TYPES, ActionTypes, REF_TYPES_REGISTRY, USER_ADMIN_REGISTRY } from '../../constants'
import { ComponentStatusSchema, getRefType } from '../../types'
import { appUsersAdmin, fetchAppUsers } from '../action/users.action'
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
    componentStatusList: refTypes.componentStatus,
  }
}

const mapDispatchToProps = {
  getRefType: () => getRefType(REF_TYPES_REGISTRY.COMPONENT_STATUS),
}

interface AppUserProps {
  componentStatusList: ComponentStatusSchema[]
  getRefType: () => void
}

const UserAdminAppUsers = (props: AppUserProps): React.ReactElement => {
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { componentStatusList, getRefType } = props

  const [appUsersList, setAppUsersList] = useState([] as AppUserSchema[])
  const [formData, setFormData] = useState(DefaultAppUserFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultAppUserFormData)
  const [formErrors, setFormErrors] = useState(DefaultAppUserFormErrorData)

  useEffect(() => {
    fetchAppUsers(dispatch).then((r) => setAppUsersList(r.data))
  }, [dispatch])

  useEffect(() => {
    componentStatusList.length === 0 && getRefType()
  }, [componentStatusList.length, getRefType])

  const fetchAppUsersWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    fetchAppUsers(dispatch, requestMetadata).then((r) => setAppUsersList(r.data))
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateAppUser(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let appUserResponse: AppUserResponse = { data: [] }
    if (action === ACTION_TYPES.CREATE) {
      const appUserRequest: AppUserRequest = { ...formData }
      appUserResponse = await (await appUsersAdmin({ action, appUserRequest }))(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const appUserRequest: AppUserRequest = { ...formData }
      appUserResponse = await (
        await appUsersAdmin({
          action: action,
          appUserRequest: appUserRequest,
          id: formData.id,
          isRestore: action === ACTION_TYPES.RESTORE,
          isHardDelete: formData.isHardDelete,
        })
      )(dispatch)
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
      action !== ACTION_TYPES.READ && fetchAppUsersWithMetadata({})
    }
  }

  const componentStatusMenuItems = () =>
    componentStatusList
      .filter((x) => x.componentName === USER_ADMIN_REGISTRY.APP_USERS)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.statusName}
        </MenuItem>
      ))

  const appUserForm = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FormTextField
        componentLabel="APP USER--EMAIL"
        name="email"
        required
        value={formData.email}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.email}
        helperText={formErrors.email}
      />
      <FormTextField
        componentLabel="APP USER--FULL NAME"
        name="fullName"
        required
        value={formData.fullName}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.fullName}
        helperText={formErrors.fullName}
      />
      <FormSelectField
        componentLabel="APP USER--STATUS"
        name="componentStatusId"
        required
        value={formData.componentStatusId}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.componentStatusId}
        helperText={formErrors.componentStatusId}
        menuItems={componentStatusMenuItems()}
      />
    </Box>
  )

  const addModal = () => (
    <Modal2
      open={addModalState.showModal}
      onClose={() => {
        addModalState.toggleModalView()
        setFormData({ ...DefaultAppUserFormData })
      }}
      title={`${ACTION_TYPES.CREATE} APP USER`}
      primaryButtonText={ACTION_TYPES.CREATE}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.CREATE)}
      secondaryButtonText={ACTION_TYPES.CANCEL}
      secondaryButtonCallback={() =>
        secondaryButtonCallback(
          addModalState,
          updateModalState,
          deleteModalState,
          setFormData,
          setFormErrors,
          DefaultAppUserFormData,
          DefaultAppUserFormErrorData,
        )
      }
      content={appUserForm()}
      resetButtonText={ACTION_TYPES.RESET}
      resetButtonCallback={() =>
        resetButtonCallback(
          ACTION_TYPES.CREATE,
          setFormData,
          setFormErrors,
          formDataReset,
          DefaultAppUserFormData,
          DefaultAppUserFormErrorData,
        )
      }
    />
  )

  const updateModal = () => {
    return (
      <Modal2
        open={updateModalState.showModal}
        onClose={() => {
          updateModalState.toggleModalView()
          setFormData({ ...DefaultAppUserFormData })
        }}
        title={`${ACTION_TYPES.UPDATE} APP USER`}
        primaryButtonText={ACTION_TYPES.UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.UPDATE)}
        secondaryButtonText={ACTION_TYPES.CANCEL}
        secondaryButtonCallback={() =>
          secondaryButtonCallback(
            addModalState,
            updateModalState,
            deleteModalState,
            setFormData,
            setFormErrors,
            DefaultAppUserFormData,
            DefaultAppUserFormErrorData,
          )
        }
        content={appUserForm()}
        resetButtonText={ACTION_TYPES.CANCEL}
        resetButtonCallback={() =>
          resetButtonCallback(
            ACTION_TYPES.UPDATE,
            setFormData,
            setFormErrors,
            formDataReset,
            DefaultAppUserFormData,
            DefaultAppUserFormErrorData,
          )
        }
      />
    )
  }

  const deleteModal = () => {
    return (
      <Modal2
        open={deleteModalState.showModal}
        onClose={() => {
          deleteModalState.toggleModalView()
          setFormData({ ...DefaultAppUserFormData })
        }}
        title={`${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} APP USER`}
        primaryButtonText={formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE}
        primaryButtonCallback={() =>
          primaryButtonCallback(formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE)
        }
        secondaryButtonText={ACTION_TYPES.CANCEL}
        secondaryButtonCallback={() =>
          secondaryButtonCallback(
            addModalState,
            updateModalState,
            deleteModalState,
            setFormData,
            setFormErrors,
            DefaultAppUserFormData,
            DefaultAppUserFormErrorData,
          )
        }
        contentText={`ARE YOU SURE YOU WANT TO ${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} ${
          formData.fullName
        }?!?`}
        content={hardDeleteCheckboxComponent(formData, formErrors, setFormData, setFormErrors)}
      />
    )
  }

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
      componentName="APP USER"
      headerData={appUsersTableHeader()}
      tableData={appUsersTableData(appUsersList, actionButtons)}
      addModelComponent={tableAddButtonComponent(USER_ADMIN_REGISTRY.APP_USERS, addModalState)}
      getSoftDeletedCallback={() => fetchAppUsersWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent('APP USERS MANAGEMENT')}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
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
