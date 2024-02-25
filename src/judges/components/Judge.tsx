import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import JudgeForm from './JudgeForm'
import { getNumber, getStatusesList, GlobalState, Link, StatusSchema, unmountPage } from '../../app'
import { Clients } from '../../clients'
import { CourtSchema, getCourts } from '../../courts'
import { editJudge, getJudge } from '../actions/judges.action'
import { JUDGES_UNMOUNT } from '../types/judges.action.types'
import { DefaultJudgeSchema, JudgeSchema } from '../types/judges.data.types'
import { isAreTwoJudgesSame } from '../utils/judges.utils'

const mapStateToProps = ({ judges, statuses, courts }: GlobalState) => {
  return {
    selectedJudge: judges.selectedJudge,
    statusList: statuses.statuses,
    courtsList: courts.courts,
  }
}

const mapDispatchToProps = {
  getJudge: (judgeId: number) => getJudge(judgeId),
  editJudge: (judgeId: number, judge: JudgeSchema) => editJudge(judgeId, judge),
  unmountPage: () => unmountPage(JUDGES_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getCourts: () => getCourts(),
}

interface JudgeProps {
  selectedJudge: JudgeSchema
  getJudge: (judgeId: number) => void
  editJudge: (judgeId: number, judge: JudgeSchema) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  courtsList: CourtSchema[]
  getCourts: () => void
}

const Judge = (props: JudgeProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)

  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { getJudge, editJudge } = props
  const { courtsList, getCourts } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props

  const [selectedJudge, setSelectedJudge] = useState<JudgeSchema>(DefaultJudgeSchema)
  const [selectedJudgeForReset, setSelectedJudgeForReset] = useState<JudgeSchema>(DefaultJudgeSchema)
  const [judgeStatusList, setJudgeStatusList] = useState<string[]>([])

  useEffect(() => {
    if (isForceFetch.current) {
      id && getJudge(getNumber(id))
      statusList.court_case.all.length === 0 && getStatusesList()
      courtsList.length === 0 && getCourts()
    }
    isForceFetch.current = false
  }, [id, getJudge, statusList.court_case.all.length, getStatusesList, courtsList.length, getCourts])

  useEffect(() => {
    if (statusList.judge.all.length > 0) {
      setJudgeStatusList(statusList.judge.all)
    }
  }, [statusList.judge.all])

  useEffect(() => {
    setSelectedJudge(props.selectedJudge)
    setSelectedJudgeForReset(props.selectedJudge)
  }, [props.selectedJudge])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
      unmountPage()
    }
  }, [unmountPage])

  const inPageTopLinks = () => {
    const backToPage = searchQueryParams.get('backTo') || ''
    return (
      <Box sx={{ display: 'flex' }}>
        {backToPage && (
          <Box sx={{ mr: 2 }}>
            <Link text="Back to Prev Page" navigateToPage={backToPage} color="primary" />
          </Box>
        )}
        <Link text="View All Judges" navigateToPage="/judges/" color="primary" />
      </Box>
    )
  }

  const judgePageTitle = () => (
    <Typography component="h1" variant="h6" color="primary">
      {id ? `Judge: ${selectedJudge?.name}` : 'Court'}
    </Typography>
  )

  const noJudge = () => (
    <Typography component="h1" variant="h6" color="error" gutterBottom>
      Judge not selected! Nothing to display! Go to All Judges and select one!!!
    </Typography>
  )

  const updateAction = () => {
    editJudge(getNumber(id), selectedJudge)
  }

  const judgeButtons = () => {
    return (
      <>
        <Button disabled={isAreTwoJudgesSame(selectedJudge, selectedJudgeForReset)} onClick={updateAction}>
          Update
        </Button>
        <Button
          disabled={isAreTwoJudgesSame(selectedJudge, selectedJudgeForReset)}
          onClick={() => setSelectedJudge(selectedJudgeForReset)}
        >
          Cancel
        </Button>
      </>
    )
  }

  const judgeForm = () => (
    <JudgeForm
      selectedJudge={selectedJudge}
      setSelectedJudge={setSelectedJudge}
      judgeStatusList={judgeStatusList}
      isShowOneJudge={true}
      courtsList={courtsList}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {inPageTopLinks()}
          {judgePageTitle()}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {noJudge()}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {judgeForm()}
              {judgeButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Typography component="h1" variant="h6" color="primary">
                Clients Assigned to Judge:
              </Typography>
              <Clients judgeId={id} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Judge)
