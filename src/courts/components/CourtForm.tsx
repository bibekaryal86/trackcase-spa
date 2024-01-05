import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import React from 'react'

import { STATES_LIST } from '../../constants'
import { CourtSchema } from '../types/courts.data.types'
import { handleCourtFormOnChange, isCourtFormFieldError } from '../utils/courts.utils'

interface CourtFormProps {
  selectedCourt: CourtSchema
  setSelectedCourt: (selectedCourt: CourtSchema) => void
  courtStatusList: string[]
  isShowOneCourt: boolean
}

const CourtForm = (props: CourtFormProps): React.ReactElement => {
  const { selectedCourt, setSelectedCourt, courtStatusList, isShowOneCourt } = props

  const courtName = () => (
    <TextField
      required
      autoFocus
      fullWidth
      variant="standard"
      id="court-name"
      label="Name"
      name="court-name"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedCourt.name || ''}
      onChange={(e) => handleCourtFormOnChange('name', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.name)}
    />
  )
  const courtStreetAddress = () => (
    <TextField
      required
      fullWidth
      variant="standard"
      name="court-street-address"
      label="Street Address"
      id="court-street-address"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedCourt.streetAddress || ''}
      onChange={(e) => handleCourtFormOnChange('streetAddress', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.streetAddress)}
    />
  )
  const courtPhoneNumber = () => (
    <TextField
      required
      variant="standard"
      name="court-phone-number"
      label="Phone"
      id="court-phone-number"
      margin="normal"
      sx={{ minWidth: 200 }}
      inputProps={{ maxLength: 15 }}
      value={selectedCourt.phoneNumber || ''}
      onChange={(e) => handleCourtFormOnChange('phoneNumber', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.phoneNumber, false, true)}
    />
  )
  const courtCity = () => (
    <TextField
      required
      sx={{ minWidth: 200 }}
      variant="standard"
      name="court-city"
      label="City"
      id="court-city"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedCourt.city || ''}
      onChange={(e) => handleCourtFormOnChange('city', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.city)}
    />
  )
  const courtState = () => (
    <FormControl
      sx={{ minWidth: 120, mt: '16px', mb: '8px' }}
      required
      error={isCourtFormFieldError(selectedCourt.state)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>State</InputLabel>
      <Select
        labelId="court-select-state"
        id="court-select-state-id"
        variant="standard"
        value={selectedCourt.state || ''}
        onChange={(e) => handleCourtFormOnChange('state', e.target.value, selectedCourt, setSelectedCourt)}
      >
        {STATES_LIST.map((state) => (
          <MenuItem key={state.abbreviation} value={state.abbreviation}>
            {state.abbreviation}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
  const courtZipCode = () => (
    <TextField
      required
      variant="standard"
      name="court-zip-code"
      label="Zip Code"
      id="court-zip-code"
      margin="normal"
      inputProps={{ maxLength: 5 }}
      value={selectedCourt.zipCode || ''}
      onChange={(e) => handleCourtFormOnChange('zipCode', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.zipCode, true)}
    />
  )
  const courtDhsAddress = () => (
    <TextField
      fullWidth
      variant="standard"
      name="court-dhs-address"
      label="DHS Address"
      id="court-dhs-address"
      margin="normal"
      inputProps={{ maxLength: 199 }}
      value={selectedCourt.dhsAddress || ''}
      onChange={(e) => handleCourtFormOnChange('dhsAddress', e.target.value, selectedCourt, setSelectedCourt)}
    />
  )
  const courtStatus = () => (
    <FormControl
      sx={{ minWidth: 120, mt: '16px', mb: '8px' }}
      required
      error={isCourtFormFieldError(selectedCourt.status)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>Status</InputLabel>
      <Select
        labelId="court-select-status"
        id="court-select-status-id"
        variant="standard"
        value={selectedCourt.status || ''}
        onChange={(e) => handleCourtFormOnChange('status', e.target.value, selectedCourt, setSelectedCourt)}
      >
        {courtStatusList.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
  const courtComments = () => (
    <TextField
      sx={{ mt: '16px', mb: '8px' }}
      id="court-comments"
      name="court-comments"
      label="Court Comments"
      variant="standard"
      fullWidth
      multiline
      maxRows={4}
      inputProps={{ maxLength: 8888 }}
      value={selectedCourt.comments || ''}
      onChange={(e) => handleCourtFormOnChange('comments', e.target.value, selectedCourt, setSelectedCourt)}
    />
  )

  return isShowOneCourt ? (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {courtName()}
        {courtStreetAddress()}
        {courtPhoneNumber()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {courtCity()}
        {courtState()}
        {courtZipCode()}
        {courtDhsAddress()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {courtStatus()}
        {courtComments()}
      </div>
    </div>
  ) : (
    <div>
      {courtName()}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {courtStreetAddress()}
        {courtPhoneNumber()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {courtCity()}
        {courtState()}
        {courtZipCode()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {courtDhsAddress()}
        {courtStatus()}
      </div>
    </div>
  )
}

export default CourtForm
