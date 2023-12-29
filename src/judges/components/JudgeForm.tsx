import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import React from 'react'

import { CourtSchema } from '../../courts'
import { JudgeSchema } from '../types/judges.data.types'
import { handleJudgeFormOnChange } from '../utils/judges.utils'

interface JudgeFormProps {
  selectedJudge: JudgeSchema
  courtsList: CourtSchema[]
  setSelectedJudge: (selectedJudge: JudgeSchema) => void
  judgeStatusList: string[]
  isShowOneJudge: boolean
}

const JudgeForm = (props: JudgeFormProps): React.ReactElement => {
  const { selectedJudge, courtsList, setSelectedJudge, judgeStatusList, isShowOneJudge } = props

  const judgeName = () => (
    <TextField
      required
      autoFocus
      fullWidth
      variant="standard"
      id="judge-name"
      label="Name"
      name="judge-name"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedJudge.name}
      onChange={(e) => handleJudgeFormOnChange('name', e.target.value, selectedJudge, setSelectedJudge)}
      error={selectedJudge.name.trim() === ''}
    />
  )
  const judgeWebex = () => (
    <TextField
      fullWidth
      variant="standard"
      name="judge-webex"
      label="Webex"
      id="judge-webex"
      margin="normal"
      inputProps={{ maxLength: 99 }}
      value={selectedJudge.webex}
      onChange={(e) => handleJudgeFormOnChange('webex', e.target.value, selectedJudge, setSelectedJudge)}
    />
  )
  const judgeCourtsList = () => (
    <FormControl sx={{ minWidth: 425, mt: '16px', mb: '8px' }} required error={selectedJudge.court_id <= 0}>
      <InputLabel sx={{ left: '-0.9em' }}>Court</InputLabel>
      <Select
        labelId="judge-select-court"
        id="judge-select-court-id"
        variant="standard"
        value={selectedJudge.court_id <= 0 ? '' : selectedJudge.court_id}
        onChange={(e) => handleJudgeFormOnChange('courtId', e.target.value, selectedJudge, setSelectedJudge)}
      >
        {courtsList.map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
  const judgeStatus = () => (
    <FormControl sx={{ minWidth: 120, mt: '16px', mb: '8px' }} required error={!selectedJudge.status}>
      <InputLabel sx={{ left: '-0.9em' }}>Status</InputLabel>
      <Select
        labelId="judge-select-status"
        id="judge-select-status-id"
        variant="standard"
        value={selectedJudge.status || ''}
        onChange={(e) => handleJudgeFormOnChange('status', e.target.value, selectedJudge, setSelectedJudge)}
      >
        {judgeStatusList.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
  const judgeComments = () => (
    <TextField
      sx={{ mt: '16px', mb: '8px' }}
      id="judge-comments"
      name="judge-comments"
      label="Judge Comments"
      variant="standard"
      fullWidth
      multiline
      maxRows={4}
      inputProps={{ maxLength: 8888 }}
      value={selectedJudge.comments || ''}
      onChange={(e) => handleJudgeFormOnChange('comments', e.target.value, selectedJudge, setSelectedJudge)}
    />
  )

  return isShowOneJudge ? (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {judgeName()}
        {judgeWebex()}
        {judgeCourtsList()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '1em' }}>
        {judgeStatus()}
        {judgeComments()}
      </div>
    </div>
  ) : (
    <div>
      {judgeName()}
      {judgeWebex()}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
        {judgeCourtsList()}
        {judgeStatus()}
      </div>
    </div>
  )
}

export default JudgeForm
