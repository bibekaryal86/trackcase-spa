import { SelectChangeEvent } from '@mui/material'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import React from 'react'

import { Modal2 } from './Modal'
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
  addModalState?: ModalState,
  updateModalState?: ModalState,
  deleteModalState?: ModalState,
  setFormData?: (formData: T) => void,
  setFormErrors?: (formErrorData: U) => void,
  defaultFormData?: T,
  defaultFormErrorData?: U,
) => {
  addModalState && addModalState.showModal && addModalState.toggleModalView()
  updateModalState && updateModalState.showModal && updateModalState.toggleModalView()
  deleteModalState && deleteModalState.showModal && deleteModalState.toggleModalView()
  setFormData && defaultFormData && setFormData({ ...defaultFormData })
  setFormErrors && defaultFormErrorData && setFormErrors({ ...defaultFormErrorData })
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

export const addModalComponent = <T extends FormData, U extends FormErrorData>(
  component: string,
  content: React.JSX.Element,
  primaryButtonCallback: (action: ActionTypes) => void,
  addModalState: ModalState,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
  defaultFormData: T,
  defaultFormErrorData: U,
  formDataReset: T,
) => {
  return (
    <Modal2
      open={addModalState.showModal}
      onClose={() => {
        addModalState.toggleModalView()
        setFormData({ ...defaultFormData })
      }}
      title={`${ACTION_TYPES.CREATE} ${component}`}
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
          defaultFormData,
          defaultFormErrorData,
        )
      }
      content={content}
      resetButtonText={ACTION_TYPES.RESET}
      resetButtonCallback={() =>
        resetButtonCallback(ACTION_TYPES.CREATE, setFormData, setFormErrors, formDataReset, defaultFormData, defaultFormErrorData)
      }
    />
  )
}

export const updateModalComponent = <T extends FormData, U extends FormErrorData>(
  component: string,
  content: React.JSX.Element,
  primaryButtonCallback: (action: ActionTypes) => void,
  addModalState: ModalState,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
  defaultFormData: T,
  defaultFormErrorData: U,
  formDataReset: T,
) => {
  return (
    <Modal2
      open={updateModalState.showModal}
      onClose={() => {
        updateModalState.toggleModalView()
        setFormData({ ...defaultFormData })
      }}
      title={`${ACTION_TYPES.UPDATE} ${component}`}
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
          defaultFormData,
          defaultFormErrorData,
        )
      }
      content={content}
      resetButtonText={ACTION_TYPES.RESET}
      resetButtonCallback={() =>
        resetButtonCallback(ACTION_TYPES.UPDATE, setFormData, setFormErrors, formDataReset, defaultFormData, defaultFormErrorData)
      }
    />
  )
}

export const deleteModalComponent = <T extends FormData, U extends FormErrorData>(
  component: string,
  contentText: string,
  primaryButtonCallback: (action: ActionTypes) => void,
  addModalState: ModalState,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
  defaultFormData: T,
  defaultFormErrorData: U,
  formData: T,
  formErrors: U,
) => {
  return (
    <Modal2
      open={deleteModalState.showModal}
      onClose={() => {
        deleteModalState.toggleModalView()
        setFormData({ ...defaultFormData })
      }}
      title={`${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} ${component}`}
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
          defaultFormData,
          defaultFormErrorData,
        )
      }
      contentText={contentText}
      content={hardDeleteCheckboxComponent(formData, formErrors, setFormData, setFormErrors)}
    />
  )
}
