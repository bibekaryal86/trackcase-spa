import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { FormCommentsField, FormSelectField, FormSelectStatusField, GridFormWrapper } from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ID_DEFAULT } from '../../constants'
import { FormTypeSchema } from '../../types'
import { FormSchema } from '../types/forms.data.types'
import { handleFormFormOnChange, isFormFormFieldError } from '../utils/forms.utils'

interface FormFormProps {
  selectedForm: FormSchema
  setSelectedForm: (selectedForm: FormSchema) => void
  formStatusList: string[]
  isShowOneForm: boolean
  formTypesList: FormTypeSchema[]
  courtCasesList: CourtCaseSchema[]
}

const FormForm = (props: FormFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const { selectedForm, setSelectedForm, formStatusList, isShowOneForm } = props
  const { formTypesList, courtCasesList } = props

  const formTypesListForSelect = () =>
    formTypesList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const courtCasesListForSelect = () =>
    courtCasesList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.client?.name}, {x.caseType?.name}
      </MenuItem>
    ))

  const formType = () => (
    <FormSelectField
      componentLabel="Form--Form Type"
      required={true}
      value={selectedForm.formTypeId || ID_DEFAULT}
      onChange={(e) => handleFormFormOnChange('formTypeId', e.target.value, selectedForm, setSelectedForm)}
      error={isFormFormFieldError('formTypeId', selectedForm.formTypeId)}
      menuItems={formTypesListForSelect()}
    />
  )

  const formCourtCase = () => (
    <FormSelectField
      componentLabel="Form--Client, Case"
      required={true}
      value={selectedForm.courtCaseId || ID_DEFAULT}
      onChange={(e) => handleFormFormOnChange('courtCaseId', e.target.value, selectedForm, setSelectedForm)}
      error={isFormFormFieldError('courtCaseId', selectedForm.courtCaseId)}
      menuItems={courtCasesListForSelect()}
    />
  )

  const formStatus = () => (
    <FormSelectStatusField
      componentLabel="Form--Status"
      value={selectedForm.status || ''}
      onChange={(e) => handleFormFormOnChange('status', e.target.value, selectedForm, setSelectedForm)}
      statusList={formStatusList}
      error={isFormFormFieldError('status', selectedForm.status)}
    />
  )

  const formComments = () => (
    <FormCommentsField
      componentLabel="Form--Comments"
      value={selectedForm.comments || ''}
      onChange={(e) => handleFormFormOnChange('comments', e.target.value, selectedForm, setSelectedForm)}
    />
  )

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneForm}
      justifyContent={isShowOneForm ? 'flex-start' : 'flex-end'}
    >
      <Grid item xs={12}>
        {formType()}
      </Grid>
      <Grid item xs={12}>
        {formCourtCase()}
      </Grid>
      <Grid item xs={6}>
        {formStatus()}
      </Grid>
      {isShowOneForm && (
        <Grid item xs={12}>
          {formComments()}
        </Grid>
      )}
    </GridFormWrapper>
  )
}

export default FormForm
