import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import {
  addUpdateModalComponent,
  convertToCamelCase,
  convertToTitleCase,
  deleteModalComponent,
  FetchRequestMetadata,
  FormSelectField,
  FormTextField,
  getNumber,
  GlobalState,
  handleFormChange,
  pageTitleComponent,
  secondaryButtonCallback,
  Table,
  tableActionButtonsComponent,
  tableAddButtonComponent,
  useModal,
} from '../../app'
import {
  ACTION_TYPES,
  ActionTypes,
  COMPONENT_STATUS_NAME,
  COMPONENT_STATUS_STATUS,
  REF_TYPES_REGISTRY,
  RefTypesRegistry,
} from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import {
  DefaultRefTypeFormData,
  RefTypeFormData,
  RefTypeResponse,
  RefTypeSchema,
  RefTypesReduxStoreKeys,
  RefTypesState,
} from '../types/refTypes.data.types'
import { refTypeTableData, refTypeTableHeader, validateFormData } from '../utils/refTypes.utils'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    refTypes: refTypes,
  }
}

const mapDispatchToProps = {
  getRefType: (refType: RefTypesRegistry, requestMetadata?: Partial<FetchRequestMetadata>) =>
    getRefType(refType, requestMetadata),
}

interface RefTypeProps {
  refType: RefTypesRegistry
  refTypes: RefTypesState
  getRefType: (refType: RefTypesRegistry, requestMetadata?: Partial<FetchRequestMetadata>) => void
}

