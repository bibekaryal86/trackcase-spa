import { SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { Dayjs } from 'dayjs'
import React from 'react'

import {
  HearingCalendarFormData,
  HearingCalendarFormErrorData,
  HearingCalendarSchema,
  TaskCalendarFormData,
  TaskCalendarFormErrorData,
} from '@calendars/types/calendars.data.types'
import { CourtCaseFormData, CourtCaseFormErrorData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ClientFormData, ClientFormErrorData, ClientSchema } from '@clients/types/clients.data.types'
import {
  CaseCollectionFormData,
  CaseCollectionFormErrorData,
  CaseCollectionSchema,
  CashCollectionFormData,
  CashCollectionFormErrorData,
} from '@collections/types/collections.data.types'
import { ACTION_TYPES, ActionTypes } from '@constants/index'
import { CourtFormData, CourtFormErrorData, CourtSchema } from '@courts/types/courts.data.types'
import {
  FilingFormData,
  FilingFormErrorData,
  FilingRfeFormData,
  FilingRfeFormErrorData,
  FilingSchema,
} from '@filings/types/filings.data.types'
import { JudgeFormData, JudgeFormErrorData, JudgeSchema } from '@judges/types/judges.data.types'
import { ComponentStatusSchema, RefTypeFormData, RefTypeLessStatusSchema } from '@ref_types/types/refTypes.data.types'
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
import { getDayjsString, getNumber, getNumericOnly, isNumericOnly } from '../utils/app.utils'

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
  | FilingRfeFormData
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
  | FilingRfeFormErrorData
  | HearingCalendarFormErrorData
  | TaskCalendarFormErrorData
  | CaseCollectionFormErrorData
  | CashCollectionFormErrorData

export const pageTitleComponent = (component: string, componentName?: string) => (
  <>
    <Typography component="h1" variant="h6" color="primary">
      {component}
      {componentName ? `: ${componentName.replace('_', ' ')}` : ''}
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
  const viewAllText = `VIEW ALL ${viewAllComponent.replace('_', ' ')}`
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
    {`ITEM NOT SELECTED! NOTHING TO DISPLAY!! GO TO ${component.replace('_', ' ')} PAGE AND CLICK ONE TO SELECT!!!`}
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

export const getComponentNameDisplay = (componentName: string, isKeepPlural?: boolean) => {
  if (componentName.endsWith('S') && !isKeepPlural) {
    componentName = componentName.slice(0, -1)
  }
  return componentName.replace(/_/g, ' ')
}

export const tableAddButtonComponent = (
  componentName: string,
  createNewDisplay: string,
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
      {ACTION_TYPES.CREATE} {getComponentNameDisplay(createNewDisplay)}
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
  event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent,
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
      title={`${ACTION_TYPES.CREATE} ${getComponentNameDisplay(componentName)}`}
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
      title={`${ACTION_TYPES.UPDATE} ${getComponentNameDisplay(componentName)}`}
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
      title={`${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} ${getComponentNameDisplay(
        componentName,
      )}`}
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

export const componentStatusListForSelect = (componentStatusList: ComponentStatusSchema[]) =>
  componentStatusList.map((status) => (
    <MenuItem key={status.id} value={status.id}>
      {status.statusName}
    </MenuItem>
  ))

export const refTypesListForSelect = (refTypesList: RefTypeLessStatusSchema[]) =>
  refTypesList.map((x) => (
    <MenuItem key={x.id} value={x.id}>
      {x.name}
    </MenuItem>
  ))

export const courtsListForSelect = (courtsList: CourtSchema[], courtId?: number, formDataCourtId?: number) => {
  if (getNumber(courtId) > 0) {
    const selectedCourt = courtsList.find((x) => x.id === courtId)
    if (selectedCourt) {
      return [
        <MenuItem key={selectedCourt.id} value={selectedCourt.id}>
          {selectedCourt.name}
        </MenuItem>,
      ]
    }
  } else {
    return courtsList
      .filter((x) => formDataCourtId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.name}
        </MenuItem>
      ))
  }
  return []
}

export const judgesListForSelect = (judgesList: JudgeSchema[], judgeId?: number, formDataJudgeId?: number) => {
  if (getNumber(judgeId) > 0) {
    const selectedJudge = judgesList.find((x) => x.id === judgeId)
    if (selectedJudge) {
      return [
        <MenuItem key={selectedJudge.id} value={selectedJudge.id}>
          {selectedJudge.name}
        </MenuItem>,
      ]
    }
  } else {
    return judgesList
      .filter((x) => formDataJudgeId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.name}
        </MenuItem>
      ))
  }
  return []
}

