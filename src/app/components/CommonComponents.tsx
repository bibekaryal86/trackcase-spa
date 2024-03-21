import { SelectChangeEvent } from '@mui/material'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import React from 'react'

import { ACTION_TYPES, ActionTypes } from '../../constants'
import { AppRoleFormData, AppUserFormData, checkUserHasPermission, isSuperuser } from '../../users'
import {
  AppUserFormErrorData,
  DefaultAppUserFormData,
  DefaultAppUserFormErrorData,
} from '../../users/types/users.data.types'

type FormData = AppUserFormData | AppRoleFormData
type FormErrorData = FormData | AppUserFormErrorData
interface ModalState {
  showModal: boolean
  toggleModalView: () => void
}

export const pageTitleComponent = (title: string) => (
  <>
    <Typography component="h1" variant="h6" color="primary">
      {title}
    </Typography>
    <Divider />
  </>
)

export const tableAddButtonComponent = (component: string, addModalState: ModalState) =>
  checkUserHasPermission(component, ACTION_TYPES.CREATE) ? (
    <Button onClick={() => addModalState.toggleModalView()}>{ACTION_TYPES.CREATE} NEW</Button>
  ) : undefined

export const tableActionButtonsComponent = (
  component: string,
  formDataModal: FormData,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: FormData) => void,
  setFormDataReset: (formData: FormData) => void,
) => (
  <>
    {checkUserHasPermission(component, ACTION_TYPES.UPDATE) && (
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
    {checkUserHasPermission(component, ACTION_TYPES.DELETE) && (
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

export const secondaryButtonCallback = (
  addModalState: ModalState,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: FormData) => void,
  setFormErrors: (formData: FormData | AppUserFormErrorData) => void,
  defaultFormData: FormData,
  defaultFormErrorData: FormData | AppUserFormErrorData,
) => {
  addModalState.showModal && addModalState.toggleModalView()
  updateModalState.showModal && updateModalState.toggleModalView()
  deleteModalState.showModal && deleteModalState.toggleModalView()
  setFormData({ ...defaultFormData })
  setFormErrors({ ...defaultFormErrorData })
}

export const resetButtonCallback = (
  action: ActionTypes,
  setFormData: (formData: FormData) => void,
  setFormErrors: (formData: FormData | AppUserFormErrorData) => void,
  formDataReset: FormData,
) => {
  if (action === ACTION_TYPES.CREATE) {
    setFormData({ ...DefaultAppUserFormData })
    setFormErrors({ ...DefaultAppUserFormErrorData })
  } else if (action === ACTION_TYPES.UPDATE) {
    setFormData(formDataReset)
    setFormErrors({ ...DefaultAppUserFormErrorData })
  }
}

export const hardDeleteCheckbox = (
  formData: FormData,
  formErrors: FormErrorData,
  setFormData: (formData: FormData) => void,
  setFormErrors: (formData: FormErrorData) => void,
) =>
  isSuperuser() ? (
    <FormControlLabel
      label={
        <Typography variant="body1" fontSize="0.75rem">
          HARD DELETE [WILL DELETE PERMANENTLY, OVERRIDES RESTORE BUTTON]!
        </Typography>
      }
      control={
        <Checkbox
          name="isHardDelete"
          checked={formData.isHardDelete}
          onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        />
      }
    />
  ) : undefined

export const handleFormChange = (
  event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
  formData: FormData,
  formErrors: FormErrorData,
  setFormData: (formData: FormData) => void,
  setFormErrors: (formData: FormErrorData) => void,
) => {
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
