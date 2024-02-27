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
  StatusSchema,
} from '../../app'
import { USE_MEDIA_QUERY_INPUT } from '../../constants'
import { CourtSchema } from '../../courts'
import { JudgeSchema } from '../types/judges.data.types'
import { handleJudgeFormOnChange } from '../utils/judges.utils'

interface JudgeFormProps {
  selectedJudge: JudgeSchema
  courtsList: CourtSchema[]
  setSelectedJudge: (selectedJudge: JudgeSchema) => void
  judgeStatusList: string[]
  isShowOneJudge: boolean
  courtId?: string
  statusList: StatusSchema<string>
}

const JudgeForm = (props: JudgeFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { selectedJudge, courtsList, setSelectedJudge, judgeStatusList, isShowOneJudge } = props
  const { courtId, statusList } = props

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

  const courtsListForSelect = () => {
    if (getNumber(courtId) > 0) {
      const selectedCourt = courtsList.find((x) => x.id === Number(courtId))
      if (selectedCourt) {
        return [
          <MenuItem key={selectedCourt.id} value={selectedCourt.id}>
            {selectedCourt.name}
          </MenuItem>,
        ]
      }
    } else {
      return courtsList
        .filter((x) => selectedJudge.courtId === x.id || statusList.court.active.includes(x.status))
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {x.name}
          </MenuItem>
        ))
    }
    return []
  }

  const judgeCourtsList = () => (
    <FormSelectField
      componentLabel="Judge--Court"
      value={selectedJudge.courtId}
      onChange={(e) => handleJudgeFormOnChange('courtId', e.target.value, selectedJudge, setSelectedJudge, getNumber)}
      menuItems={courtsListForSelect()}
      error={selectedJudge.courtId <= 0}
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
      onChange={(e) =>
        handleJudgeFormOnChange('comments', e.target.value, selectedJudge, setSelectedJudge, getComments)
      }
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
