import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import dayjs from 'dayjs'
import React from 'react'

import { USE_MEDIA_QUERY_INPUT } from '@constants/index'

import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStatusField,
  FormTextField,
  getNumber,
  GridFormWrapper,
  handleFormChange,
  handleFormDateChange,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { CaseTypeSchema, ComponentStatusSchema } from '../../types'
import { FilingFormData, FilingFormErrorData } from '../types/filings.data.types'

interface FilingFormProps {
  formData: FilingFormData
  setFormData: (formData: FilingFormData) => void
  formErrors: FilingFormErrorData
  setFormErrors: (formErrors: FilingFormErrorData) => void
  filingStatusList: ComponentStatusSchema[]
  isShowOneFiling: boolean
  filingTypesList: CaseTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  courtCaseId?: number
}

const FilingForm = (props: FilingFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, formErrors, setFormData, setFormErrors, filingStatusList, isShowOneFiling } = props
  const { filingTypesList, courtCasesList, courtCaseId } = props

  const filingTypesListForSelect = () =>
    filingTypesList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const filingType = () => (
    <FormSelectField
      componentLabel="FILING--FILING TYPE"
      name="filingTypeId"
      value={formData.filingTypeId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.filingTypeError}
      helperText={formErrors.filingTypeError}
      menuItems={filingTypesListForSelect()}
      required
    />
  )

  const courtCasesListForSelect = () => {
    if (getNumber(courtCaseId) > 0) {
      const selectedCourtCase = courtCasesList.find((x) => x.id === courtCaseId)
      if (selectedCourtCase) {
        return [
          <MenuItem key={selectedCourtCase.id} value={selectedCourtCase.id}>
            {selectedCourtCase.client?.name}, {selectedCourtCase.caseType?.name}
          </MenuItem>,
        ]
      }
    } else {
      return courtCasesList
        .filter((x) => formData.courtCaseId === x.id || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.client?.name}, {x.caseType?.name}
          </MenuItem>
        ))
    }
    return []
  }

  const filingCourtCase = () => (
    <FormSelectField
      componentLabel="FILING--COURT CASE"
      name="courtCaseId"
      value={formData.courtCaseId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.courtCaseError}
      helperText={formErrors.courtCaseError}
      menuItems={courtCasesListForSelect()}
      required
    />
  )

  const filingSubmitDate = () => (
    <FormDatePickerField
      componentLabel="FILING--SUBMIT DATE"
      name="submitDate"
      value={formData.submitDate}
      onChange={(value) => handleFormDateChange('submitDate', value, formData, formErrors, setFormData, setFormErrors)}
      minDate={dayjs().subtract(1, 'week')}
      maxDate={dayjs().add(1, 'week')}
      helperText={formErrors.submitDateError}
    />
  )

  const filingReceiptDate = () => (
    <FormDatePickerField
      componentLabel="FILING--RECEIPT DATE"
      name="receiptDate"
      value={formData.receiptDate}
      onChange={(value) => handleFormDateChange('receiptDate', value, formData, formErrors, setFormData, setFormErrors)}
      minDate={dayjs().subtract(1, 'week')}
      maxDate={dayjs().add(1, 'week')}
      helperText={formErrors.receiptDateError}
    />
  )

  const filingReceiptNumber = () => (
    <FormTextField
      componentLabel="FILING--RECEIPT NUMBER"
      name="receiptNumber"
      value={formData.receiptNumber}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.receiptNumberError}
      helperText={formErrors.receiptNumberError}
      fullWidth
    />
  )

  const filingPriorityDate = () => (
    <FormDatePickerField
      componentLabel="FILING--PRIORITY DATE"
      name="priorityDate"
      value={formData.priorityDate}
      onChange={(value) =>
        handleFormDateChange('priorityDate', value, formData, formErrors, setFormData, setFormErrors)
      }
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
      helperText={formErrors.priorityDateError}
    />
  )

  const filingRfeDate = () => (
    <FormDatePickerField
      componentLabel="FILING--RFE DATE"
      name="rfeDate"
      value={formData.rfeDate}
      onChange={(value) => handleFormDateChange('rfeDate', value, formData, formErrors, setFormData, setFormErrors)}
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
      helperText={formErrors.rfeDateError}
    />
  )

  const filingRfeSubmitDate = () => (
    <FormDatePickerField
      componentLabel="FILING--RFE SUBMIT DATE"
      name="rfeSubmitDate"
      value={formData.rfeSubmitDate}
      onChange={(value) =>
        handleFormDateChange('rfeSubmitDate', value, formData, formErrors, setFormData, setFormErrors)
      }
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
      helperText={formErrors.rfeSubmitDateError}
    />
  )

  const filingDecisionDate = () => (
    <FormDatePickerField
      componentLabel="FILING--DECISION DATE"
      name="decisionDate"
      value={formData.decisionDate}
      onChange={(value) =>
        handleFormDateChange('decisionDate', value, formData, formErrors, setFormData, setFormErrors)
      }
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
      helperText={formErrors.decisionDateError}
    />
  )

  const filingStatus = () => (
    <FormSelectStatusField
      componentLabel="FILING--STATUS"
      value={formData.componentStatusId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
      statusList={filingStatusList}
    />
  )

  const filingComments = () => (
    <FormCommentsField
      componentLabel="FILING--COMMENTS"
      value={formData.comments}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
    />
  )

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneFiling}
      justifyContent={isShowOneFiling ? 'flex-start' : 'flex-end'}
    >
      <Grid item xs={12}>
        {filingCourtCase()}
      </Grid>
      <Grid item xs={6}>
        {filingType()}
      </Grid>
      <Grid item xs={6}>
        {filingReceiptNumber()}
      </Grid>
      <Grid item xs={6}>
        {filingSubmitDate()}
      </Grid>
      <Grid item xs={6}>
        {filingReceiptDate()}
      </Grid>
      <Grid item xs={6}>
        {filingPriorityDate()}
      </Grid>
      <Grid item xs={6}>
        {filingRfeDate()}
      </Grid>
      <Grid item xs={6}>
        {filingRfeSubmitDate()}
      </Grid>
      <Grid item xs={6}>
        {filingDecisionDate()}
      </Grid>
      <Grid item xs={6}>
        {filingStatus()}
      </Grid>
      {isShowOneFiling && (
        <Grid item xs={12}>
          {filingComments()}
        </Grid>
      )}
    </GridFormWrapper>
  )
}

export default FilingForm