export const clientsListForSelect = (clientsList: ClientSchema[], clientId?: number, formDataClientId?: number) => {
  if (getNumber(clientId) > 0) {
    const selectedClient = clientsList.find((x) => x.id === clientId)
    if (selectedClient) {
      return [
        <MenuItem key={selectedClient.id} value={selectedClient.id}>
          {selectedClient.name}
        </MenuItem>,
      ]
    }
  } else {
    return clientsList
      .filter((x) => formDataClientId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.name}
        </MenuItem>
      ))
  }
  return []
}

export const courtCasesListForSelect = (
  courtCasesList: CourtCaseSchema[],
  selectedCourtCase?: CourtCaseSchema,
  formDataCourtCaseId?: number,
) => {
  if (selectedCourtCase) {
    return [
      <MenuItem key={selectedCourtCase.id} value={selectedCourtCase.id}>
        {selectedCourtCase.client?.name}, {selectedCourtCase.caseType?.name}
      </MenuItem>,
    ]
  } else {
    return courtCasesList
      .filter((x) => formDataCourtCaseId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.client?.name}, {x.caseType?.name}
        </MenuItem>
      ))
  }
}

const hearingCalendarForSelect = (
  x: HearingCalendarSchema,
  clientsList: ClientSchema[],
  courtCasesList: CourtCaseSchema[],
) => {
  const client = clientsList.find((y) => x.courtCase?.clientId === y.id)
  const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
  return `${client?.name}, ${courtCase?.caseType?.name} [${getDayjsString(x.hearingDate)}]`
}

export const hearingCalendarListForSelect = (
  hearingCalendarList: HearingCalendarSchema[],
  clientsList: ClientSchema[],
  courtCasesList: CourtCaseSchema[],
  selectedCourtCase?: CourtCaseSchema,
  formDataHearingCalendarId?: number,
) => {
  if (selectedCourtCase && selectedCourtCase.hearingCalendars) {
    return selectedCourtCase.hearingCalendars
      .filter((x) => formDataHearingCalendarId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {hearingCalendarForSelect(x, clientsList, courtCasesList)}
        </MenuItem>
      ))
  } else {
    return hearingCalendarList
      .filter((x) => formDataHearingCalendarId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {hearingCalendarForSelect(x, clientsList, courtCasesList)}
        </MenuItem>
      ))
  }
}

const filingForSelect = (x: FilingSchema, clientsList: ClientSchema[], courtCasesList: CourtCaseSchema[]) => {
  const client = clientsList.find((y) => x.courtCase?.clientId === y.id)
  const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
  return `${client?.name}, ${courtCase?.caseType?.name} [${x.filingType?.name}]`
}

export const filingListForSelect = (
  filingsList: FilingSchema[],
  clientsList: ClientSchema[],
  courtCasesList: CourtCaseSchema[],
  selectedCourtCase?: CourtCaseSchema,
  formDataFilingId?: number,
) => {
  if (selectedCourtCase && selectedCourtCase.filings) {
    return selectedCourtCase.filings
      .filter((x) => formDataFilingId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {filingForSelect(x, clientsList, courtCasesList)}
        </MenuItem>
      ))
  } else {
    return filingsList
      .filter((x) => formDataFilingId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {filingForSelect(x, clientsList, courtCasesList)}
        </MenuItem>
      ))
  }
}

const caseCollectionForSelect = (
  x: CaseCollectionSchema,
  clientsList: ClientSchema[],
  courtCasesList: CourtCaseSchema[],
) => {
  const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
  const client = clientsList.find((y) => courtCase?.clientId === y.id)
  return `${client?.name}, ${courtCase?.caseType?.name}`
}

export const caseCollectionListForSelect = (
  caseCollectionList: CaseCollectionSchema[],
  clientsList: ClientSchema[],
  courtCasesList: CourtCaseSchema[],
  selectedCourtCase?: CourtCaseSchema,
  formDataCaseCollectionId?: number,
) => {
  if (selectedCourtCase && selectedCourtCase.caseCollections) {
    return selectedCourtCase.caseCollections
      .filter((x) => formDataCaseCollectionId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {caseCollectionForSelect(x, clientsList, courtCasesList)}
        </MenuItem>
      ))
  }
  return caseCollectionList
    .filter((x) => formDataCaseCollectionId === x.id || x.componentStatus?.isActive)
    .map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {caseCollectionForSelect(x, clientsList, courtCasesList)}
      </MenuItem>
    ))
}
