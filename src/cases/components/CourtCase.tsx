import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import CourtCaseForm from './CourtCaseForm'
import { getNumber, getStatusesList, GlobalState, Link, StatusSchema, unmountPage } from '../../app'
import { Calendars } from '../../calendars'
import { ClientSchema, getClients } from '../../clients'
import { Collections } from '../../collections'
import { CASE_TABS } from '../../constants'
import { Forms } from '../../forms'
import { CaseTypeSchema, getCaseTypes } from '../../types'
import { editCourtCase, getCourtCase } from '../actions/courtCases.action'
import { COURT_CASES_UNMOUNT } from '../types/courtCases.action.types'
import { CourtCaseSchema, DefaultCourtCaseSchema } from '../types/courtCases.data.types'
import { isAreTwoCourtCasesSame } from '../utils/courtCases.utils'

const mapStateToProps = ({ courtCases, statuses, caseTypes, clients }: GlobalState) => {
  return {
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
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)

  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { getCourtCase, editCourtCase } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props
  const { caseTypesList, getCaseTypes, clientsList, getClients } = props

  const [selectedCourtCase, setSelectedCourtCase] = useState<CourtCaseSchema>(DefaultCourtCaseSchema)
  const [selectedCourtCaseForReset, setSelectedCourtCaseForReset] = useState<CourtCaseSchema>(DefaultCourtCaseSchema)
  const [courtCaseStatusList, setCourtCaseStatusList] = useState<string[]>([])
  const [tabValue, setTabValue] = useState(CASE_TABS.FORMS.toString())
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => setTabValue(newValue)

  useEffect(() => {
    if (isForceFetch.current) {
      id && getCourtCase(getNumber(id))
      statusList.court_case.all.length === 0 && getStatusesList()
      caseTypesList.length === 0 && getCaseTypes()
      clientsList.length === 0 && getClients()
    }
    isForceFetch.current = false
  }, [
    id,
    getCourtCase,
    statusList.court_case.all.length,
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
        <Link text="View All Cases" navigateToPage="/court_cases/" color="primary" />
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

  const showTabs = () => {
    return (
      <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
        <Tab value={CASE_TABS.FORMS.toString()} label={CASE_TABS.FORMS.toString()} />
        <Tab value={CASE_TABS.CALENDARS.toString()} label={CASE_TABS.CALENDARS.toString()} />
        <Tab value={CASE_TABS.COLLECTIONS.toString()} label={CASE_TABS.COLLECTIONS.toString()} />
      </Tabs>
    )
  }

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
              {showTabs()}
            </Grid>
            {tabValue === CASE_TABS.FORMS.toString() && (
              <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
                <Typography component="h1" variant="h6" color="primary">
                  Filings in Case:
                </Typography>
                <Forms courtCaseId={id} />
              </Grid>
            )}
            {tabValue === CASE_TABS.CALENDARS.toString() && (
              <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
                <Typography component="h1" variant="h6" color="primary">
                  Calendars in Case:
                </Typography>
                <Calendars courtCaseId={id} />
              </Grid>
            )}
            {tabValue === CASE_TABS.COLLECTIONS.toString() && (
              <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
                <Typography component="h1" variant="h6" color="primary">
                  Collections in Case:
                </Typography>
                <Collections courtCaseId={id} />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CourtCase)
