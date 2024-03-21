import { SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { FetchRequestMetadata, FormTextField, getNumber, Modal2, Table, useModal } from '../../app'
import { ACTION_TYPES, ActionTypes } from '../../constants'
import { appRolesAdmin, fetchAppRoles } from '../action/users.action'
import { AppRoleFormData, AppRoleResponse, AppRoleSchema, DefaultAppRoleFormData } from '../types/users.data.types'
import {
  appRolesTableData,
  appRolesTableHeader,
  checkUserHasPermission,
  isSuperuser,
  validateAppRole,
} from '../utils/users.utils'

const UserAdminAppRoles = (): React.ReactElement => {
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const [appRolesList, setAppRolesList] = useState([] as AppRoleSchema[])
  const [formData, setFormData] = useState(DefaultAppRoleFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultAppRoleFormData)
  const [formErrors, setFormErrors] = useState(DefaultAppRoleFormData)

  useEffect(() => {
    fetchAppRoles(dispatch).then((r) => setAppRolesList(r.data))
  }, [dispatch])

  const fetchAppRolesWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    fetchAppRoles(dispatch, requestMetadata).then((r) => setAppRolesList(r.data))
  }

  const userAdminAppRolesTitle = () => (
    <>
      <Typography component="h1" variant="h6" color="primary">
        APP ROLES MANAGEMENT
      </Typography>
      <Divider />
    </>
  )

  const addButton = () =>
    checkUserHasPermission('APP_ROLES', 'CREATE') ? (
      <Button onClick={() => addModalState.toggleModalView()}>{ACTION_TYPES.CREATE} NEW ROLE</Button>
    ) : undefined

  const actionButtons = (formDataModal: AppRoleFormData) => (
    <>
      {checkUserHasPermission('APP_ROLES', 'UPDATE') && (
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
      {checkUserHasPermission('APP_ROLES', 'DELETE') && (
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
    const hasFormErrors = validateAppRole(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let appRoleResponse: AppRoleResponse = { data: [] }
    if (action === ACTION_TYPES.CREATE) {
      const appRoleRequest: AppRoleSchema = { ...formData }
      appRoleResponse = await (await appRolesAdmin({ action, appRoleRequest }))(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const appRoleRequest: AppRoleSchema = { ...formData }
      appRoleResponse = await (
        await appRolesAdmin({
          action: action,
          appRoleRequest: appRoleRequest,
          id: formData.id,
          isRestore: action === ACTION_TYPES.RESTORE,
          isHardDelete: formData.isHardDelete,
        })
      )(dispatch)
    }

    if (appRoleResponse && !appRoleResponse.detail) {
      secondaryButtonCallback()
      action !== ACTION_TYPES.READ && fetchAppRolesWithMetadata({})
    }
  }

  const secondaryButtonCallback = () => {
    addModalState.showModal && addModalState.toggleModalView()
    updateModalState.showModal && updateModalState.toggleModalView()
    deleteModalState.showModal && deleteModalState.toggleModalView()
    setFormData({ ...DefaultAppRoleFormData })
    setFormErrors({ ...DefaultAppRoleFormData })
  }

  const resetButtonCallback = (action: ActionTypes) => {
    if (action === ACTION_TYPES.CREATE) {
      setFormData({ ...DefaultAppRoleFormData })
      setFormErrors({ ...DefaultAppRoleFormData })
    } else if (action === ACTION_TYPES.UPDATE) {
      setFormData(formDataReset)
      setFormErrors({ ...DefaultAppRoleFormData })
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

  const appRoleForm = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FormTextField
        componentLabel="APP ROLE--NAME"
        name="name"
        required
        value={formData.name}
        onChange={handleFormChange}
        error={!!formErrors.name}
        helperText={formErrors.name}
      />
      <FormTextField
        componentLabel="APP ROLE--DESCRIPTION"
        name="description"
        required
        value={formData.description}
        onChange={handleFormChange}
        error={!!formErrors.description}
        helperText={formErrors.description}
      />
    </Box>
  )

  const addModal = () => (
    <Modal2
      open={addModalState.showModal}
      onClose={() => {
        addModalState.toggleModalView()
        setFormData({ ...DefaultAppRoleFormData })
      }}
      title={`${ACTION_TYPES.CREATE} APP ROLE`}
      primaryButtonText={ACTION_TYPES.CREATE}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.CREATE)}
      secondaryButtonText={ACTION_TYPES.CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      content={appRoleForm()}
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
          setFormData({ ...DefaultAppRoleFormData })
        }}
        title={`${ACTION_TYPES.UPDATE} APP ROLE`}
        primaryButtonText={ACTION_TYPES.UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.UPDATE)}
        secondaryButtonText={ACTION_TYPES.CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        content={appRoleForm()}
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
          setFormData({ ...DefaultAppRoleFormData })
        }}
        title={`${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} APP ROLE`}
        primaryButtonText={formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE}
        primaryButtonCallback={() =>
          primaryButtonCallback(formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE)
        }
        secondaryButtonText={ACTION_TYPES.CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`ARE YOU SURE YOU WANT TO ${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} ${
          formData.name
        }?!?`}
        content={hardDeleteCheckbox()}
      />
    )
  }

  const appRoleTable = () => (
    <Table
      componentName="APP ROLE"
      headerData={appRolesTableHeader()}
      tableData={appRolesTableData(appRolesList, actionButtons)}
      addModelComponent={addButton()}
      getSoftDeletedCallback={() => fetchAppRolesWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {userAdminAppRolesTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
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
