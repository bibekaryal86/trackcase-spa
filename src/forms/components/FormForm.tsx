import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStatusField,
  GridFormWrapper,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ID_DEFAULT } from '../../constants'
import { FormTypeSchema } from '../../types'
import { FormSchema } from '../types/forms.data.types'
import { handleFormDateOnChange, handleFormFormOnChange, isFormFormFieldError } from '../utils/forms.utils'

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

  const formSubmitDate = () => (
    <FormDatePickerField
      componentLabel="Form--Submit Date"
      value={selectedForm.submitDate}
      onChange={(newValue) => handleFormDateOnChange('submitDate', newValue, selectedForm, setSelectedForm )}
    />
  )

  const formReceiptDate = () => (
    <FormDatePickerField
      componentLabel="Form--Receipt Date"
      value={selectedForm.receiptDate}
      onChange={(newValue) => handleFormDateOnChange('receiptDate', newValue, selectedForm, setSelectedForm )}
    />
  )

  const formRfeDate = () => (
    <FormDatePickerField
      componentLabel="Form--RFE Date"
      value={selectedForm.rfeDate}
      onChange={(newValue) => handleFormDateOnChange('rfeDate', newValue, selectedForm, setSelectedForm )}
    />
  )

  const formRfeSubmitDate = () => (
    <FormDatePickerField
      componentLabel="Form--RFE Submit Date"
      value={selectedForm.rfeSubmitDate}
      onChange={(newValue) => handleFormDateOnChange('rfeSubmitDate', newValue, selectedForm, setSelectedForm )}
    />
  )

  const formDecisionDate = () => (
    <FormDatePickerField
      componentLabel="Form--Decision Date"
      value={selectedForm.decisionDate}
      onChange={(newValue) => handleFormDateOnChange('decisionDate', newValue, selectedForm, setSelectedForm )}
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
      <Grid item xs={3}>
        {formType()}
      </Grid>
      <Grid item xs={9}>
        {formCourtCase()}
      </Grid>
      <Grid item xs={6}>
        {formSubmitDate()}
      </Grid>
      <Grid item xs={6}>
        {formReceiptDate()}
      </Grid>
      <Grid item xs={6}>
        {formRfeDate()}
      </Grid>
      <Grid item xs={6}>
        {formRfeSubmitDate()}
      </Grid>
      <Grid item xs={6}>
        {formDecisionDate()}
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
