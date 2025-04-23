import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import dayjs from 'dayjs'
import React from 'react'

import {
  courtCasesListForSelect,
  filingListForSelect,
  handleFormChange,
  handleFormDateChange,
  refTypesListForSelect,
} from '@app/components/CommonComponents'
import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStatusField,
  FormTextField,
  GridFormWrapper,
} from '@app/components/FormFields'
import { CourtCaseFormData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ClientSchema } from '@clients/types/clients.data.types'
import { USE_MEDIA_QUERY_INPUT } from '@constants/index'
import { ComponentStatusSchema, FilingTypeSchema } from '@ref_types/types/refTypes.data.types'

import {
  FilingFormData,
  FilingFormErrorData,
  FilingRfeFormData,
  FilingRfeFormErrorData,
  FilingSchema,
} from '../types/filings.data.types'

interface FilingFormProps {
  formData: FilingFormData
  setFormData: (formData: FilingFormData) => void
  formErrors: FilingFormErrorData
  setFormErrors: (formErrors: FilingFormErrorData) => void
  filingStatusList: ComponentStatusSchema[]
  isShowOneFiling: boolean
  filingTypesList: FilingTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  selectedCourtCase?: CourtCaseFormData
}

interface FilingRfeFormProps {
  formData: FilingRfeFormData
  setFormData: (formData: FilingRfeFormData) => void
  formErrors: FilingRfeFormErrorData
  setFormErrors: (formErrors: FilingRfeFormErrorData) => void
  filingsList: FilingSchema[]
  filingTypesList: FilingTypeSchema[]
  courtCasesList: CourtCaseSchema[]
  clientsList: ClientSchema[]
}

export const FilingForm = (props: FilingFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, formErrors, setFormData, setFormErrors, filingStatusList, isShowOneFiling } = props
  const { filingTypesList, courtCasesList } = props
  const { selectedCourtCase } = props

  const filingType = () => (
    <FormSelectField
      componentLabel="FILING--FILING TYPE"
      name="filingTypeId"
      value={formData.filingTypeId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.filingTypeError}
      helperText={formErrors.filingTypeError}
      menuItems={refTypesListForSelect(filingTypesList)}
      required
    />
  )

  const filingCourtCase = () => (
    <FormSelectField
      componentLabel="FILING--COURT CASE"
      name="courtCaseId"
      value={formData.courtCaseId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.courtCaseError}
      helperText={formErrors.courtCaseError}
      menuItems={courtCasesListForSelect(courtCasesList, selectedCourtCase, formData.courtCaseId)}
      required
      disabled={!!selectedCourtCase}
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
      <Grid size={12}>{filingCourtCase()}</Grid>
      <Grid size={6}>{filingType()}</Grid>
      <Grid size={6}>{filingReceiptNumber()}</Grid>
      <Grid size={6}>{filingSubmitDate()}</Grid>
      <Grid size={6}>{filingReceiptDate()}</Grid>
      <Grid size={6}>{filingPriorityDate()}</Grid>
      <Grid size={6}>{filingDecisionDate()}</Grid>
      <Grid size={6}>{filingStatus()}</Grid>
      {isShowOneFiling && <Grid size={12}>{filingComments()}</Grid>}
    </GridFormWrapper>
  )
}

export const FilingFormRfe = (props: FilingRfeFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, formErrors, setFormData, setFormErrors } = props
  const { filingsList, courtCasesList, clientsList } = props

  const filingRfeFiling = () => (
    <FormSelectField
      componentLabel="FILING RFE--FILING"
      name="filingId"
      value={formData.filingId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.filingIdError}
      helperText={formErrors.filingIdError}
      menuItems={filingListForSelect(filingsList, clientsList, courtCasesList)}
      required
      disabled
    />
  )

  const filingRfeRfeDate = () => (
    <FormDatePickerField
      componentLabel="FILING RFE--RFE DATE"
      name="rfeDate"
      value={formData.rfeDate}
      onChange={(value) => handleFormDateChange('rfeDate', value, formData, formErrors, setFormData, setFormErrors)}
      minDate={dayjs().subtract(1, 'month')}
      maxDate={dayjs().add(1, 'month')}
      helperText={formErrors.rfeDateError}
      required
    />
  )

  const filingRfeRfeSubmitDate = () => (
    <FormDatePickerField
      componentLabel="FILING RFE--RFE SUBMIT DATE"
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

  const filingRfeRfeReason = () => (
    <FormTextField
      componentLabel="FILING RFE--RFE REASON"
      name="rfeReason"
      value={formData.rfeReason}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.rfeReason}
      helperText={formErrors.rfeReason}
      required
      fullWidth
    />
  )

  const filingRfeComments = () => (
    <FormCommentsField
      componentLabel="FILING RFE--COMMENTS"
      value={formData.comments}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
    />
  )

  return (
    <GridFormWrapper isSmallScreen={isSmallScreen}>
      <Grid size={12}>{filingRfeFiling()}</Grid>
      <Grid size={6}>{filingRfeRfeDate()}</Grid>
      <Grid size={6}>{filingRfeRfeSubmitDate()}</Grid>
      <Grid size={12}>{filingRfeRfeReason()}</Grid>
      <Grid size={12}>{filingRfeComments()}</Grid>
    </GridFormWrapper>
  )
}
