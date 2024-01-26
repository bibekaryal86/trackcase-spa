import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { FormCommentsField, FormSelectField, FormSelectStatusField, FormTextField, GridFormWrapper } from '../../app'
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
      label="Webex"
      required={false}
      value={selectedJudge.webex || ''}
      onChange={(e) => handleJudgeFormOnChange('webex', e.target.value, selectedJudge, setSelectedJudge)}
    />
  )

  const courtsListForSelect = () =>
    courtsList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const judgeCourtsList = () => (
    <FormSelectField
      component="judge"
      inputLabel="Court"
      value={selectedJudge.courtId <= 0 ? -1 : selectedJudge.courtId}
      onChange={(e) => handleJudgeFormOnChange('courtId', e.target.value, selectedJudge, setSelectedJudge)}
      selectOptions={courtsList}
      menuItems={courtsListForSelect()}
    />
  )

  const judgeStatus = () => (
    <FormSelectStatusField
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
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneJudge}
      justifyContent={isShowOneJudge ? 'flex-start' : 'flex-end'}
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
    </GridFormWrapper>
  )
}

export default JudgeForm
