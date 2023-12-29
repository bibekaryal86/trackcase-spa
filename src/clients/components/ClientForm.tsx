import FormControl from '@mui/material/FormControl'
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
  const { selectedClient, setSelectedClient, clientStatusList, isShowOneClient, judgesList } = props

  const clientName = () => (
    <TextField
      required
      autoFocus
      fullWidth
      variant="standard"
      id="client-name"
      label="Name"
      name="client-name"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedClient.name}
      onChange={(e) => handleClientFormOnChange('name', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('name', selectedClient.name, selectedClient)}
    />
  )
  const clientANumber = () => (
    <TextField
      fullWidth
      variant="standard"
      name="client-a-number"
      label="A Number"
      id="client-a-number"
      margin="normal"
      inputProps={{ maxLength: 10 }}
      value={selectedClient.a_number}
      onChange={(e) => handleClientFormOnChange('aNumber', e.target.value, selectedClient, setSelectedClient)}
    />
  )
  const clientEmail = () => (
    <TextField
      required
      fullWidth
      variant="standard"
      name="client-email"
      label="Email"
      id="client-email"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedClient.email}
      onChange={(e) => handleClientFormOnChange('email', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('email', selectedClient.name, selectedClient)}
    />
  )
  const clientPhoneNumber = () => (
    <TextField
      required
      variant="standard"
      name="client-phone-number"
      label="Phone"
      id="client-phone-number"
      margin="normal"
      sx={{ minWidth: 200 }}
      inputProps={{ maxLength: 10 }}
      value={selectedClient.phone_number}
      onChange={(e) => handleClientFormOnChange('phoneNumber', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('phoneNumber', selectedClient.name, selectedClient)}
    />
  )
  const clientStreetAddress = () => (
    <TextField
      fullWidth
      variant="standard"
      name="client-street-address"
      label="Street Address"
      id="client-street-address"
      margin="normal"
      inputProps={{ maxLength: 999 }}
      value={selectedClient.street_address}
      onChange={(e) => handleClientFormOnChange('streetAddress', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('streetAddress', selectedClient.name, selectedClient)}
    />
  )

  const clientCity = () => (
    <TextField
      required
      sx={{ minWidth: 200 }}
      variant="standard"
      name="client-city"
      label="City"
      id="client-city"
      margin="normal"
      inputProps={{ maxLength: 999 }}
      value={selectedClient.city}
      onChange={(e) => handleClientFormOnChange('city', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('city', selectedClient.name, selectedClient)}
    />
  )
  const clientState = () => (
    <FormControl
      sx={{ minWidth: 120, mt: '16px', mb: '8px' }}
      required
      error={isClientFormFieldError('state', selectedClient.name, selectedClient)}
    >
      <InputLabel>State</InputLabel>
      <Select
        labelId="client-select-state"
        id="client-select-state-id"
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
      required
      variant="standard"
      name="client-zip-code"
      label="Zip Code"
      id="client-zip-code"
      margin="normal"
      inputProps={{ maxLength: 5 }}
      value={selectedClient.zip_code}
      onChange={(e) => handleClientFormOnChange('zipCode', e.target.value, selectedClient, setSelectedClient)}
      error={isClientFormFieldError('zipCode', selectedClient.name, selectedClient)}
    />
  )
  const clientStatus = () => (
    <FormControl
      sx={{ minWidth: 120, mt: '16px', mb: '8px' }}
      required
      error={isClientFormFieldError('status', selectedClient.name, selectedClient)}
    >
      <InputLabel>Status</InputLabel>
      <Select
        labelId="client-select-status"
        id="client-select-status-id"
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
  const clientComments = () => (
    <TextField
      sx={{ mt: '16px', mb: '8px' }}
      id="client-comments"
      name="client-comments"
      label="Client Comments"
      variant="standard"
      fullWidth
      multiline
      maxRows={4}
      inputProps={{ maxLength: 8888 }}
      value={selectedClient.comments || ''}
      onChange={(e) => handleClientFormOnChange('comments', e.target.value, selectedClient, setSelectedClient)}
    />
  )
  const clientJudgesList = () => (
    <FormControl
      sx={{ minWidth: 425, mt: '16px', mb: '8px' }}
      required
      error={!selectedClient.judge_id || selectedClient.judge_id <= 0}
    >
      <InputLabel sx={{ left: '-0.9em' }}>Court</InputLabel>
      <Select
        labelId="client-select-judge"
        id="client-select-judge-id"
        variant="standard"
        value={!selectedClient.judge_id || selectedClient.judge_id <= 0 ? '' : selectedClient.judge_id}
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

  return isShowOneClient ? (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {clientName()}
        {clientPhoneNumber()}
        {clientEmail()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {clientStreetAddress()}
        {clientCity()}
        {clientState()}
        {clientZipCode()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {clientANumber()}
        {clientJudgesList()}
        {clientStatus()}
      </div>
      {clientComments()}
    </div>
  ) : (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {clientName()}
        {clientPhoneNumber()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {clientEmail()}
        {clientStreetAddress()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {clientCity()}
        {clientState()}
        {clientZipCode()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {clientANumber()}
        {clientJudgesList()}
        {clientStatus()}
      </div>
    </div>
  )
}

export default ClientForm
