import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import {
  FormCommentsField,
  FormSelectField,
  FormSelectStateField,
  FormSelectStatusField,
  FormTextField,
  getNumber,
  GridFormWrapper,
  handleFormChange,
} from '../../app'
import { ID_DEFAULT, USE_MEDIA_QUERY_INPUT } from '../../constants'
import { JudgeSchema } from '../../judges'
import { ComponentStatusSchema } from '../../types'
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
      componentLabel="CLIENT--NAME"
      autoFocus={!isShowOneClient}
      name="name"
      value={formData.name}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.name}
      helperText={formErrors.name}
    />
  )

  const clientANumber = () => (
    <FormTextField
      componentLabel="CLIENT--A NUMBER"
      name="aNumber"
      required={false}
      value={formData.aNumber}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.aNumber}
      helperText={formErrors.aNumber}
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
    />
  )

  const clientStreetAddress = () => (
    <FormTextField
      componentLabel="CLIENT--STREET ADDRESS"
      required={false}
      name="streetAddress"
      value={formData.streetAddress}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.streetAddress}
      helperText={formErrors.streetAddress}
    />
  )

  const clientCity = () => (
    <FormTextField
      componentLabel="CLIENT--CITY"
      required={false}
      name="city"
      value={formData.city}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.city}
      helperText={formErrors.city}
    />
  )

  const clientState = () => (
    <FormSelectStateField
      componentLabel="CLIENT--STATE"
      name="state"
      value={formData.state}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.state}
      helperText={formErrors.state}
    />
  )

  const clientZipCode = () => (
    <FormTextField
      componentLabel="CLIENT--ZIP CODE"
      required={false}
      maxLength={5}
      name="zipCode"
      value={formData.zipCode}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.zipCode}
      helperText={formErrors.zipCode}
    />
  )

  const judgesListForSelect = () => {
    if (getNumber(judgeId) > 0) {
      const selectedJudge = judgesList.find((x) => x.id === judgeId)
      if (selectedJudge) {
        return [
          <MenuItem key={selectedJudge.id} value={selectedJudge.id}>
            {selectedJudge.name}
          </MenuItem>,
        ]
      }
    } else {
      return judgesList
        .filter((x) => formData.judgeId === x.id || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.name}
          </MenuItem>
        ))
    }
    return []
  }

  const clientJudgesList = () => (
    <FormSelectField
      componentLabel="CLIENT--JUDGE"
      name="judgeId"
      required
      value={formData.judgeId || ID_DEFAULT}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      menuItems={judgesListForSelect()}
      error={!!formErrors.judgeError}
      helperText={formErrors.judgeError}
    />
  )

  const clientStatus = () => (
    <FormSelectStatusField
      componentLabel="CLIENT--STATUS"
      name="componentStatusId"
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
      name="comments"
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
      <Grid item xs={12}>
        {clientName()}
      </Grid>
      <Grid item xs={6}>
        {clientANumber()}
      </Grid>
      <Grid item xs={6}>
        {clientPhoneNumber()}
      </Grid>
      <Grid item xs={12}>
        {clientEmail()}
      </Grid>
      <Grid item xs={8}>
        {clientStreetAddress()}
      </Grid>
      <Grid item xs={4}>
        {clientCity()}
      </Grid>
      <Grid item xs={6}>
        {clientState()}
      </Grid>
      <Grid item xs={6}>
        {clientZipCode()}
      </Grid>
      <Grid item xs={12}>
        {clientJudgesList()}
      </Grid>
      <Grid item xs={6}>
        {clientStatus()}
      </Grid>
      {isShowOneClient && (
        <Grid item xs={12}>
          {clientComments()}
        </Grid>
      )}
    </GridFormWrapper>
  )
}

export default ClientForm