const RefTypes = (props: RefTypeProps): React.ReactElement => {
  const dispatch = useDispatch()
  const [addUpdateModalState, deleteModalState] = [useModal(), useModal()]

  const { refType, refTypes, getRefType } = props

  const [refTypeList, setRefTypeList] = useState([] as RefTypeSchema[])
  const [formData, setFormData] = useState(DefaultRefTypeFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultRefTypeFormData)
  const [formErrors, setFormErrors] = useState(DefaultRefTypeFormData)

  const componentNameNoUnderscore = refType.replace('_', ' ')

  const refTypeTitle = useCallback(() => {
    return convertToTitleCase(refType, '_').toUpperCase()
  }, [refType])

  useEffect(() => {
    const refTypeInStoreName = convertToCamelCase(refType, '_') as keyof RefTypesReduxStoreKeys
    const refTypeInStore = refTypes[refTypeInStoreName]
    setRefTypeList(refTypeInStore)

    if (refTypeInStore.length === 0) {
      getRefType(refType as RefTypesRegistry)
    }
  }, [refTypeList, refType, refTypes, getRefType])

  const getRefTypeWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getRefType(refType as RefTypesRegistry, requestMetadata)
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateFormData(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let refTypeResponse: RefTypeResponse = { data: [] }
    if (action === ACTION_TYPES.DELETE && getNumber(formData.id) > 0) {
      refTypeResponse = await deleteRefType(refType, formData.id, formData.isHardDelete)(dispatch)
    } else if ((action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.RESTORE) && getNumber(formData.id) > 0) {
      if (action === ACTION_TYPES.RESTORE && formData.isHardDelete) {
        refTypeResponse = await deleteRefType(refType, formData.id, formData.isHardDelete)(dispatch)
      } else {
        refTypeResponse = await editRefType(
          refType,
          formData.id,
          formData.nameOrComponentName,
          formData.descOrStatusName,
          formData.isActive,
          action === ACTION_TYPES.RESTORE,
        )(dispatch)
      }
    } else if (action === ACTION_TYPES.CREATE) {
      refTypeResponse = await addRefType(
        refType,
        formData.nameOrComponentName,
        formData.descOrStatusName,
        formData.isActive,
      )(dispatch)
    }

    if (refTypeResponse && !refTypeResponse.detail) {
      secondaryButtonCallback(
        addUpdateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultRefTypeFormData,
        DefaultRefTypeFormData,
      )
    }
  }

  const componentNameMenuItems = () =>
    Object.keys(COMPONENT_STATUS_NAME).map((x) => (
      <MenuItem key={x} value={x}>
        {x}
      </MenuItem>
    ))

  const componentStatusMenuItems = () =>
    Object.keys(COMPONENT_STATUS_STATUS).map((x) => (
      <MenuItem key={x} value={x}>
        {x}
      </MenuItem>
    ))

  const refTypeFormComponentStatus = (nameOrComponentName: string, descOrStatusName: string) => (
    <>
      <FormSelectField
        componentLabel={`${refTypeTitle()}--${nameOrComponentName}`}
        name="nameOrComponentName"
        required
        value={formData.nameOrComponentName}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={Boolean(formErrors.nameOrComponentName) || !formData.nameOrComponentName}
        helperText={formErrors.nameOrComponentName}
        menuItems={componentNameMenuItems()}
      />
      <FormSelectField
        componentLabel={`${refTypeTitle()}--${descOrStatusName}`}
        name="descOrStatusName"
        required
        value={formData.descOrStatusName}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={Boolean(formErrors.descOrStatusName) || !formData.descOrStatusName}
        helperText={formErrors.descOrStatusName}
        menuItems={componentStatusMenuItems()}
      />
      <FormControlLabel
        label="IS ACTIVE STATUS"
        control={
          <Checkbox
            name="isActive"
            checked={formData.isActive}
            onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
          />
        }
      />
    </>
  )

  const refTypeFormOthers = (nameOrComponentName: string, descOrStatusName: string) => (
    <>
      <FormTextField
        componentLabel={`${refTypeTitle()}--${nameOrComponentName}`}
        name="nameOrComponentName"
        required
        value={formData.nameOrComponentName}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={Boolean(formErrors.nameOrComponentName) || !formData.nameOrComponentName}
        helperText={formErrors.nameOrComponentName}
      />
      <FormTextField
        componentLabel={`${refTypeTitle()}--${descOrStatusName}`}
        name="descOrStatusName"
        required
        value={formData.descOrStatusName}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={Boolean(formErrors.descOrStatusName) || !formData.descOrStatusName}
        helperText={formErrors.descOrStatusName}
      />
    </>
  )

  const addUpdateModalContent = () => {
    const nameOrComponentName = refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'COMPONENT NAME' : 'NAME'
    const descOrStatusName = refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'STATUS NAME' : 'DESCRIPTION'
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
        {refType === REF_TYPES_REGISTRY.COMPONENT_STATUS
          ? refTypeFormComponentStatus(nameOrComponentName, descOrStatusName)
          : refTypeFormOthers(nameOrComponentName, descOrStatusName)}
      </Box>
    )
  }

  const addUpdateModal = (action: ActionTypes) =>
    addUpdateModalComponent(
      action,
      componentNameNoUnderscore,
      addUpdateModalContent(),
      primaryButtonCallback,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultRefTypeFormData,
      DefaultRefTypeFormData,
      formDataReset,
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } ${refTypeTitle()}: ${formData.nameOrComponentName}, ${formData.descOrStatusName}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      componentNameNoUnderscore,
      deleteModalContextText,
      primaryButtonCallback,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultRefTypeFormData,
      DefaultRefTypeFormData,
      formData,
      formErrors,
    )

  const isUpdateDeleteDisabled = (name: string) => ['DUE AT HEARING', 'MASTER', 'MERIT'].includes(name)

  const actionButtons = (formDataModal: RefTypeFormData) =>
    tableActionButtonsComponent(
      refType,
      formDataModal,
      addUpdateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
      isUpdateDeleteDisabled(formDataModal.nameOrComponentName),
      isUpdateDeleteDisabled(formDataModal.nameOrComponentName),
    )

  const refTypeTable = () => (
    <Table
      componentName={refTypeTitle()}
      headerData={refTypeTableHeader(refType)}
      tableData={refTypeTableData(refType, refTypeList, actionButtons)}
      addModelComponent={tableAddButtonComponent(refType, addUpdateModalState)}
      getSoftDeletedCallback={() => getRefTypeWithMetadata({ isIncludeDeleted: true })}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(componentNameNoUnderscore)}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {refTypeTable()}
        </Grid>
      </Grid>
      {addUpdateModal(ACTION_TYPES.CREATE)}
      {deleteModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(RefTypes)
