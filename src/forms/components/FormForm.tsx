import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import dayjs from 'dayjs'
import React from 'react'

import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStatusField,
  FormTextField,
  getComments,
  getNumber,
  getString,
  GridFormWrapper,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { USE_MEDIA_QUERY_INPUT } from '../../constants'
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
  courtCaseId?: string
}

const FormForm = (props: FormFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { selectedForm, setSelectedForm, formStatusList, isShowOneForm, courtCaseId } = props
  const { formTypesList, courtCasesList } = props

  const formTypesListForSelect = () =>
    formTypesList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const courtCasesListForSelect = () => {
    if (getNumber(courtCaseId) > 0) {
      const selectedClient = courtCasesList.find((x) => x.id === Number(courtCaseId))
      if (selectedClient) {
        return [
          <MenuItem key={selectedClient.id} value={selectedClient.id}>
            {selectedClient.client?.name}, {selectedClient.caseType?.name}
          </MenuItem>,
        ]
      }
    } else {
      return courtCasesList.map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.client?.name}, {x.caseType?.name}
        </MenuItem>
      ))
    }
    return []
  }

  const formType = () => (
    <FormSelectField
      componentLabel="Form--Form Type"
      required={true}
      value={selectedForm.formTypeId}
      onChange={(e) => handleFormFormOnChange('formTypeId', e.target.value, selectedForm, setSelectedForm, getNumber)}
      error={isFormFormFieldError('formTypeId', selectedForm.formTypeId)}
      menuItems={formTypesListForSelect()}
    />
  )

  const formCourtCase = () => (
    <FormSelectField
      componentLabel="Form--Client, Case"
      required={true}
      value={selectedForm.courtCaseId}
      onChange={(e) => handleFormFormOnChange('courtCaseId', e.target.value, selectedForm, setSelectedForm, getNumber)}
      error={isFormFormFieldError('courtCaseId', selectedForm.courtCaseId)}
      menuItems={courtCasesListForSelect()}
    />
  )

  const formSubmitDate = () => (
    <FormDatePickerField
      componentLabel="Form--Submit Date"
      value={selectedForm.submitDate}
      onChange={(newValue) => handleFormDateOnChange('submitDate', newValue, selectedForm, setSelectedForm)}
      minDate={dayjs().subtract(1, 'week')}
      maxDate={dayjs().add(1, 'week')}
    />
  )

  const formReceiptDate = () => (
    <FormDatePickerField
      componentLabel="Form--Receipt Date"
      value={selectedForm.receiptDate}
      onChange={(newValue) => handleFormDateOnChange('receiptDate', newValue, selectedForm, setSelectedForm)}
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
    />
  )

  const formReceiptNumber = () => (
    <FormTextField
      componentLabel="Form--Receipt Number"
      required={false}
      value={selectedForm.receiptNumber}
      onChange={(e) =>
        handleFormFormOnChange('receiptNumber', e.target.value, selectedForm, setSelectedForm, getString)
      }
    />
  )

  const formPriorityDate = () => (
    <FormDatePickerField
      componentLabel="Form--Priority Date"
      value={selectedForm.priorityDate}
      onChange={(newValue) => handleFormDateOnChange('priorityDate', newValue, selectedForm, setSelectedForm)}
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
    />
  )

  const formRfeDate = () => (
    <FormDatePickerField
      componentLabel="Form--RFE Date"
      value={selectedForm.rfeDate}
      onChange={(newValue) => handleFormDateOnChange('rfeDate', newValue, selectedForm, setSelectedForm)}
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
    />
  )

  const formRfeSubmitDate = () => (
    <FormDatePickerField
      componentLabel="Form--RFE Submit Date"
      value={selectedForm.rfeSubmitDate}
      onChange={(newValue) => handleFormDateOnChange('rfeSubmitDate', newValue, selectedForm, setSelectedForm)}
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
    />
  )

  const formDecisionDate = () => (
    <FormDatePickerField
      componentLabel="Form--Decision Date"
      value={selectedForm.decisionDate}
      onChange={(newValue) => handleFormDateOnChange('decisionDate', newValue, selectedForm, setSelectedForm)}
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
    />
  )

  const formStatus = () => (
    <FormSelectStatusField
      componentLabel="Form--Status"
      value={selectedForm.status}
      onChange={(e) => handleFormFormOnChange('status', e.target.value, selectedForm, setSelectedForm, getString)}
      statusList={formStatusList}
      error={isFormFormFieldError('status', selectedForm.status)}
    />
  )

  const formComments = () => (
    <FormCommentsField
      componentLabel="Form--Comments"
      value={selectedForm.comments}
      onChange={(e) => handleFormFormOnChange('comments', e.target.value, selectedForm, setSelectedForm, getComments)}
    />
  )

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneForm}
      justifyContent={isShowOneForm ? 'flex-start' : 'flex-end'}
    >
      <Grid item xs={12}>
        {formCourtCase()}
      </Grid>
      <Grid item xs={6}>
        {formType()}
      </Grid>
      <Grid item xs={6}>
        {formReceiptNumber()}
      </Grid>
      <Grid item xs={6}>
        {formSubmitDate()}
      </Grid>
      <Grid item xs={6}>
        {formReceiptDate()}
      </Grid>
      <Grid item xs={6}>
        {formPriorityDate()}
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
