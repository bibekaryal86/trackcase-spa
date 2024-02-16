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
  getComments,
  getNumber,
  getString,
  GridFormWrapper,
} from '../../app'
import { ID_DEFAULT, USE_MEDIA_QUERY_INPUT } from '../../constants'
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
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { selectedClient, setSelectedClient, clientStatusList, isShowOneClient, judgesList } = props

  const clientName = () => (
    <FormTextField
      componentLabel="Client--Name"
      autoFocus={!isShowOneClient}
      value={selectedClient.name}
      onChange={(e) => handleClientFormOnChange('name', e.target.value, selectedClient, setSelectedClient, getString)}
      error={isClientFormFieldError('name', selectedClient.name, selectedClient)}
    />
  )

  const clientANumber = () => (
    <FormTextField
      componentLabel="Client--A Number"
      required={false}
      value={selectedClient.aNumber}
      onChange={(e) =>
        handleClientFormOnChange('aNumber', e.target.value, selectedClient, setSelectedClient, getString)
      }
    />
  )

  const clientEmail = () => (
    <FormTextField
      componentLabel="Client--Email"
      value={selectedClient.email}
      onChange={(e) => handleClientFormOnChange('email', e.target.value, selectedClient, setSelectedClient, getString)}
      error={isClientFormFieldError('email', selectedClient.email, selectedClient)}
    />
  )

  const clientPhoneNumber = () => (
    <FormTextField
      componentLabel="Client--Phone"
      maxLength={15}
      value={selectedClient.phoneNumber}
      onChange={(e) =>
        handleClientFormOnChange('phoneNumber', e.target.value, selectedClient, setSelectedClient, getString)
      }
      error={isClientFormFieldError('phoneNumber', selectedClient.phoneNumber, selectedClient)}
    />
  )

  const clientStreetAddress = () => (
    <FormTextField
      componentLabel="Client--Street Address"
      required={false}
      value={selectedClient.streetAddress}
      onChange={(e) =>
        handleClientFormOnChange('streetAddress', e.target.value, selectedClient, setSelectedClient, getString)
      }
      error={isClientFormFieldError('streetAddress', selectedClient.streetAddress, selectedClient)}
    />
  )

  const clientCity = () => (
    <FormTextField
      componentLabel="Client--City"
      required={false}
      value={selectedClient.city}
      onChange={(e) => handleClientFormOnChange('city', e.target.value, selectedClient, setSelectedClient, getString)}
      error={isClientFormFieldError('city', selectedClient.city, selectedClient)}
    />
  )

  const clientState = () => (
    <FormSelectStateField
      componentLabel="Client--State"
      value={selectedClient.state}
      onChange={(e) => handleClientFormOnChange('state', e.target.value, selectedClient, setSelectedClient, getString)}
      error={isClientFormFieldError('state', selectedClient.state, selectedClient)}
    />
  )

  const clientZipCode = () => (
    <FormTextField
      componentLabel="Client--Zip Code"
      required={false}
      maxLength={5}
      value={selectedClient.zipCode}
      onChange={(e) =>
        handleClientFormOnChange('zipCode', e.target.value, selectedClient, setSelectedClient, getString)
      }
      error={isClientFormFieldError('zipCode', selectedClient.zipCode, selectedClient)}
    />
  )

  const clientStatus = () => (
    <FormSelectStatusField
      componentLabel="Client--Status"
      value={selectedClient.status}
      onChange={(e) => handleClientFormOnChange('status', e.target.value, selectedClient, setSelectedClient, getString)}
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
      componentLabel="Client--Judge"
      value={selectedClient.judgeId || ID_DEFAULT}
      onChange={(e) =>
        handleClientFormOnChange('judgeId', e.target.value.toString(), selectedClient, setSelectedClient, getNumber)
      }
      menuItems={judgesListForSelect()}
    />
  )

  const clientComments = () => (
    <FormCommentsField
      componentLabel="Client--Comments"
      value={selectedClient.comments}
      onChange={(e) =>
        handleClientFormOnChange('comments', e.target.value, selectedClient, setSelectedClient, getComments)
      }
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
