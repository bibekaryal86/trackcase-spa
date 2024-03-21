import { SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import {
  FetchRequestMetadata,
  FormSelectField,
  FormTextField,
  getNumber,
  GlobalState,
  Modal2,
  Table,
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
import {
  appUsersTableData,
  appUsersTableHeader,
  checkUserHasPermission,
  isSuperuser,
  validateAppUser,
} from '../utils/users.utils'

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

  const userAdminAppUsersTitle = () => (
    <>
      <Typography component="h1" variant="h6" color="primary">
        APP USERS MANAGEMENT
      </Typography>
      <Divider />
    </>
  )

  const addButton = () =>
    checkUserHasPermission('APP_USERS', 'CREATE') ? (
      <Button onClick={() => addModalState.toggleModalView()}>{ACTION_TYPES.CREATE} NEW USER</Button>
    ) : undefined

  const actionButtons = (formDataModal: AppUserFormData) => (
    <>
      {checkUserHasPermission('APP_USERS', 'UPDATE') && (
        <Button
          onClick={() => {
            updateModalState.toggleModalView()
            setFormData(formDataModal)
            setFormDataReset(formDataModal)
          }}
          disabled={formDataModal.isDeleted}
        >
          {ACTION_TYPES.UPDATE}
        </Button>
      )}
      {checkUserHasPermission('APP_USERS', 'DELETE') && (
        <Button
          onClick={() => {
            deleteModalState.toggleModalView()
            setFormData(formDataModal)
          }}
        >
          {formDataModal.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE}
        </Button>
      )}
    </>
  )

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
      secondaryButtonCallback()
      action !== ACTION_TYPES.READ && fetchAppUsersWithMetadata({})
    }
  }

  const secondaryButtonCallback = () => {
    addModalState.showModal && addModalState.toggleModalView()
    updateModalState.showModal && updateModalState.toggleModalView()
    deleteModalState.showModal && deleteModalState.toggleModalView()
    setFormData({ ...DefaultAppUserFormData })
    setFormErrors({ ...DefaultAppUserFormErrorData })
  }

  const resetButtonCallback = (action: ActionTypes) => {
    if (action === ACTION_TYPES.CREATE) {
      setFormData({ ...DefaultAppUserFormData })
      setFormErrors({ ...DefaultAppUserFormErrorData })
    } else if (action === ACTION_TYPES.UPDATE) {
      setFormData(formDataReset)
      setFormErrors({ ...DefaultAppUserFormErrorData })
    }
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target
    let checked = false
    if ('checked' in event.target) {
      checked = event.target.checked
    }

    if (name.startsWith('is') || name.startsWith('has')) {
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
    if (name in formErrors) {
      setFormErrors({ ...formErrors, [name]: '' })
    }
  }

  const hardDeleteCheckbox = () =>
    isSuperuser() ? (
      <FormControlLabel
        label={
          <Typography variant="body1" fontSize="0.75rem">
            HARD DELETE [WILL DELETE PERMANENTLY, OVERRIDES RESTORE BUTTON]!
          </Typography>
        }
        control={<Checkbox name="isHardDelete" checked={formData.isHardDelete} onChange={handleFormChange} />}
      />
    ) : undefined

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
        onChange={handleFormChange}
        error={!!formErrors.email}
        helperText={formErrors.email}
      />
      <FormTextField
        componentLabel="APP USER--FULL NAME"
        name="fullName"
        required
        value={formData.fullName}
        onChange={handleFormChange}
        error={!!formErrors.fullName}
        helperText={formErrors.fullName}
      />
      <FormSelectField
        componentLabel="APP USER--STATUS"
        name="componentStatusId"
        required
        value={formData.componentStatusId}
        onChange={handleFormChange}
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
      secondaryButtonCallback={secondaryButtonCallback}
      content={appUserForm()}
      resetButtonText={ACTION_TYPES.RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_TYPES.CREATE)}
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
        secondaryButtonCallback={secondaryButtonCallback}
        content={appUserForm()}
        resetButtonText={ACTION_TYPES.CANCEL}
        resetButtonCallback={() => resetButtonCallback(ACTION_TYPES.UPDATE)}
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
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`ARE YOU SURE YOU WANT TO ${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} ${
          formData.fullName
        }?!?`}
        content={hardDeleteCheckbox()}
      />
    )
  }

  const appUserTable = () => (
    <Table
      componentName="APP USER"
      headerData={appUsersTableHeader()}
      tableData={appUsersTableData(appUsersList, actionButtons)}
      addModelComponent={addButton()}
      getSoftDeletedCallback={() => fetchAppUsersWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {userAdminAppUsersTitle()}
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
