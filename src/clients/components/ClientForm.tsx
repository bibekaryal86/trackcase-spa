import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import {
  FormCommentsField,
  FormSelectField,
  FormSelectState,
  FormSelectStatus,
  FormTextField,
  GridFormWrapper,
} from '../../app'
import { JudgeSchema } from '../../judges'
import { ClientSchema } from '../types/clients.data.types'
import { handleClientFormOnChange, isClientFormFieldError } from '../utils/clients.utils'

interface ClientFormProps {
  selectedClient: ClientSchema
  setSelectedClient: (selectedClient: ClientSchema) => void
  clientStatusList: string[]
  isShowOneClient: boolean
  judgesList: JudgeSchema[]
}

const ClientForm = (props: ClientFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const { selectedClient, setSelectedClient, clientStatusList, isShowOneClient, judgesList } = props

  const clientName = () => (
    <FormTextField
      component="client"
      label="Name"
      autoFocus={!isShowOneClient}
      value={selectedClient.name || ''}
      onChange={(e) => handleClientFormOnChange('name', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('name', selectedClient.name, selectedClient)}
    />
  )

  const clientANumber = () => (
    <FormTextField
      component="client"
      label="A Number"
      required={false}
      value={selectedClient.aNumber || ''}
      onChange={(e) => handleClientFormOnChange('aNumber', e.target.value, selectedClient, setSelectedClient)}
    />
  )

  const clientEmail = () => (
    <FormTextField
      component="client"
      label="Email"
      value={selectedClient.email || ''}
      onChange={(e) => handleClientFormOnChange('email', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('email', selectedClient.email, selectedClient)}
    />
  )

  const clientPhoneNumber = () => (
    <FormTextField
      component="client"
      label="Phone"
      maxLength={15}
      value={selectedClient.phoneNumber || ''}
      onChange={(e) => handleClientFormOnChange('phoneNumber', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('phoneNumber', selectedClient.phoneNumber, selectedClient)}
    />
  )

  const clientStreetAddress = () => (
    <FormTextField
      component="client"
      label="Street Address"
      required={false}
      value={selectedClient.streetAddress || ''}
      onChange={(e) => handleClientFormOnChange('streetAddress', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('streetAddress', selectedClient.streetAddress, selectedClient)}
    />
  )

  const clientCity = () => (
    <FormTextField
      component="client"
      label="City"
      required={false}
      value={selectedClient.city || ''}
      onChange={(e) => handleClientFormOnChange('city', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('city', selectedClient.city, selectedClient)}
    />
  )

  const clientState = () => (
    <FormSelectState
      component="client"
      inputLabel="State"
      value={selectedClient.state || ''}
      onChange={(e) => handleClientFormOnChange('state', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('state', selectedClient.state, selectedClient)}
    />
  )

  const clientZipCode = () => (
    <FormTextField
      component="client"
      label="Zip Code"
      required={false}
      maxLength={5}
      value={selectedClient.zipCode || ''}
      onChange={(e) => handleClientFormOnChange('zipCode', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('zipCode', selectedClient.zipCode, selectedClient)}
    />
  )

  const clientStatus = () => (
    <FormSelectStatus
      component="client"
      value={selectedClient.status || ''}
      onChange={(e) => handleClientFormOnChange('status', e.target.value, selectedClient, setSelectedClient)}
      statusList={clientStatusList}
      error={isClientFormFieldError('status', selectedClient.status, selectedClient)}
    />
  )

  const judgesListForSelect = () =>
    judgesList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const clientJudgesList = () => (
    <FormSelectField
      component="client"
      inputLabel="Judge"
      value={!selectedClient.judgeId || selectedClient.judgeId <= 0 ? '' : selectedClient.judgeId}
      onChange={(e) =>
        handleClientFormOnChange('judgeId', e.target.value.toString(), selectedClient, setSelectedClient)
      }
      selectOptions={judgesList}
      menuItems={judgesListForSelect()}
    />
  )

  const clientComments = () => (
    <FormCommentsField
      component="client"
      value={selectedClient.comments || ''}
      onChange={(e) => handleClientFormOnChange('comments', e.target.value, selectedClient, setSelectedClient)}
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
