import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import {
  FormCommentsField,
  FormSelectField,
  FormSelectStatusField,
  FormTextField,
  getComments,
  getNumber,
  getString,
  GridFormWrapper,
} from '../../app'
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
      componentLabel="Judge--Name"
      autoFocus={!isShowOneJudge}
      value={selectedJudge.name}
      onChange={(e) => handleJudgeFormOnChange('name', e.target.value, selectedJudge, setSelectedJudge, getString)}
      error={selectedJudge.name.trim() === ''}
    />
  )

  const judgeWebex = () => (
    <FormTextField
      componentLabel="Judge--Webex"
      required={false}
      value={selectedJudge.webex}
      onChange={(e) => handleJudgeFormOnChange('webex', e.target.value, selectedJudge, setSelectedJudge, getString)}
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
      componentLabel="Judge--Court"
      value={selectedJudge.courtId <= 0 ? -1 : selectedJudge.courtId}
      onChange={(e) => handleJudgeFormOnChange('courtId', e.target.value, selectedJudge, setSelectedJudge, getNumber)}
      menuItems={courtsListForSelect()}
    />
  )

  const judgeStatus = () => (
    <FormSelectStatusField
      componentLabel="Judge--Status"
      value={selectedJudge.status}
      onChange={(e) => handleJudgeFormOnChange('status', e.target.value, selectedJudge, setSelectedJudge, getString)}
      statusList={judgeStatusList}
      error={!selectedJudge.status}
    />
  )

  const judgeComments = () => (
    <FormCommentsField
      componentLabel="Judge--Comments"
      value={selectedJudge.comments}
      onChange={(e) => handleJudgeFormOnChange('comments', e.target.value, selectedJudge, setSelectedJudge, getComments)}
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
