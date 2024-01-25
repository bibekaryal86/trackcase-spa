import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import FormForm from './FormForm'
import FormTable from './FormTable'
import { getStatusesList, GlobalState, Modal, StatusSchema, unmountPage } from '../../app'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_RESET,
  BUTTON_UPDATE,
  ID_DEFAULT,
} from '../../constants'
import { addForm, deleteForm, editForm, getForms } from '../actions/forms.action'
import { FORMS_UNMOUNT } from '../types/forms.action.types'
import { DefaultFormSchema, FormSchema } from '../types/forms.data.types'
import { isAreTwoFormsSame, validateForm } from '../utils/forms.utils'

const mapStateToProps = ({ forms, statuses }: GlobalState) => {
  return {
    isCloseModal: forms.isCloseModal,
    formsList: forms.forms,
    statusList: statuses.statuses,
  }
}

const mapDispatchToProps = {
  getForms: () => getForms(),
  addForm: (form: FormSchema) => addForm(form),
  editForm: (id: number, form: FormSchema) => editForm(id, form),
  deleteForm: (id: number) => deleteForm(id),
  unmountPage: () => unmountPage(FORMS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
}

interface FormsProps {
  isCloseModal: boolean
  formsList: FormSchema[]
  getForms: () => void
  addForm: (form: FormSchema) => void
  editForm: (id: number, form: FormSchema) => void
  deleteForm: (id: number) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
}

const Forms = (props: FormsProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { formsList, getForms } = props
  const { unmountPage } = props
  const { isCloseModal } = props
  const { statusList, getStatusesList } = props

  const [modal, setModal] = useState('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedForm, setSelectedForm] = useState<FormSchema>(DefaultFormSchema)
  const [selectedFormForReset, setSelectedFormForReset] = useState<FormSchema>(DefaultFormSchema)
  const [formStatusList, setFormStatusList] = useState<string[]>([])

  useEffect(() => {
    if (!isFetchRunDone.current) {
      formsList.length === 0 && getForms()
      statusList.form.all.length === 0 && getStatusesList()
    }
    isFetchRunDone.current = true
  }, [formsList.length, getForms, statusList.form.all, getStatusesList])

  useEffect(() => {
    if (statusList.form.all.length > 0) {
      setFormStatusList(statusList.form.all)
    }
  }, [statusList.form.all])

  useEffect(() => {
    if (isCloseModal) {
      secondaryButtonCallback()
    }
  }, [isCloseModal])

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const primaryButtonCallback = (action: string, id?: number) => {
    if (id && action === ACTION_DELETE) {
      props.deleteForm(id)
    } else if (id && action === ACTION_UPDATE) {
      if (validateForm(selectedForm)) {
        props.editForm(id, selectedForm)
      }
    } else {
      if (validateForm(selectedForm)) {
        props.addForm(selectedForm)
      }
    }
    isFetchRunDone.current = false
  }

  const secondaryButtonCallback = () => {
    setModal('')
    setSelectedId(ID_DEFAULT)
    setSelectedForm(DefaultFormSchema)
    setSelectedFormForReset(DefaultFormSchema)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedForm(DefaultFormSchema)
    action === ACTION_UPDATE && setSelectedForm(selectedFormForReset)
  }

  const formForm = () => (
    <FormForm
      selectedForm={selectedForm}
      setSelectedForm={setSelectedForm}
      formStatusList={formStatusList}
      isShowOneForm={false}
    />
  )

  const addModal = () => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title="Add New Form"
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, undefined)}
      primaryButtonDisabled={isAreTwoFormsSame(selectedForm, selectedFormForReset)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={formForm()}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
      resetButtonDisabled={isAreTwoFormsSame(selectedForm, selectedFormForReset)}
    />
  )

  const updateModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Update Form"
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, selectedId)}
        primaryButtonDisabled={isAreTwoFormsSame(selectedForm, selectedFormForReset)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={formForm()}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
        resetButtonDisabled={isAreTwoFormsSame(selectedForm, selectedFormForReset)}
      />
    )
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Delete Form"
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`Are you sure you want to delete Form: '${selectedForm.formType?.name}'?!?`}
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

  const formsPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      Forms
    </Typography>
  )

  const formsTable = () => (
    <FormTable
      isHistoryView={false}
      formsList={formsList}
      historyFormsList={[]}
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedForm={setSelectedForm}
      setSelectedFormForReset={setSelectedFormForReset}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {formsPageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {formsTable()}
        </Grid>
      </Grid>
      {modal && showModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Forms)
