import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import React from 'react'

import {
  FormCommentsField,
  FormSelectStateField,
  FormSelectStatusField,
  FormTextField,
  GridFormWrapper,
  handleFormChange,
} from '../../app'
import { USE_MEDIA_QUERY_INPUT } from '../../constants'
import { ComponentStatusSchema } from '../../types'
import { CourtFormData, CourtFormErrorData } from '../types/courts.data.types'

interface CourtFormProps {
  formData: CourtFormData
  setFormData: (formData: CourtFormData) => void
  formErrors: CourtFormErrorData
  setFormErrors: (formErrors: CourtFormErrorData) => void
  courtStatusList: ComponentStatusSchema[]
  isShowOneCourt: boolean
}

const CourtForm = (props: CourtFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, formErrors, setFormData, setFormErrors, courtStatusList, isShowOneCourt } = props

  const courtName = () => (
    <FormTextField
      componentLabel="COURT--NAME"
      autoFocus={!isShowOneCourt}
      name="name"
      value={formData.name}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.name}
      helperText={formErrors.name}
      required
      fullWidth
    />
  )

  const courtStreetAddress = () => (
    <FormTextField
      componentLabel="COURT--STREET ADDRESS"
      name="streetAddress"
      value={formData.streetAddress}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.streetAddress}
      helperText={formErrors.streetAddress}
      fullWidth
    />
  )

  const courtCity = () => (
    <FormTextField
      componentLabel="COURT--CITY"
      name="city"
      value={formData.city}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.city}
      helperText={formErrors.city}
      fullWidth
    />
  )

  const courtState = () => (
    <FormSelectStateField
      componentLabel="COURT--STATE"
      value={formData.state}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.state}
      helperText={formErrors.state}
    />
  )

  const courtZipCode = () => (
    <FormTextField
      componentLabel="COURT--ZIP CODE"
      maxLength={5}
      name="zipCode"
      value={formData.zipCode}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.zipCode}
      helperText={formErrors.zipCode}
      fullWidth
    />
  )

  const courtPhoneNumber = () => (
    <FormTextField
      componentLabel="COURT--PHONE"
      maxLength={15}
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.phoneNumber}
      helperText={formErrors.phoneNumber}
      required
      fullWidth
    />
  )

  const courtDhsAddress = () => (
    <FormTextField
      componentLabel="COURT--DHS ADDRESS"
      maxLength={199}
      name="dhsAddress"
      value={formData.dhsAddress}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.dhsAddress}
      helperText={formErrors.dhsAddress}
      fullWidth
    />
  )

  const courtStatus = () => (
    <FormSelectStatusField
      componentLabel="COURT--STATUS"
      value={formData.componentStatusId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
      statusList={courtStatusList}
    />
  )

  const courtComments = () => (
    <FormCommentsField
      componentLabel="COURT--COMMENTS"
      value={formData.comments}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
    />
  )

  return (
    <GridFormWrapper isSmallScreen={isSmallScreen} isShowOne={isShowOneCourt}>
      <Grid item xs={12}>
        {courtName()}
      </Grid>
      <Grid item xs={8}>
        {courtStreetAddress()}
      </Grid>
      <Grid item xs={4}>
        {courtCity()}
      </Grid>
      <Grid item xs={6}>
        {courtState()}
      </Grid>
      <Grid item xs={6}>
        {courtZipCode()}
      </Grid>
      <Grid item xs={6}>
        {courtPhoneNumber()}
      </Grid>
      <Grid item xs={6}>
        {courtStatus()}
      </Grid>
      <Grid item xs={12}>
        {courtDhsAddress()}
      </Grid>
      {isShowOneCourt && (
        <Grid item xs={12}>
          {courtComments()}
        </Grid>
      )}
    </GridFormWrapper>
  )
}

export default CourtForm
