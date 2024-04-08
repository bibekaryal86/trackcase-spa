import { SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import { Dayjs } from 'dayjs'
import React from 'react'

import {
  HearingCalendarFormData,
  HearingCalendarFormErrorData,
  TaskCalendarFormData,
  TaskCalendarFormErrorData,
} from '@calendars/types/calendars.data.types'
import { CourtCaseFormData, CourtCaseFormErrorData } from '@cases/types/courtCases.data.types'
import { ClientFormData, ClientFormErrorData } from '@clients/types/clients.data.types'
import {
  CaseCollectionFormData,
  CaseCollectionFormErrorData,
  CashCollectionFormData,
  CashCollectionFormErrorData,
} from '@collections/types/collections.data.types'
import { ACTION_TYPES, ActionTypes } from '@constants/index'
import { CourtFormData, CourtFormErrorData } from '@courts/types/courts.data.types'
import { FilingFormData, FilingFormErrorData } from '@filings/types/filings.data.types'
import { JudgeFormData, JudgeFormErrorData } from '@judges/types/judges.data.types'
import { RefTypeFormData } from '@ref_types/types/refTypes.data.types'
import {
  AppPermissionFormData,
  AppRoleFormData,
  AppRolePermissionFormData,
  AppRolePermissionFormErrorData,
  AppUserFormData,
  AppUserFormErrorData,
  AppUserRoleFormData,
  AppUserRoleFormErrorData,
} from '@users/types/users.data.types'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

import Link from './Link'
import Modal from './Modal'
import { ModalState } from '../types/app.data.types'
import { getNumericOnly, isNumericOnly } from '../utils/app.utils'

type FormData =
  | AppUserFormData
  | AppRoleFormData
  | AppPermissionFormData
  | AppUserRoleFormData
  | AppRolePermissionFormData
  | RefTypeFormData
  | CourtFormData
  | JudgeFormData
  | ClientFormData
  | CourtCaseFormData
  | FilingFormData
  | HearingCalendarFormData
  | TaskCalendarFormData
  | CaseCollectionFormData
  | CashCollectionFormData

type FormErrorData =
  | FormData
  | AppUserFormErrorData
  | AppUserRoleFormErrorData
  | AppRolePermissionFormErrorData
  | CourtFormErrorData
  | JudgeFormErrorData
  | ClientFormErrorData
  | CourtCaseFormErrorData
  | FilingFormErrorData
  | HearingCalendarFormErrorData
  | TaskCalendarFormErrorData
  | CaseCollectionFormErrorData
  | CashCollectionFormErrorData

export const pageTitleComponent = (component: string, componentName?: string) => (
  <>
    <Typography component="h1" variant="h6" color="primary">
      {component}
      {componentName ? `: ${componentName}` : ''}
    </Typography>
    <Divider />
  </>
)

export const pageTopLinksComponent = (
  viewAllComponent: string,
  viewAllLink: string,
  searchQueryParams: URLSearchParams,
) => {
  const backToPageText = 'BACK TO PREV PAGE'
  const backToPageLink = searchQueryParams.get('backTo') || ''
  const viewAllText = `VIEW ALL ${viewAllComponent}`
  return (
    <Box sx={{ display: 'flex' }}>
      {backToPageLink && (
        <Box sx={{ mr: 2 }}>
          <Link text={backToPageText} navigateToPage={backToPageLink} color="primary" />
        </Box>
      )}
      <Link text={viewAllText} navigateToPage={viewAllLink} color="primary" />
    </Box>
  )
}

export const pageNotSelectedComponent = (component: string) => (
  <Typography component="h1" variant="h6" color="error" gutterBottom>
    {`ITEM NOT SELECTED! NOTHING TO DISPLAY!! GO TO ${component} PAGE AND CLICK ONE TO SELECT!!!`}
  </Typography>
)

export const pageActionButtonsComponent = <T extends FormData>(
  componentName: string,
  courtFormData: T,
  updateAction: () => void,
  cancelAction: () => void,
  isDisabled: boolean,
) => (
  <>
    {checkUserHasPermission(componentName, ACTION_TYPES.UPDATE) && (
      <Button onClick={updateAction} disabled={isDisabled || courtFormData.isDeleted}>
        {ACTION_TYPES.UPDATE}
      </Button>
    )}
    {checkUserHasPermission(componentName, ACTION_TYPES.DELETE) && (
      <Button onClick={cancelAction} disabled={isDisabled || courtFormData.isDeleted}>
        {ACTION_TYPES.CANCEL}
      </Button>
    )}
  </>
)

export const tableAddButtonComponent = (
  componentName: string,
  addModalState?: ModalState,
  extraCallback?: () => void,
) =>
  addModalState && checkUserHasPermission(componentName, ACTION_TYPES.CREATE) ? (
    <Button
      onClick={() => {
        addModalState.toggleModalView()
        extraCallback && extraCallback()
      }}
    >
      {ACTION_TYPES.CREATE} NEW
    </Button>
  ) : undefined

export const tableActionButtonsComponent = <T extends FormData>(
  componentName: string,
  formDataModal: T,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormDataReset: (formData: T) => void,
  isUpdateDisabled?: boolean,
  isDeleteDisabled?: boolean,
) => (
  <>
    {checkUserHasPermission(componentName, ACTION_TYPES.UPDATE) && (
      <Button
        onClick={() => {
          updateModalState.toggleModalView()
          setFormData(formDataModal)
          setFormDataReset(formDataModal)
        }}
        disabled={isUpdateDisabled || formDataModal.isDeleted}
      >
        {ACTION_TYPES.UPDATE}
      </Button>
    )}
    {checkUserHasPermission(componentName, ACTION_TYPES.DELETE) && (
      <Button
        onClick={() => {
          deleteModalState.toggleModalView()
          setFormData(formDataModal)
        }}
        disabled={isDeleteDisabled}
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
  defaultFormData && setFormData({ ...defaultFormData })
  defaultFormErrorData && setFormErrors({ ...defaultFormErrorData })
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

const handleFormChangeHelper = (name: string, value: string): string => {
  if (name === 'aNumber') {
    value = getNumericOnly(value, 9)
  } else if (name === 'phoneNumber' || name === 'amount') {
    value = getNumericOnly(value, 10)
  } else if (name === 'zipCode') {
    value = isNumericOnly(value) ? value : getNumericOnly(value, 5)
  }
  return value
}

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

  const changedValue = handleFormChangeHelper(name, value)

  if (name.startsWith('is') || name.startsWith('has')) {
    setFormData({ ...formData, [name]: checked })
  } else {
    setFormData({ ...formData, [name]: changedValue })
  }
  if (name in formErrors) {
    setFormErrors({ ...formErrors, [name]: '' })
  }
}

export const handleFormDateChange = <T extends FormData, U extends FormErrorData>(
  name: string,
  value: Dayjs | null,
  formData: T,
  formErrors: U,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
) => {
  setFormData({ ...formData, [name]: value })
  if (name in formErrors) {
    setFormErrors({ ...formErrors, [name]: '' })
  }
}

export const addModalComponent = <T extends FormData, U extends FormErrorData>(
  componentName: string,
  content: React.JSX.Element,
  primaryButtonCallback: (action: ActionTypes, type?: string) => void,
  addModalState: ModalState,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
  defaultFormData: T,
  defaultFormErrorData: U,
  formDataReset: T,
  type?: string,
  primaryButtonDisabled?: boolean,
  secondaryButtonDisabled?: boolean,
  resetButtonDisabled?: boolean,
) => {
  return (
    <Modal
      open={addModalState.showModal}
      onClose={() => {
        addModalState.toggleModalView()
        setFormData({ ...defaultFormData })
      }}
      title={`${ACTION_TYPES.CREATE} ${componentName}`}
      primaryButtonText={ACTION_TYPES.CREATE}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.CREATE, type)}
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
        resetButtonCallback(
          ACTION_TYPES.CREATE,
          setFormData,
          setFormErrors,
          formDataReset,
          defaultFormData,
          defaultFormErrorData,
        )
      }
      primaryButtonDisabled={primaryButtonDisabled}
      secondaryButtonDisabled={secondaryButtonDisabled}
      resetButtonDisabled={resetButtonDisabled}
    />
  )
}

