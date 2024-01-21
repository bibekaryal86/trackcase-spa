import { useMediaQuery } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
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
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const { selectedCourt, setSelectedCourt, courtStatusList, isShowOneCourt } = props

  const courtName = () => (
    <TextField
      required
      autoFocus={!isShowOneCourt}
      fullWidth
      label="Name"
      variant="standard"
      id="court-name-id"
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
      autoFocus={false}
      fullWidth
      label="Street Address"
      variant="standard"
      id="court-street-address-id"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedCourt.streetAddress || ''}
      onChange={(e) => handleCourtFormOnChange('streetAddress', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.streetAddress)}
    />
  )

  const courtCity = () => (
    <TextField
      required
      autoFocus={false}
      fullWidth
      label="City"
      variant="standard"
      id="court-city-id"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedCourt.city || ''}
      onChange={(e) => handleCourtFormOnChange('city', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.city)}
    />
  )

  const courtState = () => (
    <FormControl
      sx={{ width: '100%', mt: '16px', mb: '8px' }}
      required
      error={isCourtFormFieldError(selectedCourt.state)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>State</InputLabel>
      <Select
        labelId="court-select-state"
        id="court-state-id"
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
      autoFocus={false}
      fullWidth
      label="Zip Code"
      variant="standard"
      id="court-zip-code-id"
      margin="normal"
      inputProps={{ maxLength: 5 }}
      value={selectedCourt.zipCode || ''}
      onChange={(e) => handleCourtFormOnChange('zipCode', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.zipCode, true)}
    />
  )

  const courtPhoneNumber = () => (
    <TextField
      required
      autoFocus={false}
      fullWidth
      label="Phone"
      variant="standard"
      id="court-phone-number-id"
      margin="normal"
      inputProps={{ maxLength: 15 }}
      value={selectedCourt.phoneNumber || ''}
      onChange={(e) => handleCourtFormOnChange('phoneNumber', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.phoneNumber, false, true)}
    />
  )

  const courtDhsAddress = () => (
    <TextField
      required={false}
      autoFocus={false}
      fullWidth
      label="DHS Address"
      variant="standard"
      id="court-dhs-address-id"
      margin="normal"
      inputProps={{ maxLength: 199 }}
      value={selectedCourt.dhsAddress || ''}
      onChange={(e) => handleCourtFormOnChange('dhsAddress', e.target.value, selectedCourt, setSelectedCourt)}
      error={false}
    />
  )

  const courtStatus = () => (
    <FormControl
      sx={{ width: '100%', mt: '16px', mb: '8px' }}
      required
      error={isCourtFormFieldError(selectedCourt.status)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>Status</InputLabel>
      <Select
        labelId="court-select-status"
        id="court-status-id"
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
      required={false}
      autoFocus={false}
      fullWidth
      label="Court Comments"
      variant="standard"
      id="court-comments-id"
      inputProps={{ maxLength: 8888 }}
      value={selectedCourt.comments || ''}
      onChange={(e) => handleCourtFormOnChange('comments', e.target.value, selectedCourt, setSelectedCourt)}
      error={false}
      sx={{ mt: '16px', mb: '8px' }}
      multiline={true}
      maxRows={4}
    />
  )

  return (
    <div style={{ width: isSmallScreen || !isShowOneCourt ? '100%' : '50%' }}>
      <Grid container direction="row" justifyContent="center" alignItems="center" spacing={isSmallScreen ? 1 : 2}>
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
      </Grid>
    </div>
  )
}

export default CourtForm
