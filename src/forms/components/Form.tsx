import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import FormForm from './FormForm'
import { getNumber, getStatusesList, GlobalState, Link, StatusSchema, unmountPage } from '../../app'
import { Calendars } from '../../calendars'
import { CourtCaseSchema, getCourtCases } from '../../cases'
import { FormTypeSchema } from '../../types'
import { getFormTypes } from '../../types/actions/formTypes.action'
import { editForm, getForm } from '../actions/forms.action'
import { FORMS_UNMOUNT } from '../types/forms.action.types'
import { DefaultFormSchema, FormSchema } from '../types/forms.data.types'
import { isAreTwoFormsSame } from '../utils/forms.utils'

const mapStateToProps = ({ forms, statuses, formTypes, courtCases }: GlobalState) => {
  return {
    isForceFetch: forms.isForceFetch,
    selectedForm: forms.selectedForm,
    statusList: statuses.statuses,
    formTypesList: formTypes.formTypes,
    courtCasesList: courtCases.courtCases,
  }
}

const mapDispatchToProps = {
  getForm: (formId: number) => getForm(formId),
  editForm: (formId: number, form: FormSchema) => editForm(formId, form),
  unmountPage: () => unmountPage(FORMS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getFormTypesList: () => getFormTypes(),
  getCourtCasesList: () => getCourtCases(),
}

interface FormProps {
  isForceFetch: boolean
  selectedForm: FormSchema
  getForm: (formId: number) => void
  editForm: (id: number, form: FormSchema) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  formTypesList: FormTypeSchema[]
  getFormTypesList: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCasesList: () => void
}

const Form = (props: FormProps): React.ReactElement => {
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { isForceFetch } = props
  const { getForm, editForm } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props
  const { formTypesList, getFormTypesList, courtCasesList, getCourtCasesList } = props

  const [selectedForm, setSelectedForm] = useState<FormSchema>(DefaultFormSchema)
  const [selectedFormForReset, setSelectedFormForReset] = useState<FormSchema>(DefaultFormSchema)
  const [formStatusList, setFormStatusList] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      getForm(getNumber(id))
    }
    // add selectedForm.id to dependency array for note/history
  }, [id, getForm, selectedForm.id])

  useEffect(() => {
    if (isForceFetch) {
      statusList.form.all.length === 0 && getStatusesList()
      formTypesList.length === 0 && getFormTypesList()
      courtCasesList.length === 0 && getCourtCasesList()
    }
  }, [
    isForceFetch,
    statusList.form.all,
    getStatusesList,
    formTypesList.length,
    getFormTypesList,
    courtCasesList.length,
    getCourtCasesList,
  ])

  useEffect(() => {
    if (statusList.form.all.length > 0) {
      setFormStatusList(statusList.form.all)
    }
  }, [statusList.form.all])

  useEffect(() => {
    setSelectedForm(props.selectedForm)
    setSelectedFormForReset(props.selectedForm)
  }, [props.selectedForm])

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const inPageTopLinks = () => {
    const backToPage = searchQueryParams.get('backTo') || ''
    const prevPage = searchQueryParams.get('prevPage') || ''
    return (
      <Box sx={{ display: 'flex' }}>
        <Link text="View All Forms" navigateToPage="/forms/" color="primary" />
        {backToPage && (
          <Box sx={{ ml: 2 }}>
            <Link text={`Back to ${prevPage}`} navigateToPage={backToPage} color="primary" />
          </Box>
        )}
      </Box>
    )
  }

  const formPageTitle = () => {
    const courtCase = courtCasesList.find((x) => x.id === selectedForm.courtCaseId)
    return (
      <Typography component="h1" variant="h6" color="primary">
        {id
          ? `Form: ${selectedForm?.formType?.name}, ${courtCase?.client?.name}, ${courtCase?.caseType?.name}`
          : 'Form'}
      </Typography>
    )
  }

  const noForm = () => (
    <Typography component="h1" variant="h6" color="error" gutterBottom>
      Form not selected! Nothing to display! Go to All Forms and select one!!!
    </Typography>
  )

  const updateAction = () => {
    editForm(getNumber(id), selectedForm)
  }

  const formButtons = () => {
    return (
      <>
        <Button disabled={isAreTwoFormsSame(selectedForm, selectedFormForReset)} onClick={updateAction}>
          Update
        </Button>
        <Button
          disabled={isAreTwoFormsSame(selectedForm, selectedFormForReset)}
          onClick={() => setSelectedForm(selectedFormForReset)}
        >
          Cancel
        </Button>
      </>
    )
  }

  const formForm = () => (
    <FormForm
      selectedForm={selectedForm}
      setSelectedForm={setSelectedForm}
      formStatusList={formStatusList}
      isShowOneForm={true}
      formTypesList={formTypesList}
      courtCasesList={courtCasesList}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {inPageTopLinks()}
          {formPageTitle()}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {noForm()}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {formForm()}
              {formButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Typography component="h1" variant="h6" color="primary">
                Task Calendar of Form:
              </Typography>
              <Calendars formId={id} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Form)
