import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import React from 'react'

import {
  FormCommentsField,
  FormSelectStateField,
  FormSelectStatusField,
  FormTextField,
  GridFormWrapper,
} from '../../app'
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
    <FormTextField
      componentLabel="Court--Name"
      autoFocus={!isShowOneCourt}
      value={selectedCourt.name || ''}
      onChange={(e) => handleCourtFormOnChange('name', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.name)}
    />
  )

  const courtStreetAddress = () => (
    <FormTextField
      componentLabel="Court--Street Address"
      value={selectedCourt.streetAddress || ''}
      onChange={(e) => handleCourtFormOnChange('streetAddress', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.streetAddress)}
    />
  )

  const courtCity = () => (
    <FormTextField
      componentLabel="Court--City"
      value={selectedCourt.city || ''}
      onChange={(e) => handleCourtFormOnChange('city', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.city)}
    />
  )

  const courtState = () => (
    <FormSelectStateField
      componentLabel="Court--State"
      value={selectedCourt.state || ''}
      onChange={(e) => handleCourtFormOnChange('state', e.target.value, selectedCourt, setSelectedCourt)}
      required={true}
      error={isCourtFormFieldError(selectedCourt.state)}
    />
  )

  const courtZipCode = () => (
    <FormTextField
      componentLabel="Court--Zip Code"
      maxLength={5}
      value={selectedCourt.zipCode || ''}
      onChange={(e) => handleCourtFormOnChange('zipCode', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.zipCode, true)}
    />
  )

  const courtPhoneNumber = () => (
    <FormTextField
      componentLabel="Court--Phone"
      maxLength={15}
      value={selectedCourt.phoneNumber || ''}
      onChange={(e) => handleCourtFormOnChange('phoneNumber', e.target.value, selectedCourt, setSelectedCourt)}
      error={isCourtFormFieldError(selectedCourt.phoneNumber, false, true)}
    />
  )

  const courtDhsAddress = () => (
    <FormTextField
      componentLabel="Court--DHS Address"
      required={false}
      maxLength={199}
      value={selectedCourt.dhsAddress || ''}
      onChange={(e) => handleCourtFormOnChange('dhsAddress', e.target.value, selectedCourt, setSelectedCourt)}
    />
  )

  const courtStatus = () => (
    <FormSelectStatusField
      componentLabel="Court--Status"
      value={selectedCourt.status || ''}
      onChange={(e) => handleCourtFormOnChange('status', e.target.value, selectedCourt, setSelectedCourt)}
      statusList={courtStatusList}
      error={isCourtFormFieldError(selectedCourt.status)}
    />
  )

  const courtComments = () => (
    <FormCommentsField
      componentLabel="Court--Comments"
      value={selectedCourt.comments || ''}
      onChange={(e) => handleCourtFormOnChange('comments', e.target.value, selectedCourt, setSelectedCourt)}
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
