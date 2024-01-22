import { useMediaQuery } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import React from 'react'

import { FormCommentsField, FormSelectStatus, FormTextField } from '../../app'
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
  const isSmallScreen = useMediaQuery('(max-width: 600px)')
  const { selectedJudge, courtsList, setSelectedJudge, judgeStatusList, isShowOneJudge } = props

  const judgeName = () => (
    <FormTextField
      component="judge"
      label="Name"
      autoFocus={!isShowOneJudge}
      value={selectedJudge.name || ''}
      onChange={(e) => handleJudgeFormOnChange('name', e.target.value, selectedJudge, setSelectedJudge)}
      error={selectedJudge.name.trim() === ''}
    />
  )

  const judgeWebex = () => (
    <FormTextField
      component="judge"
      label="Name"
      required={false}
      value={selectedJudge.webex || ''}
      onChange={(e) => handleJudgeFormOnChange('webex', e.target.value, selectedJudge, setSelectedJudge)}
    />
  )

  const judgeCourtsList = () => (
    <FormControl sx={{ width: '100%', mt: '16px', mb: '8px' }} required error={selectedJudge.courtId <= 0}>
      <InputLabel sx={{ left: '-0.9em' }}>Court</InputLabel>
      <Select
        labelId="judge-select-court"
        id="judge-court-id"
        variant="standard"
        value={selectedJudge.courtId <= 0 ? '' : selectedJudge.courtId}
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
    <FormSelectStatus
      component="judge"
      value={selectedJudge.status || ''}
      onChange={(e) => handleJudgeFormOnChange('status', e.target.value, selectedJudge, setSelectedJudge)}
      statusList={judgeStatusList}
      error={!selectedJudge.status}
    />
  )

  const judgeComments = () => (
    <FormCommentsField
      component="judge"
      value={selectedJudge.comments || ''}
      onChange={(e) => handleJudgeFormOnChange('comments', e.target.value, selectedJudge, setSelectedJudge)}
    />
  )

  return (
    <div style={{ width: isSmallScreen || !isShowOneJudge ? '100%' : '50%' }}>
      <Grid
        container
        direction="row"
        justifyContent={isShowOneJudge ? 'flex-start' : 'flex-end'}
        alignItems="center"
        spacing={isSmallScreen ? 1 : 2}
      >
        <Grid item xs={12}>
          {judgeName()}
        </Grid>
        <Grid item xs={12}>
          {judgeCourtsList()}
        </Grid>
        <Grid item xs={12}>
          {judgeWebex()}
        </Grid>
        <Grid item xs={4}>
          {judgeStatus()}
        </Grid>
        {isShowOneJudge && (
          <Grid item xs={12}>
            {judgeComments()}
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default JudgeForm
