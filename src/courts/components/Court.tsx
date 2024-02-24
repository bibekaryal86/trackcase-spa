import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import CourtForm from './CourtForm'
import { getNumber, getStatusesList, GlobalState, Link, StatusSchema, unmountPage } from '../../app'
import { Judges } from '../../judges'
import { editCourt, getCourt } from '../actions/courts.action'
import { COURTS_UNMOUNT } from '../types/courts.action.types'
import { CourtSchema, DefaultCourtSchema } from '../types/courts.data.types'
import { isAreTwoCourtsSame } from '../utils/courts.utils'

const mapStateToProps = ({ courts, statuses }: GlobalState) => {
  return {
    selectedCourt: courts.selectedCourt,
    statusList: statuses.statuses,
  }
}

const mapDispatchToProps = {
  getCourt: (courtId: number) => getCourt(courtId),
  editCourt: (courtId: number, court: CourtSchema) => editCourt(courtId, court),
  unmountPage: () => unmountPage(COURTS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
}

interface CourtProps {
  selectedCourt: CourtSchema
  getCourt: (courtId: number) => void
  editCourt: (id: number, court: CourtSchema) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
}

const Court = (props: CourtProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)

  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { getCourt, editCourt } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props

  const [selectedCourt, setSelectedCourt] = useState<CourtSchema>(DefaultCourtSchema)
  const [selectedCourtForReset, setSelectedCourtForReset] = useState<CourtSchema>(DefaultCourtSchema)
  const [courtStatusList, setCourtStatusList] = useState<string[]>([])

  useEffect(() => {
    if (isForceFetch.current) {
      id && getCourt(getNumber(id))
      statusList.court.all.length === 0 && getStatusesList()
    }
    isForceFetch.current = false
  }, [id, getCourt, statusList.court.all.length, getStatusesList])

  useEffect(() => {
    if (statusList.court.all.length > 0) {
      setCourtStatusList(statusList.court.all)
    }
  }, [statusList.court.all])

  useEffect(() => {
    setSelectedCourt(props.selectedCourt)
    setSelectedCourtForReset(props.selectedCourt)
  }, [props.selectedCourt])

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
        <Link text="View All Courts" navigateToPage="/courts/" color="primary" />
      </Box>
    )
  }

  const courtPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary">
      {id ? `Court: ${selectedCourt?.name}, ${selectedCourt?.state}` : 'Court'}
    </Typography>
  )

  const noCourt = () => (
    <Typography component="h1" variant="h6" color="error" gutterBottom>
      Court not selected! Nothing to display! Go to All Courts and select one!!!
    </Typography>
  )

  const updateAction = () => {
    editCourt(getNumber(id), selectedCourt)
  }

  const courtButtons = () => {
    return (
      <>
        <Button disabled={isAreTwoCourtsSame(selectedCourt, selectedCourtForReset)} onClick={updateAction}>
          Update
        </Button>
        <Button
          disabled={isAreTwoCourtsSame(selectedCourt, selectedCourtForReset)}
          onClick={() => setSelectedCourt(selectedCourtForReset)}
        >
          Cancel
        </Button>
      </>
    )
  }

  const courtForm = () => (
    <CourtForm
      selectedCourt={selectedCourt}
      setSelectedCourt={setSelectedCourt}
      courtStatusList={courtStatusList}
      isShowOneCourt={true}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {inPageTopLinks()}
          {courtPageTitle()}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {noCourt()}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {courtForm()}
              {courtButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Typography component="h1" variant="h6" color="primary">
                Judges in Court:
              </Typography>
              <Judges courtId={id} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Court)
