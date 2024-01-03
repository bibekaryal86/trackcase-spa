import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import React from 'react'

import { ClientSchema } from '../../clients'
import { ID_DEFAULT } from '../../constants'
import { CaseTypeSchema } from '../../ref_types'
import { CourtCaseSchema } from '../types/court_cases.data.types'
import { handleCourtCaseFormOnChange, isCourtCaseFormFieldError } from '../utils/court_cases.utils'

interface CourtCaseFormProps {
  selectedCourtCase: CourtCaseSchema
  setSelectedCourtCase: (selectedCourtCase: CourtCaseSchema) => void
  courtCaseStatusList: string[]
  isShowOneCourtCase: boolean
  caseTypesList: CaseTypeSchema[]
  clientsList: ClientSchema[]
}

const CourtCaseForm = (props: CourtCaseFormProps): React.ReactElement => {
  const { selectedCourtCase, setSelectedCourtCase, courtCaseStatusList, isShowOneCourtCase } = props
  const { caseTypesList, clientsList } = props

  const courtCaseType = () => (
    <FormControl
      sx={{ minWidth: 120, mt: '16px', mb: '8px' }}
      required
      error={isCourtCaseFormFieldError('caseTypeId', selectedCourtCase.case_type_id)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>Case Type</InputLabel>
      <Select
        labelId="court-case-select-type"
        id="court-case-select-type-id"
        variant="standard"
        value={selectedCourtCase.case_type_id || ID_DEFAULT}
        onChange={(e) =>
          handleCourtCaseFormOnChange('caseTypeId', e.target.value, selectedCourtCase, setSelectedCourtCase)
        }
      >
        {caseTypesList.map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
  const courtCaseClient = () => (
    <FormControl
      sx={{ minWidth: 120, mt: '16px', mb: '8px' }}
      required
      error={isCourtCaseFormFieldError('clientId', selectedCourtCase.client_id)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>Client</InputLabel>
      <Select
        labelId="court-case-select-client"
        id="court-case-select-client-id"
        variant="standard"
        value={selectedCourtCase.client_id || ID_DEFAULT}
        onChange={(e) =>
          handleCourtCaseFormOnChange('clientId', e.target.value, selectedCourtCase, setSelectedCourtCase)
        }
      >
        {clientsList.map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
  const courtCaseStatus = () => (
    <FormControl
      sx={{ minWidth: 120, mt: '16px', mb: '8px' }}
      required
      error={isCourtCaseFormFieldError('status', selectedCourtCase.status)}
    >
      <InputLabel sx={{ left: '-0.9em' }}>Status</InputLabel>
      <Select
        labelId="court-case-select-status"
        id="court-case-select-status-id"
        variant="standard"
        value={selectedCourtCase.status || ''}
        onChange={(e) => handleCourtCaseFormOnChange('status', e.target.value, selectedCourtCase, setSelectedCourtCase)}
      >
        {courtCaseStatusList.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
  const courtCaseComments = () => (
    <TextField
      sx={{ mt: '16px', mb: '8px' }}
      id="court-case-comments"
      name="court-case-comments"
      label="Court Case Comments"
      variant="standard"
      fullWidth
      multiline
      maxRows={4}
      inputProps={{ maxLength: 8888 }}
      value={selectedCourtCase.comments || ''}
      onChange={(e) => handleCourtCaseFormOnChange('comments', e.target.value, selectedCourtCase, setSelectedCourtCase)}
    />
  )

  return isShowOneCourtCase ? (
    <div>
      <div>
        {courtCaseType()}
        {courtCaseClient()}
        {courtCaseStatus()}
      </div>
      {courtCaseComments()}
    </div>
  ) : (
    <div>
      {courtCaseType()}
      {courtCaseClient()}
      {courtCaseStatus()}
    </div>
  )
}

export default CourtCaseForm
