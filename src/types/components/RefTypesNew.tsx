import { Checkbox } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import {
  convertToCamelCase,
  convertToTitleCase,
  FormTextField,
  GlobalState,
  Modal2,
  Table,
  unmountPage,
  useModal,
} from '../../app'
import {
  ACTION_ADD,
  ACTION_UPDATE,
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_RESET,
  BUTTON_UPDATE,
  REF_TYPES_REGISTRY,
  RefTypesRegistry,
} from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import { RefTypeSchema, RefTypesState } from '../types/refTypes.data.types'
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
  addRefType: (refType: RefTypesRegistry, name: string, description: string) => addRefType(refType, name, description),
  editRefType: (refType: RefTypesRegistry, id: number, name: string, description: string, isActive?: boolean) =>
    editRefType(refType, id, name, description, isActive),
  deleteRefType: (refType: RefTypesRegistry, id: number) => deleteRefType(refType, id),
  unmountPage: (refType: RefTypesRegistry) => unmountPage(`${refType}_UNMOUNT`),
}

interface RefTypeProps {
  refType: RefTypesRegistry
  refTypes: RefTypesState
  getRefType: (refType: RefTypesRegistry) => void
  addRefType: (refType: RefTypesRegistry, name: string, description: string) => void
  editRefType: (refType: RefTypesRegistry, id: number, name: string, description: string, isActive?: boolean) => void
  deleteRefType: (refType: RefTypesRegistry, id: number) => void
  unmountPage: (refType: RefTypesRegistry) => void
}

const RefTypes = (props: RefTypeProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { refType, refTypes } = props
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

  const primaryButtonCallback = () => {
    const hasFormErrors = validateFormData(formData, setFormErrors)
    if (hasFormErrors) {
      return
    } else {
      console.log('submit things')
    }
  }

  const secondaryButtonCallback = () => {
    addModalState.showModal && addModalState.toggleModalView()
    updateModalState.showModal && updateModalState.toggleModalView()
    deleteModalState.showModal && deleteModalState.toggleModalView()
    setFormData(DefaultRefTypeFormData)
  }

  const resetButtonCallback = (action: string) => {
    if (action === ACTION_ADD) {
      setFormData(DefaultRefTypeFormData)
    } else if (action === ACTION_UPDATE) {
      setFormData(formDataReset)
    } else {
      console.log('Error! Invalid Action: ', action)
    }
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target

    if (["nameOrComponentName", "descOrStatusName"].includes(name)) {
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
      contentText="Some Context Text"
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={primaryButtonCallback}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      content={refTypeForm()}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
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
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={primaryButtonCallback}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        content={refTypeForm()}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
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
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={primaryButtonCallback}
        secondaryButtonText={BUTTON_CANCEL}
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
