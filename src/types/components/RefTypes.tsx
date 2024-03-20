import { SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import {
  convertToCamelCase,
  convertToTitleCase,
  FetchRequestMetadata,
  FormSelectField,
  FormTextField,
  getNumber,
  GlobalState,
  Modal2,
  Table,
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
import { checkUserHasPermission, isSuperuser } from '../../users'
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
  // prevent infinite fetch if api returns empty
  const { refType, refTypes } = props
  const dispatch = useDispatch()
  const { getRefType } = props
  const [refTypeList, setRefTypeList] = useState([] as RefTypeSchema[])
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const [formData, setFormData] = useState(DefaultRefTypeFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultRefTypeFormData)
  const [formErrors, setFormErrors] = useState(DefaultRefTypeFormData)

  const refTypeTitle = useCallback(() => {
    return convertToTitleCase(refType, '_')
  }, [refType])

  useEffect(() => {
    const refTypeInStoreName = convertToCamelCase(refType, '_') as keyof RefTypesReduxStoreKeys
    const refTypeInStore = refTypes[refTypeInStoreName]
    setRefTypeList(refTypeInStore)

    if (refTypeInStore.length === 0) {
      getRefType(refType as RefTypesRegistry)
    }
  }, [refTypeList, refType, refTypes, getRefType])

  const getWithSoftDeleted = (isIncludeDeleted: boolean) => {
    getRefType(refType as RefTypesRegistry, { isIncludeDeleted })
  }

  const refTypePageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      {refTypeTitle()}
    </Typography>
  )

  const isDisabled = (name: string, isDeleted?: boolean) =>
    ['DUE AT HEARING', 'MASTER', 'MERIT'].includes(name) || isDeleted

  const addButton = () =>
    checkUserHasPermission('REF_TYPES', 'CREATE') ? (
      <Button onClick={() => addModalState.toggleModalView()}>{ACTION_TYPES.CREATE} {' '} {refTypeTitle()}</Button>
    ) : undefined

  const actionButtons = (formDataModal: RefTypeFormData) => (
    <>
      {checkUserHasPermission('REF_TYPES', 'UPDATE') && (
        <Button
          onClick={() => {
            updateModalState.toggleModalView()
            setFormData(formDataModal)
            setFormDataReset(formDataModal)
          }}
          disabled={isDisabled(formDataModal.nameOrComponentName || '', formDataModal.isDeleted)}
        >
          {ACTION_TYPES.UPDATE}
        </Button>
      )}
      {checkUserHasPermission('REF_TYPES', 'DELETE') && (
        <Button
          onClick={() => {
            deleteModalState.toggleModalView()
            setFormData(formDataModal)
          }}
          disabled={isDisabled(formDataModal.nameOrComponentName || '')}
        >
          {formDataModal.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE}
        </Button>
      )}
    </>
  )

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
      refTypeResponse = await addRefType(refType, formData.nameOrComponentName, formData.descOrStatusName)(dispatch)
    }

    if (refTypeResponse && !refTypeResponse.detail) {
      secondaryButtonCallback()
    }
  }

  const secondaryButtonCallback = () => {
    addModalState.showModal && addModalState.toggleModalView()
    updateModalState.showModal && updateModalState.toggleModalView()
    deleteModalState.showModal && deleteModalState.toggleModalView()
    setFormData({ ...DefaultRefTypeFormData })
    setFormErrors({ ...DefaultRefTypeFormData })
  }

  const resetButtonCallback = (action: ActionTypes) => {
    if (action === ACTION_TYPES.CREATE) {
      setFormData({ ...DefaultRefTypeFormData })
      setFormErrors({ ...DefaultRefTypeFormData })
    } else if (action === ACTION_TYPES.UPDATE) {
      setFormData(formDataReset)
      setFormErrors({ ...DefaultRefTypeFormData })
    }
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    let checked = false
    const { name, value } = event.target
    if ('checked' in event.target) {
      checked = event.target.checked
    }

    if (['nameOrComponentName', 'descOrStatusName'].includes(name)) {
      setFormData({ ...formData, [name]: value })
      setFormErrors({ ...formErrors, [name]: '' })
    } else {
      setFormData({ ...formData, [name]: checked })
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
        onChange={handleFormChange}
        error={Boolean(formErrors.nameOrComponentName) || !formData.nameOrComponentName}
        helperText={formErrors.nameOrComponentName}
        menuItems={componentNameMenuItems()}
      />
      <FormSelectField
        componentLabel={`${refTypeTitle()}--${descOrStatusName}`}
        name="descOrStatusName"
        required
        value={formData.descOrStatusName}
        onChange={handleFormChange}
        error={Boolean(formErrors.descOrStatusName) || !formData.descOrStatusName}
        helperText={formErrors.descOrStatusName}
        menuItems={componentStatusMenuItems()}
      />
      <FormControlLabel
        label="IS ACTIVE STATUS"
        control={<Checkbox name="isActive" checked={formData.isActive} onChange={handleFormChange} />}
      />
    </>
  )

  const hardDeleteCheckbox = () =>
    isSuperuser() ? (
      <FormControlLabel
        label="HARD DELETE [WILL DELETE PERMANENTLY, EVEN OVERRIDES RESTORE BUTTON CLICK]!"
        control={<Checkbox name="isHardDelete" checked={formData.isHardDelete} onChange={handleFormChange} />}
      />
    ) : undefined

  const refTypeFormOthers = (nameOrComponentName: string, descOrStatusName: string) => (
    <>
      <FormTextField
        componentLabel={`${refTypeTitle()}--${nameOrComponentName}`}
        name="nameOrComponentName"
        required
        value={formData.nameOrComponentName}
        onChange={handleFormChange}
        error={Boolean(formErrors.nameOrComponentName) || !formData.nameOrComponentName}
        helperText={formErrors.nameOrComponentName}
      />
      <FormTextField
        componentLabel={`${refTypeTitle()}--${descOrStatusName}`}
        name="descOrStatusName"
        required
        value={formData.descOrStatusName}
        onChange={handleFormChange}
        error={Boolean(formErrors.descOrStatusName) || !formData.descOrStatusName}
        helperText={formErrors.descOrStatusName}
      />
    </>
  )

  const refTypeForm = () => {
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

  const addModal = () => (
    <Modal2
      open={addModalState.showModal}
      onClose={() => {
        addModalState.toggleModalView()
        setFormData({ ...DefaultRefTypeFormData })
      }}
      title={`${ACTION_TYPES.CREATE} ${refTypeTitle()}`}
      primaryButtonText={ACTION_TYPES.CREATE}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.CREATE)}
      secondaryButtonText={ACTION_TYPES.CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      content={refTypeForm()}
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
          setFormData({ ...DefaultRefTypeFormData })
        }}
        title={`${ACTION_TYPES.UPDATE} ${refTypeTitle()}`}
        primaryButtonText={ACTION_TYPES.UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.UPDATE)}
        secondaryButtonText={ACTION_TYPES.CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        content={refTypeForm()}
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
          setFormData({ ...DefaultRefTypeFormData })
        }}
        title={`${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} ${refTypeTitle()}`}
        primaryButtonText={formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE}
        primaryButtonCallback={() =>
          primaryButtonCallback(formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE)
        }
        secondaryButtonText={ACTION_TYPES.CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`ARE YOU SURE YOU WANT TO ${formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} ${refTypeTitle()}: ${
          formData.nameOrComponentName
        }, ${formData.descOrStatusName}?!?`}
        content={hardDeleteCheckbox()}
      />
    )
  }

  const refTypeTable = () => (
    <Table
      componentName={refTypeTitle()}
      headerData={refTypeTableHeader(refType)}
      tableData={refTypeTableData(refType, refTypeList, actionButtons)}
      addModelComponent={addButton()}
      getSoftDeletedCallback={getWithSoftDeleted}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {refTypePageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {refTypeTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(RefTypes)
