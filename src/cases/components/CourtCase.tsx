import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import CourtCaseForm from './CourtCaseForm'
import { getNumber, getStatusesList, GlobalState, Link, StatusSchema, unmountPage } from '../../app'
import { Calendars } from '../../calendars'
import { ClientSchema, getClients } from '../../clients'
import { Forms } from '../../forms'
import { CaseTypeSchema } from '../../types'
import { getCaseTypes } from '../../types/actions/caseTypes.action'
import { editCourtCase, getCourtCase } from '../actions/courtCases.action'
import { COURT_CASES_UNMOUNT } from '../types/courtCases.action.types'
import { CourtCaseSchema, DefaultCourtCaseSchema } from '../types/courtCases.data.types'
import { isAreTwoCourtCasesSame } from '../utils/courtCases.utils'

const mapStateToProps = ({ courtCases, statuses, caseTypes, clients }: GlobalState) => {
  return {
    isForceFetch: courtCases.isForceFetch,
    selectedCourtCase: courtCases.selectedCourtCase,
    statusList: statuses.statuses,
    caseTypesList: caseTypes.caseTypes,
    clientsList: clients.clients,
  }
}

const mapDispatchToProps = {
  getCourtCase: (courtCaseId: number) => getCourtCase(courtCaseId),
  editCourtCase: (courtCaseId: number, courtCase: CourtCaseSchema) => editCourtCase(courtCaseId, courtCase),
  unmountPage: () => unmountPage(COURT_CASES_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getCaseTypes: () => getCaseTypes(),
  getClients: () => getClients(),
}

interface CourtCaseProps {
  isForceFetch: boolean
  selectedCourtCase: CourtCaseSchema
  getCourtCase: (courtCaseId: number) => void
  editCourtCase: (id: number, courtCase: CourtCaseSchema) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  caseTypesList: CaseTypeSchema[]
  getCaseTypes: () => void
  clientsList: ClientSchema[]
  getClients: () => void
}

const CourtCase = (props: CourtCaseProps): React.ReactElement => {
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { isForceFetch } = props
  const { getCourtCase, editCourtCase } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props
  const { caseTypesList, getCaseTypes, clientsList, getClients } = props

  const [selectedCourtCase, setSelectedCourtCase] = useState<CourtCaseSchema>(DefaultCourtCaseSchema)
  const [selectedCourtCaseForReset, setSelectedCourtCaseForReset] = useState<CourtCaseSchema>(DefaultCourtCaseSchema)
  const [courtCaseStatusList, setCourtCaseStatusList] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      getCourtCase(getNumber(id))
    }
    // add selectedCourtCase.id to dependency array for note/history
  }, [id, getCourtCase, selectedCourtCase.id])

  useEffect(() => {
    if (isForceFetch) {
      statusList.court_case.all.length === 0 && getStatusesList()
      caseTypesList.length === 0 && getCaseTypes()
      clientsList.length === 0 && getClients()
    }
  }, [
    isForceFetch,
    statusList.court_case.all,
    getStatusesList,
    caseTypesList.length,
    getCaseTypes,
    clientsList.length,
    getClients,
  ])

  useEffect(() => {
    if (statusList.court_case.all.length > 0) {
      setCourtCaseStatusList(statusList.court_case.all)
    }
  }, [statusList.court_case.all])

  useEffect(() => {
    setSelectedCourtCase(props.selectedCourtCase)
    setSelectedCourtCaseForReset(props.selectedCourtCase)
  }, [props.selectedCourtCase])

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const inPageTopLinks = () => {
    const backToPage = searchQueryParams.get('backTo') || ''
    const prevPage = searchQueryParams.get('prevPage') || ''
    return (
      <Box sx={{ display: 'flex' }}>
        <Link text="View All Cases" navigateToPage="/court_cases/" color="primary" />
        {backToPage && (
          <Box sx={{ ml: 2 }}>
            <Link text={`Back to ${prevPage}`} navigateToPage={backToPage} color="primary" />
          </Box>
        )}
      </Box>
    )
  }

  const courtCasePageTitle = () => (
    <Typography component="h1" variant="h6" color="primary">
      {id ? `Case: ${selectedCourtCase.client?.name}, ${selectedCourtCase.caseType?.name}` : 'Case'}
    </Typography>
  )

  const noCourtCase = () => (
    <Typography component="h1" variant="h6" color="error" gutterBottom>
      Case not selected! Nothing to display! Go to All Cases and select one!!!
    </Typography>
  )

  const updateAction = () => {
    editCourtCase(getNumber(id), selectedCourtCase)
  }

  const courtCaseButtons = () => {
    return (
      <>
        <Button disabled={isAreTwoCourtCasesSame(selectedCourtCase, selectedCourtCaseForReset)} onClick={updateAction}>
          Update
        </Button>
        <Button
          disabled={isAreTwoCourtCasesSame(selectedCourtCase, selectedCourtCaseForReset)}
          onClick={() => setSelectedCourtCase(selectedCourtCaseForReset)}
        >
          Cancel
        </Button>
      </>
    )
  }

  const courtCaseForm = () => (
    <CourtCaseForm
      selectedCourtCase={selectedCourtCase}
      setSelectedCourtCase={setSelectedCourtCase}
      courtCaseStatusList={courtCaseStatusList}
      isShowOneCourtCase={true}
      caseTypesList={caseTypesList}
      clientsList={clientsList}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {inPageTopLinks()}
          {courtCasePageTitle()}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {noCourtCase()}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {courtCaseForm()}
              {courtCaseButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Typography component="h1" variant="h6" color="primary">
                Forms in Case:
              </Typography>
              <Forms courtCaseId={id} />
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Typography component="h1" variant="h6" color="primary">
                Case Hearing Calendar:
              </Typography>
              <Calendars courtCaseId={id} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CourtCase)
