import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import { GlobalState, Modal, Table, TableData, TableHeaderData } from '../../app'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_RESET,
  BUTTON_UPDATE,
  ID_ACTION_BUTTON,
  ID_DEFAULT,
} from '../../constants'
import {
  CaseTypeSchema,
  CollectionMethodSchema,
  FilingTypeSchema,
  HearingTypeSchema,
  TaskTypeSchema,
} from '../types/refTypes.data.types'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    isCloseModal: refTypes.isCloseModal,
  }
}

interface RefTypesProps {
  refTypeId: 'case_type' | 'collection_method' | 'form_type' | 'hearing_type' | 'task_type'
  refTypeName: 'Case Type' | 'Collection Method' | 'Form Status' | 'Filing Type' | 'Hearing Type' | 'Task Type'
  refTypesList:
    | CaseTypeSchema[]
    | CollectionMethodSchema[]
    | FilingTypeSchema[]
    | HearingTypeSchema[]
    | TaskTypeSchema[]
  getRefTypes: () => void
  addRefType: (name: string, description: string) => void
  editRefType: (id: number, name: string, description: string) => void
  deleteRefType: (id: number) => void
  isCloseModal: boolean
}

const RefTypes = (props: RefTypesProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { refTypeId, refTypeName } = props
  const { refTypesList, getRefTypes } = props
  const { isCloseModal } = props

  const [modal, setModal] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedName, setSelectedName] = useState<string>('')
  const [selectedDesc, setSelectedDesc] = useState<string>('')
  const [selectedNameForReset, setSelectedNameForReset] = useState<string>('')
  const [selectedDescForReset, setSelectedDescForReset] = useState<string>('')

  useEffect(() => {
    if (refTypesList.length === 0 && !isFetchRunDone.current) {
      getRefTypes()
      isFetchRunDone.current = true
    }
  }, [refTypesList, getRefTypes])

  useEffect(() => {
    if (isCloseModal) {
      secondaryButtonCallback()
    }
  }, [isCloseModal])

  const modalForm = () => {
    return (
      <div>
        <TextField
          required
          autoFocus
          variant="standard"
          id={`${refTypeId}-name`}
          label="Name"
          name={`${refTypeId}-name`}
          margin="normal"
          sx={{ minWidth: 250 }}
          inputProps={{ maxLength: 99 }}
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          error={selectedName.trim() === ''}
          helperText={selectedName.trim() === '' ? 'Please enter name' : ''}
        />
        <TextField
          required
          fullWidth
          multiline
          rows={2}
          variant="standard"
          name={`${refTypeId}-desc`}
          label="Description"
          id={`${refTypeId}-desc`}
          margin="normal"
          inputProps={{ maxLength: 999 }}
          value={selectedDesc}
          onChange={(e) => setSelectedDesc(e.target.value)}
          error={selectedDesc.trim() === ''}
          helperText={selectedDesc.trim() === '' ? 'Please enter description' : ''}
        />
      </div>
    )
  }

  const validateNameDesc = (name: string, desc: string) => name.trim() && desc.trim()

  const primaryButtonCallback = (action: string, id?: number) => {
    if (id && action === ACTION_DELETE) {
      props.deleteRefType(id)
    } else if (id && action === ACTION_UPDATE) {
      if (validateNameDesc(selectedName, selectedDesc)) {
        props.editRefType(id, selectedName, selectedDesc)
      }
    } else {
      if (validateNameDesc(selectedName, selectedDesc)) {
        props.addRefType(selectedName, selectedDesc)
      }
    }
    isFetchRunDone.current = false
  }

  const secondaryButtonCallback = () => {
    setModal('')
    setSelectedId(ID_DEFAULT)
    setSelectedName('')
    setSelectedDesc('')
    setSelectedNameForReset('')
    setSelectedDescForReset('')
  }

  const resetButtonCallback = (action: string) => {
    if (action === ACTION_ADD) {
      setSelectedName('')
      setSelectedDesc('')
    }
    if (action === ACTION_UPDATE) {
      setSelectedName(selectedNameForReset)
      setSelectedDesc(selectedDescForReset)
    }
  }

  const addModal = () => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title={`Add New ${refTypeName}`}
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, undefined)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={modalForm()}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
    />
  )

  const updateModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title={`Update ${refTypeName}`}
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={modalForm()}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
      />
    )
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title={`Delete ${refTypeName}`}
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`Are you sure you want to delete ${refTypeName}: ${selectedName}?!?`}
      />
    )
  }

  const showModal = () =>
    modal === ACTION_ADD
      ? addModal()
      : modal === ACTION_UPDATE
      ? updateModal()
      : modal === ACTION_DELETE
      ? deleteModal()
      : null

  const addButton = () => <Button onClick={() => setModal(ACTION_ADD)}>Add New {refTypeName}</Button>

  const isDisabled = (name: string) => ['Due at Hearing', 'MASTER', 'MERIT'].includes(name)
  const actionButtons = (id: number, name: string, description: string) => (
    <>
      <Button
        onClick={() => {
          setModal(ACTION_UPDATE)
          setSelectedId(id)
          setSelectedName(name)
          setSelectedDesc(description)
        }}
        disabled={isDisabled(name)}
      >
        Update
      </Button>
      <Button
        onClick={() => {
          setModal(ACTION_DELETE)
          setSelectedId(id)
          setSelectedName(name)
          setSelectedDesc(description)
        }}
        disabled={isDisabled(name)}
      >
        Delete
      </Button>
    </>
  )

  const refTypesTableHeaderData: TableHeaderData[] = [
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'description',
      label: 'Description',
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center' as const,
      isDisableSorting: true,
    },
  ]

  const refTypesTableData: TableData[] = Array.from(refTypesList, (x) => {
    return {
      name: x.name,
      description: x.description,
      actions: actionButtons(x.id || ID_ACTION_BUTTON, x.name, x.description),
    }
  })

  const refTypesPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      {refTypeName}
    </Typography>
  )

  const refTypesTable = () => (
    <Table
      componentName={refTypeName}
      headerData={refTypesTableHeaderData}
      tableData={refTypesTableData}
      isExportToCsv={true}
      exportToCsvFileName={`trackcase_service_${refTypeId}.csv`}
      addModelComponent={addButton()}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {refTypesPageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {refTypesTable()}
        </Grid>
      </Grid>
      {modal && showModal()}
    </Box>
  )
}

export default connect(mapStateToProps, null)(RefTypes)
