import { Checkbox } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import {
  convertToCamelCase,
  convertToTitleCase,
  FormTextField,
  getNumber,
  GlobalState,
  Modal2,
  Table,
  unmountPage,
  useModal,
} from '../../app'
import { ACTION_TYPES, ActionTypes, BUTTON_TYPES, REF_TYPES_REGISTRY, RefTypesRegistry } from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import { RefTypeResponse, RefTypeSchema, RefTypesState } from '../types/refTypes.data.types'
import {
  DefaultRefTypeFormData,
  RefTypeFormData,
  RefTypesReduxStoreKeys,
  refTypeTableData,
  refTypeTableHeader,
  validateFormData,
} from '../utils/refTypes.utils'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    refTypes: refTypes,
  }
}

const mapDispatchToProps = {
  getRefType: (refType: RefTypesRegistry) => getRefType(refType),
  unmountPage: (refType: RefTypesRegistry) => unmountPage(`${refType}_UNMOUNT`),
}

interface RefTypeProps {
  refType: RefTypesRegistry
  refTypes: RefTypesState
  getRefType: (refType: RefTypesRegistry) => void
  unmountPage: (refType: RefTypesRegistry) => void
}

const RefTypes = (props: RefTypeProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { refType, refTypes } = props
  const dispatch = useDispatch()
  const { getRefType } = props
  const { unmountPage } = props
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

    if (refTypeInStore.length === 0 && !isFetchRunDone.current) {
      getRefType(refType as RefTypesRegistry)
      isFetchRunDone.current = true
    }
  }, [refTypeList, refType, refTypes, getRefType])

  useEffect(() => {
    return () => {
      unmountPage(props.refType as RefTypesRegistry)
    }
  }, [props.refType, unmountPage])

  const refTypePageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      {refTypeTitle()}
    </Typography>
  )

  const isDisabled = (name: string) => ['DUE AT HEARING', 'MASTER', 'MERIT'].includes(name)
  const addButton = () => <Button onClick={() => addModalState.toggleModalView()}>Add New {refTypeTitle()}</Button>
  const actionButtons = (formDataModal: RefTypeFormData) => (
    <>
      <Button
        onClick={() => {
          updateModalState.toggleModalView()
          setFormData(formDataModal)
          setFormDataReset(formDataModal)
        }}
        disabled={isDisabled(formDataModal.nameOrComponentName || '')}
      >
        Update
      </Button>
      <Button
        onClick={() => {
          deleteModalState.toggleModalView()
          setFormData(formDataModal)
        }}
        disabled={isDisabled(formDataModal.nameOrComponentName || '')}
      >
        Delete
      </Button>
    </>
  )

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateFormData(formData, setFormErrors)
    if (hasFormErrors) {
      console.log('Has Form Errors', formErrors)
      return
    }

    let refTypeResponse: RefTypeResponse = { data: [] }
    if (action === ACTION_TYPES.DELETE && getNumber(formData.id) > 0) {
      refTypeResponse = await deleteRefType(refType, formData.id)(dispatch)
    } else if (action === ACTION_TYPES.UPDATE && getNumber(formData.id) > 0) {
      refTypeResponse = await editRefType(refType, formData.id, formData.nameOrComponentName, formData.descOrStatusName, formData.isActive)(dispatch)
    } else if (action === ACTION_TYPES.ADD) {
      refTypeResponse = await addRefType(refType, formData.nameOrComponentName, formData.descOrStatusName)(dispatch)
    } else {
      console.log('Invalid action, formData combination', action, formData)
    }

    if (!refTypeResponse || refTypeResponse.detail) {
      console.log('Something went wrong')
    } else {
      secondaryButtonCallback()
    }
  }

  const secondaryButtonCallback = () => {
    addModalState.showModal && addModalState.toggleModalView()
    updateModalState.showModal && updateModalState.toggleModalView()
    deleteModalState.showModal && deleteModalState.toggleModalView()
    setFormData(DefaultRefTypeFormData)
  }

  const resetButtonCallback = (action: ActionTypes) => {
    if (action === ACTION_TYPES.ADD) {
      setFormData(DefaultRefTypeFormData)
    } else if (action === ACTION_TYPES.UPDATE) {
      setFormData(formDataReset)
    }
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target

    if (['nameOrComponentName', 'descOrStatusName'].includes(name)) {
      setFormData({ ...formData, [name]: value })
      setFormErrors({ ...formErrors, [name]: '' })
    } else {
      setFormData({ ...formData, [name]: checked })
    }
  }

  const refTypeForm = () => {
    const nameOrComponentName = refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'Component Name' : 'Name'
    const descOrStatusName = refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'Status Name' : 'Description'
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
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
        {refType === REF_TYPES_REGISTRY.COMPONENT_STATUS && (
          <FormControlLabel
            label="Is Active Status"
            control={<Checkbox name="isActive" checked={formData.isActive} onChange={handleFormChange} />}
          />
        )}
      </Box>
    )
  }

  const addModal = () => (
    <Modal2
      open={addModalState.showModal}
      onClose={() => {
        addModalState.toggleModalView()
        setFormData(DefaultRefTypeFormData)
      }}
      title={`Add New ${refTypeTitle()}`}
      primaryButtonText={BUTTON_TYPES.Add}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.ADD)}
      secondaryButtonText={BUTTON_TYPES.Cancel}
      secondaryButtonCallback={secondaryButtonCallback}
      content={refTypeForm()}
      resetButtonText={BUTTON_TYPES.Reset}
      resetButtonCallback={() => resetButtonCallback(ACTION_TYPES.ADD)}
    />
  )

  const updateModal = () => {
    return (
      <Modal2
        open={updateModalState.showModal}
        onClose={() => {
          updateModalState.toggleModalView()
          setFormData(DefaultRefTypeFormData)
        }}
        title={`Update ${refTypeTitle()}`}
        primaryButtonText={BUTTON_TYPES.Update}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.UPDATE)}
        secondaryButtonText={BUTTON_TYPES.Cancel}
        secondaryButtonCallback={secondaryButtonCallback}
        content={refTypeForm()}
        resetButtonText={BUTTON_TYPES.Reset}
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
          setFormData(DefaultRefTypeFormData)
        }}
        title={`Delete ${refTypeTitle()}`}
        primaryButtonText={BUTTON_TYPES.Delete}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_TYPES.DELETE)}
        secondaryButtonText={BUTTON_TYPES.Cancel}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`Are you sure you want to delete ${refTypeTitle()}: ${formData.nameOrComponentName}, ${
          formData.descOrStatusName
        }?!?`}
      />
    )
  }

  const refTypeTable = () => (
    <Table
      componentName={refTypeTitle()}
      headerData={refTypeTableHeader(refType)}
      tableData={refTypeTableData(refType, refTypeList, actionButtons)}
      addModelComponent={addButton()}
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