export const updateModalComponent = <T extends FormData, U extends FormErrorData>(
  componentName: string,
  content: React.JSX.Element,
  primaryButtonCallback: (action: ActionTypes, type?: string) => void,
  addModalState: ModalState,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
  defaultFormData: T,
  defaultFormErrorData: U,
  formDataReset: T,
  type?: string,
  primaryButtonDisabled?: boolean,
  secondaryButtonDisabled?: boolean,
  resetButtonDisabled?: boolean,
) => {
  return (
    <Modal
      open={updateModalState.showModal}
      onClose={() => {
        updateModalState.toggleModalView()
        setFormData({ ...defaultFormData })
      }}
      title={`${ACTION_TYPES.UPDATE} ${componentName}`}
      primaryButtonText={ACTION_TYPES.UPDATE}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.UPDATE, type)}
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
        resetButtonCallback(
          ACTION_TYPES.UPDATE,
          setFormData,
          setFormErrors,
          formDataReset,
          defaultFormData,
          defaultFormErrorData,
        )
      }
      primaryButtonDisabled={primaryButtonDisabled}
      secondaryButtonDisabled={secondaryButtonDisabled}
      resetButtonDisabled={resetButtonDisabled}
    />
  )
}

export const deleteModalComponent = <T extends FormData, U extends FormErrorData>(
  componentName: string,
  contentText: string,
  primaryButtonCallback: (action: ActionTypes, type?: string) => void,
  addModalState: ModalState,
  updateModalState: ModalState,
  deleteModalState: ModalState,
  setFormData: (formData: T) => void,
  setFormErrors: (formErrorData: U) => void,
  defaultFormData: T,
  defaultFormErrorData: U,
  formData: T,
  formErrors: U,
  type?: string,
  primaryButtonDisabled?: boolean,
  secondaryButtonDisabled?: boolean,
  resetButtonDisabled?: boolean,
) => {
  return (
    <Modal
      open={deleteModalState.showModal}
      onClose={() => {
        deleteModalState.toggleModalView()
        setFormData({ ...defaultFormData })
      }}
      title={`${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} ${componentName}`}
      primaryButtonText={formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE}
      primaryButtonCallback={() =>
        primaryButtonCallback(formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE, type)
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
      primaryButtonDisabled={primaryButtonDisabled}
      secondaryButtonDisabled={secondaryButtonDisabled}
      resetButtonDisabled={resetButtonDisabled}
    />
  )
}
