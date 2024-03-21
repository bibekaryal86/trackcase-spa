import { SelectChangeEvent } from '@mui/material'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import React from 'react'

import { ACTION_TYPES, ActionTypes } from '../../constants'
import { AppRoleFormData, AppUserFormData, checkUserHasPermission, isSuperuser } from '../../users'
import { AppUserFormErrorData } from '../../users/types/users.data.types'

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

export const tableActionButtonsComponent = <T extends FormData>(
  component: string,
  formDataModal: T,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormDataReset: (formData: T) => void,
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

export const secondaryButtonCallback = <T extends FormData, U extends FormErrorData>(
  addModalState: ModalState,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
  defaultFormData: T,
  defaultFormErrorData: U,
) => {
  addModalState.showModal && addModalState.toggleModalView()
  updateModalState.showModal && updateModalState.toggleModalView()
  deleteModalState.showModal && deleteModalState.toggleModalView()
  setFormData({ ...defaultFormData })
  setFormErrors({ ...defaultFormErrorData })
}

export const resetButtonCallback = <T extends FormData, U extends FormErrorData>(
  action: ActionTypes,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
  formDataReset: T,
  defaultFormData: T,
  defaultFormErrorData: U,
) => {
  if (action === ACTION_TYPES.CREATE) {
    setFormData({ ...defaultFormData })
    setFormErrors({ ...defaultFormErrorData })
  } else if (action === ACTION_TYPES.UPDATE) {
    setFormData(formDataReset)
    setFormErrors({ ...defaultFormErrorData })
  }
}

export const hardDeleteCheckboxComponent = <T extends FormData, U extends FormErrorData>(
  formData: T,
  formErrors: U,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
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

export const handleFormChange = <T extends FormData, U extends FormErrorData>(
  event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
  formData: T,
  formErrors: U,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
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
