import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import React from 'react'

import { handleFormChange, judgesListForSelect } from '@app/components/CommonComponents'
import {
  FormCommentsField,
  FormSelectField,
  FormSelectStateField,
  FormSelectStatusField,
  FormTextField,
  GridFormWrapper,
} from '@app/components/FormFields'
import { ID_DEFAULT, USE_MEDIA_QUERY_INPUT } from '@constants/index'
import { JudgeSchema } from '@judges/types/judges.data.types'
import { ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'

import { ClientFormData, ClientFormErrorData } from '../types/clients.data.types'

interface ClientFormProps {
  formData: ClientFormData
  setFormData: (formData: ClientFormData) => void
  formErrors: ClientFormErrorData
  setFormErrors: (formErrors: ClientFormErrorData) => void
  clientStatusList: ComponentStatusSchema[]
  isShowOneClient: boolean
  judgeId?: number
  judgesList: JudgeSchema[]
}

const ClientForm = (props: ClientFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, formErrors, setFormData, setFormErrors, clientStatusList, isShowOneClient } = props
  const { judgeId, judgesList } = props

  const clientName = () => (
    <FormTextField
      autoFocus={!isShowOneClient}
      componentLabel="CLIENT--NAME"
      name="name"
      value={formData.name}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.name}
      helperText={formErrors.name}
      required
      fullWidth
    />
  )

  const clientANumber = () => (
    <FormTextField
      componentLabel="CLIENT--A NUMBER"
      name="aNumber"
      value={formData.aNumber}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.aNumber}
      helperText={formErrors.aNumber}
      fullWidth
    />
  )

  const clientEmail = () => (
    <FormTextField
      componentLabel="CLIENT--EMAIL"
      name="email"
      value={formData.email}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.email}
      helperText={formErrors.email}
      required
      fullWidth
    />
  )

  const clientPhoneNumber = () => (
    <FormTextField
      componentLabel="CLIENT--PHONE"
      name="phoneNumber"
      maxLength={15}
      value={formData.phoneNumber}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.phoneNumber}
      helperText={formErrors.phoneNumber}
      required
      fullWidth
    />
  )

  const clientStreetAddress = () => (
    <FormTextField
      componentLabel="CLIENT--STREET ADDRESS"
      name="streetAddress"
      value={formData.streetAddress}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.streetAddress}
      helperText={formErrors.streetAddress}
      fullWidth
    />
  )

  const clientCity = () => (
    <FormTextField
      componentLabel="CLIENT--CITY"
      name="city"
      value={formData.city}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.city}
      helperText={formErrors.city}
      fullWidth
    />
  )

  const clientState = () => (
    <FormSelectStateField
      componentLabel="CLIENT--STATE"
      value={formData.state}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.state}
      helperText={formErrors.state}
    />
  )

  const clientZipCode = () => (
    <FormTextField
      componentLabel="CLIENT--ZIP CODE"
      maxLength={5}
      name="zipCode"
      value={formData.zipCode}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.zipCode}
      helperText={formErrors.zipCode}
      fullWidth
    />
  )

  const clientJudgesList = () => (
    <FormSelectField
      componentLabel="CLIENT--JUDGE"
      name="judgeId"
      value={formData.judgeId || ID_DEFAULT}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      menuItems={judgesListForSelect(judgesList, judgeId, formData.judgeId)}
      error={!!formErrors.judgeError}
      helperText={formErrors.judgeError}
    />
  )

  const clientStatus = () => (
    <FormSelectStatusField
      componentLabel="CLIENT--STATUS"
      value={formData.componentStatusId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
      statusList={clientStatusList}
    />
  )

  const clientComments = () => (
    <FormCommentsField
      componentLabel="CLIENT--COMMENTS"
      value={formData.comments}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
    />
  )

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneClient}
      justifyContent={isShowOneClient ? 'flex-start' : 'flex-end'}
    >
      <Grid size={12}>{clientName()}</Grid>
      <Grid size={6}>{clientANumber()}</Grid>
      <Grid size={6}>{clientPhoneNumber()}</Grid>
      <Grid size={12}>{clientEmail()}</Grid>
      <Grid size={8}>{clientStreetAddress()}</Grid>
      <Grid size={4}>{clientCity()}</Grid>
      <Grid size={6}>{clientState()}</Grid>
      <Grid size={6}>{clientZipCode()}</Grid>
      <Grid size={12}>{clientJudgesList()}</Grid>
      <Grid size={6}>{clientStatus()}</Grid>
      {isShowOneClient && <Grid size={12}>{clientComments()}</Grid>}
    </GridFormWrapper>
  )
}

export default ClientForm
