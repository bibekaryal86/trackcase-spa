import { useMediaQuery } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import React from 'react'

import { STATES_LIST } from '../../constants'
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
    <TextField
      required
      autoFocus={!isShowOneClient}
      fullWidth
      label="Name"
      variant="standard"
      id="client-name-id"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedClient.name || ''}
      onChange={(e) => handleClientFormOnChange('name', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('name', selectedClient.name, selectedClient)}
    />
  )

  const clientANumber = () => (
    <TextField
      required={false}
      autoFocus={false}
      fullWidth
      label="A Number"
      variant="standard"
      id="client-a-number-id"
      margin="normal"
      inputProps={{ maxLength: 15 }}
      value={selectedClient.aNumber || ''}
      onChange={(e) => handleClientFormOnChange('aNumber', e.target.value, selectedClient, setSelectedClient)}
      error={false}
    />
  )

  const clientEmail = () => (
    <TextField
      required
      autoFocus={false}
      fullWidth
      label="Email"
      variant="standard"
      id="client-email-id"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedClient.email || ''}
      onChange={(e) => handleClientFormOnChange('email', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('email', selectedClient.email, selectedClient)}
    />
  )

  const clientPhoneNumber = () => (
    <TextField
      required
      autoFocus={false}
      fullWidth
      label="Phone"
      variant="standard"
      id="client-phone-number-id"
      margin="normal"
      inputProps={{ maxLength: 15 }}
      value={selectedClient.phoneNumber || ''}
      onChange={(e) => handleClientFormOnChange('phoneNumber', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('phoneNumber', selectedClient.phoneNumber, selectedClient)}
    />
  )

  const clientStreetAddress = () => (
    <TextField
      required={false}
      autoFocus={false}
      fullWidth
      label="Street Address"
      variant="standard"
      id="client-street-address-id"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedClient.streetAddress || ''}
      onChange={(e) => handleClientFormOnChange('streetAddress', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('streetAddress', selectedClient.streetAddress, selectedClient)}
    />
  )

  const clientCity = () => (
    <TextField
      required={false}
      autoFocus={false}
      fullWidth
      label="City"
      variant="standard"
      id="client-city-id"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedClient.city || ''}
      onChange={(e) => handleClientFormOnChange('city', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('city', selectedClient.city, selectedClient)}
    />
  )

  const clientState = () => (
    <FormControl
      sx={{ width: '100%', mt: '16px', mb: '8px' }}
      error={isClientFormFieldError('state', selectedClient.state, selectedClient)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>State</InputLabel>
      <Select
        labelId="client-select-state"
        id="client-state-id"
        variant="standard"
        value={selectedClient.state || ''}
        onChange={(e) => handleClientFormOnChange('state', e.target.value, selectedClient, setSelectedClient)}
      >
        {STATES_LIST.map((state) => (
          <MenuItem key={state.abbreviation} value={state.abbreviation}>
            {state.abbreviation}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const clientZipCode = () => (
    <TextField
      required={false}
      autoFocus={false}
      fullWidth
      label="Zip Code"
      variant="standard"
      id="client-zip-code-id"
      margin="normal"
      inputProps={{ maxLength: 5 }}
      value={selectedClient.zipCode || ''}
      onChange={(e) => handleClientFormOnChange('zipCode', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('zipCode', selectedClient.zipCode, selectedClient)}
    />
  )

  const clientStatus = () => (
    <FormControl
      sx={{ width: '100%', mt: '16px', mb: '8px' }}
      required
      error={isClientFormFieldError('status', selectedClient.status, selectedClient)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>Status</InputLabel>
      <Select
        labelId="client-select-status"
        id="client-status-id"
        variant="standard"
        value={selectedClient.status || ''}
        onChange={(e) => handleClientFormOnChange('status', e.target.value, selectedClient, setSelectedClient)}
      >
        {clientStatusList.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const clientJudgesList = () => (
    <FormControl sx={{ width: '100%', mt: '16px', mb: '8px' }}>
      <InputLabel sx={{ left: '-0.9em' }}>Judge</InputLabel>
      <Select
        labelId="client-select-judge"
        id="client-select-judge-id"
        variant="standard"
        value={!selectedClient.judgeId || selectedClient.judgeId <= 0 ? '' : selectedClient.judgeId}
        onChange={(e) =>
          handleClientFormOnChange('judgeId', e.target.value.toString(), selectedClient, setSelectedClient)
        }
      >
        {judgesList.map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const clientComments = () => (
    <TextField
      required={false}
      autoFocus={false}
      fullWidth
      label="Client Comments"
      variant="standard"
      id="client-comments-id"
      inputProps={{ maxLength: 8888 }}
      value={selectedClient.comments || ''}
      onChange={(e) => handleClientFormOnChange('comments', e.target.value, selectedClient, setSelectedClient)}
      error={false}
      sx={{ mt: '16px', mb: '8px' }}
      multiline={true}
      maxRows={4}
    />
  )

  return (
    <div style={{ width: isSmallScreen || !isShowOneClient ? '100%' : '50%' }}>
      <Grid
        container
        direction="row"
        justifyContent={isShowOneClient ? 'flex-start' : 'flex-end'}
        alignItems="center"
        spacing={isSmallScreen ? 1 : 2}
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
      </Grid>
    </div>
  )
}

export default ClientForm
