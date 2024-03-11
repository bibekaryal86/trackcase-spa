import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_RESET,
  BUTTON_UPDATE,
  ID_DEFAULT,
  REF_TYPES_REGISTRY,
  RefTypesRegistry,
} from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import { RefTypeSchema, RefTypesState } from '../types/refTypes.data.types'
import { RefTypesReduxStoreKeys, refTypeTableData, refTypeTableHeader } from '../utils/refTypes.utils'

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

const RefTypesNew = (props: RefTypeProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { refType, refTypes } = props
  const { getRefType } = props
  const { unmountPage } = props
  const [refTypeList, setRefTypeList] = useState([] as RefTypeSchema[])
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const [formData, setFormData] = useState({
    // all fields (status uses componentName and statusName, all others use name and description)
    id: ID_DEFAULT,
    nameOrComponentName: '',
    descOrStatusName: '',
    isActive: false
  })
  const [formErrors, setFormErrors] = useState({
    // only the required fields
    nameOrComponentName: '',
    descOrStatusName: '',
  })

  const refTypeTitle = useCallback(() => {
    return convertToTitleCase(refType, "_")
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

  const isDisabled = (name: string) => ['Due at Hearing', 'MASTER', 'MERIT'].includes(name)
  const addButton = () => <Button onClick={() => addModalState.toggleModalView()}>Add New {refTypeTitle()}</Button>
  const actionButtons = (name: string) => (
    <>
      <Button
        onClick={() => {
          updateModalState.toggleModalView()
        }}
        disabled={isDisabled(name)}
      >
        Update
      </Button>
      <Button
        onClick={() => {
          deleteModalState.toggleModalView()
        }}
        disabled={isDisabled(name)}
      >
        Delete
      </Button>
    </>
  )
  console.log(actionButtons(''))

  const validateForm = () => {
    let hasFormErrors = false
    if (!formData.nameOrComponentName) {
      hasFormErrors = true
      setFormErrors({ ...formErrors, nameOrComponentName: 'Required' })
    }
    if (!formData.descOrStatusName) {
      hasFormErrors = true
      setFormErrors({ ...formErrors, descOrStatusName: 'Required' })
    }
    return hasFormErrors
  }

  const primaryButtonCallback = () => {
    const hasFormErrors = validateForm()
    if (hasFormErrors) {
      return
    } else {
      console.log('submit things')
    }
  }

  const secondaryButtonCallback = () => {
    console.log('in secondary button callback')
  }

  const resetButtonCallback = () => {
    console.log('in reset button callback')
  }

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value })
    setFormErrors({ ...formErrors, [name]: '' })
  }

  const refTypeForm = () => {
    const nameOrComponentName = refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'Component Name' : 'Name'
    const descOrStatusName = refType === REF_TYPES_REGISTRY.COMPONENT_STATUS ? 'Status Name' : 'Description'
    return (
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <FormTextField
          componentLabel={`${refTypeTitle()}_${nameOrComponentName}`}
          required
          value={formData.nameOrComponentName}
          onChange={handleFormChange}
          error={Boolean(formErrors.nameOrComponentName)}
          helperText={formErrors.nameOrComponentName}
        />
        <FormTextField
          componentLabel={`${refTypeTitle()}_${descOrStatusName}`}
          required
          value={formData.descOrStatusName}
          onChange={handleFormChange}
          error={Boolean(formErrors.descOrStatusName)}
          helperText={formErrors.descOrStatusName}
        />
      </Box>
    )
  }

  const addModal = () => (
    <Modal2
      open={addModalState.showModal}
      onClose={addModalState.toggleModalView}
      title={`Add New ${refTypeTitle()}`}
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={primaryButtonCallback}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      content={refTypeForm()}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={resetButtonCallback}
    />
  )

  const updateModal = () => {
    return (
      <Modal2
        open={updateModalState.showModal}
        onClose={updateModalState.toggleModalView}
        title={`Update ${refTypeTitle()}`}
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={primaryButtonCallback}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        content={refTypeForm()}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={resetButtonCallback}
      />
    )
  }

  const deleteModal = () => {
    return (
      <Modal2
        open={deleteModalState.showModal}
        onClose={deleteModalState.toggleModalView}
        title={`Delete ${refTypeTitle()}`}
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={primaryButtonCallback}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`Are you sure you want to delete ${refTypeTitle()}?!?`}
      />
    )
  }

  const refTypeTable = () => (
    <Table
      componentName={refTypeTitle()}
      headerData={refTypeTableHeader(refType)}
      tableData={refTypeTableData(refType, refTypeList)}
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

export default connect(mapStateToProps, mapDispatchToProps)(RefTypesNew)
