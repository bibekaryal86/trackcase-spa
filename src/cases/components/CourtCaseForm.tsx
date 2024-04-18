import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import React from 'react'

import { clientsListForSelect, handleFormChange, refTypesListForSelect } from '@app/components/CommonComponents'
import { FormCommentsField, FormSelectField, FormSelectStatusField, GridFormWrapper } from '@app/components/FormFields'
import { ClientSchema } from '@clients/types/clients.data.types'
import { USE_MEDIA_QUERY_INPUT } from '@constants/index'
import { CaseTypeSchema, ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'

import { CourtCaseFormData, CourtCaseFormErrorData } from '../types/courtCases.data.types'

interface CourtCaseFormProps {
  formData: CourtCaseFormData
  setFormData: (formData: CourtCaseFormData) => void
  formErrors: CourtCaseFormErrorData
  setFormErrors: (formErrors: CourtCaseFormErrorData) => void
  courtCaseStatusList: ComponentStatusSchema[]
  isShowOneCourtCase: boolean
  caseTypesList: CaseTypeSchema[]
  clientsList: ClientSchema[]
  clientId?: number
}

const CourtCaseForm = (props: CourtCaseFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, formErrors, setFormData, setFormErrors, courtCaseStatusList, isShowOneCourtCase } = props
  const { caseTypesList, clientsList, clientId } = props

  const courtCaseType = () => (
    <FormSelectField
      componentLabel="COURT CASE--CASE TYPE"
      required
      name="caseTypeId"
      value={formData.caseTypeId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.caseTypeError}
      helperText={formErrors.caseTypeError}
      menuItems={refTypesListForSelect(caseTypesList)}
    />
  )

  const courtCaseClient = () => (
    <FormSelectField
      componentLabel="COURT CASE--CLIENT"
      required
      name="clientId"
      value={formData.clientId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.clientError}
      helperText={formErrors.clientError}
      menuItems={clientsListForSelect(clientsList, clientId, formData.clientId)}
    />
  )

  const courtCaseStatus = () => (
    <FormSelectStatusField
      componentLabel="COURT CASE--STATUS"
      value={formData.componentStatusId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
      statusList={courtCaseStatusList}
    />
  )

  const courtCaseComments = () => (
    <FormCommentsField
      componentLabel="COURT CASE--COMMENTS"
      value={formData.comments}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
    />
  )

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneCourtCase}
      justifyContent={isShowOneCourtCase ? 'flex-start' : 'flex-end'}
    >
      <Grid item xs={12}>
        {courtCaseType()}
      </Grid>
      <Grid item xs={12}>
        {courtCaseClient()}
      </Grid>
      <Grid item xs={6}>
        {courtCaseStatus()}
      </Grid>
      {isShowOneCourtCase && (
        <Grid item xs={12}>
          {courtCaseComments()}
        </Grid>
      )}
    </GridFormWrapper>
  )
}

export default CourtCaseForm
