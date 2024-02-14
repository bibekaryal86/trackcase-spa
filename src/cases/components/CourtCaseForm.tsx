import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import {
  FormCommentsField,
  FormSelectField,
  FormSelectStatusField,
  getComments,
  getNumber,
  getString,
  GridFormWrapper,
} from '../../app'
import { ClientSchema } from '../../clients'
import { USE_MEDIA_QUERY_INPUT } from '../../constants'
import { CaseTypeSchema } from '../../types'
import { CourtCaseSchema } from '../types/courtCases.data.types'
import { handleCourtCaseFormOnChange, isCourtCaseFormFieldError } from '../utils/courtCases.utils'

interface CourtCaseFormProps {
  selectedCourtCase: CourtCaseSchema
  setSelectedCourtCase: (selectedCourtCase: CourtCaseSchema) => void
  courtCaseStatusList: string[]
  isShowOneCourtCase: boolean
  caseTypesList: CaseTypeSchema[]
  clientsList: ClientSchema[]
}

const CourtCaseForm = (props: CourtCaseFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { selectedCourtCase, setSelectedCourtCase, courtCaseStatusList, isShowOneCourtCase } = props
  const { caseTypesList, clientsList } = props

  const caseTypesListForSelect = () =>
    caseTypesList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const clientsListForSelect = () =>
    clientsList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const courtCaseType = () => (
    <FormSelectField
      componentLabel="Court Case--Case Type"
      required={true}
      value={selectedCourtCase.caseTypeId}
      onChange={(e) =>
        handleCourtCaseFormOnChange('caseTypeId', e.target.value, selectedCourtCase, setSelectedCourtCase, getNumber)
      }
      error={isCourtCaseFormFieldError('caseTypeId', selectedCourtCase.caseTypeId)}
      menuItems={caseTypesListForSelect()}
    />
  )

  const courtCaseClient = () => (
    <FormSelectField
      componentLabel="Court Case--Client"
      required={true}
      value={selectedCourtCase.clientId}
      onChange={(e) =>
        handleCourtCaseFormOnChange('clientId', e.target.value, selectedCourtCase, setSelectedCourtCase, getNumber)
      }
      error={isCourtCaseFormFieldError('clientId', selectedCourtCase.clientId)}
      menuItems={clientsListForSelect()}
    />
  )

  const courtCaseStatus = () => (
    <FormSelectStatusField
      componentLabel="Court Case--Status"
      value={selectedCourtCase.status}
      onChange={(e) =>
        handleCourtCaseFormOnChange('status', e.target.value, selectedCourtCase, setSelectedCourtCase, getString)
      }
      statusList={courtCaseStatusList}
      error={isCourtCaseFormFieldError('status', selectedCourtCase.status)}
    />
  )

  const courtCaseComments = () => (
    <FormCommentsField
      componentLabel="Court Case--Comments"
      value={selectedCourtCase.comments}
      onChange={(e) =>
        handleCourtCaseFormOnChange('comments', e.target.value, selectedCourtCase, setSelectedCourtCase, getComments)
      }
    />
  )

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneCourtCase}
      justifyContent={isShowOneCourtCase ? 'flex-start' : 'flex-end'}
    >
      <Grid item xs={12}>
        {courtCaseType()}
      </Grid>
      <Grid item xs={12}>
        {courtCaseClient()}
      </Grid>
      <Grid item xs={6}>
        {courtCaseStatus()}
      </Grid>
      {isShowOneCourtCase && (
        <Grid item xs={12}>
          {courtCaseComments()}
        </Grid>
      )}
    </GridFormWrapper>
  )
}

export default CourtCaseForm
