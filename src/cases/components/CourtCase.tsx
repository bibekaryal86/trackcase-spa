import { Tab, Tabs } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch, useStore } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  pageActionButtonsComponent,
  pageNotSelectedComponent,
  pageTitleComponent,
  pageTopLinksComponent,
} from '@app/components/CommonComponents'
import { GlobalState } from '@app/store/redux'
import { getNumber, isValidId } from '@app/utils/app.utils'
import { getClients } from '@clients/actions/clients.action'
import { ClientSchema } from '@clients/types/clients.data.types'
import { ACTION_TYPES, CASE_TABS, COMPONENT_STATUS_NAME, INVALID_INPUT } from '@constants/index'
import Filings from '@filings/components/Filings'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import CourtCaseForm from './CourtCaseForm'
import { courtCasesAction, getCourtCase, getCourtCases } from '../actions/courtCases.action'
import {
  CourtCaseBase,
  CourtCaseResponse,
  CourtCaseSchema,
  DefaultCourtCaseFormData,
  DefaultCourtCaseFormErrorData,
} from '../types/courtCases.data.types'
import { getCourtCaseFormDataFromSchema, isAreTwoCourtCasesSame, validateCourtCase } from '../utils/courtCases.utils'
import Calendars from '@calendars/components/Calendars'

const mapStateToProps = ({ refTypes, courtCases, clients }: GlobalState) => {
  return {
    refTypes: refTypes,
    courtCasesList: courtCases.courtCases,
    clientsList: clients.clients,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getCourtCases: () => getCourtCases(),
  getClients: () => getClients(),
}

interface CourtCaseProps {
  refTypes: RefTypesState
  getRefTypes: () => void
  clientsList: ClientSchema[]
  getClients: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCases: () => void
}

const CourtCase = (props: CourtCaseProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const store = useStore<GlobalState>().getState()
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()

  const { refTypes, getRefTypes } = props
  const { clientsList, getClients } = props
  const { courtCasesList, getCourtCases } = props

  const [formData, setFormData] = useState(DefaultCourtCaseFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultCourtCaseFormData)
  const [formErrors, setFormErrors] = useState(DefaultCourtCaseFormErrorData)

  const [tabValue, setTabValue] = useState(CASE_TABS.FILINGS.toString())
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => setTabValue(newValue)

  const courtCaseStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.COURT_CASES)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      const fetchCourtCase = async (id: number) => {
        return await getCourtCase(id, true)(dispatch, store)
      }
      if (isValidId(id)) {
        fetchCourtCase(getNumber(id)).then((oneCourtCase) => {
          if (oneCourtCase) {
            const oneCourtCaseFormData = getCourtCaseFormDataFromSchema(oneCourtCase)
            setFormData(oneCourtCaseFormData)
            setFormDataReset(oneCourtCaseFormData)
          }
        })
      }

      if (refTypes.componentStatus.length === 0 || refTypes.caseType.length === 0) {
        getRefTypes()
      }
      courtCasesList.length === 0 && getCourtCases()
      clientsList.length === 0 && getClients()
    }
    isForceFetch.current = false
  }, [
    clientsList.length,
    courtCasesList.length,
    dispatch,
    getClients,
    getCourtCases,
    getRefTypes,
    id,
    refTypes.caseType.length,
    refTypes.componentStatus.length,
    store,
  ])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const courtCaseForm = () => (
    <CourtCaseForm
      formData={formData}
      setFormData={setFormData}
      formErrors={formErrors}
      setFormErrors={setFormErrors}
      courtCaseStatusList={courtCaseStatusList()}
      isShowOneCourtCase={true}
      clientsList={clientsList}
      caseTypesList={refTypes.caseType}
    />
  )

  const primaryButtonCallback = async () => {
    const hasFormErrors = validateCourtCase(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let courtCaseResponse: CourtCaseResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (isValidId(id)) {
      const courtCasesRequest: CourtCaseBase = { ...formData }
      courtCaseResponse = await courtCasesAction({
        action: ACTION_TYPES.UPDATE,
        courtCasesRequest: courtCasesRequest,
        id: formData.id,
      })(dispatch)
    }

    if (courtCaseResponse && !courtCaseResponse.detail) {
      isForceFetch.current = true
    }
  }

  const courtCaseButtons = () =>
    pageActionButtonsComponent(
      COMPONENT_STATUS_NAME.COURT_CASES,
      formData,
      primaryButtonCallback,
      () => setFormData(formDataReset),
      !isValidId(id) || isAreTwoCourtCasesSame(formData, formDataReset),
    )

  const getClientCaseType = () => {
    const selectedCaseType = refTypes.caseType.find((x) => x.id === formData.caseTypeId)
    const selectedClient = clientsList.find((x) => x.id === formData.clientId)
    if (selectedCaseType && selectedClient) {
      return selectedClient.name + ', ' + selectedCaseType.name
    }
    return ''
  }

  const showTabs = () => {
    return (
      <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
        <Tab value={CASE_TABS.FILINGS.toString()} label={CASE_TABS.FILINGS.toString()} />
        <Tab value={CASE_TABS.CALENDARS.toString()} label={CASE_TABS.CALENDARS.toString()} />
        <Tab value={CASE_TABS.COLLECTIONS.toString()} label={CASE_TABS.COLLECTIONS.toString()} />
      </Tabs>
    )
  }

  const caseFilings = () => <Filings selectedCourtCase={formData} />
  const caseCalendars = () => <Calendars selectedCourtCase={formData} />
  const caseCollections = () => console.log('add selectedCourtCase prop to Collections.tsx')

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTopLinksComponent(
            COMPONENT_STATUS_NAME.COURT_CASES.replace('_', ' '),
            '/court_cases/',
            searchQueryParams,
          )}
          {pageTitleComponent(COMPONENT_STATUS_NAME.COURT_CASES.replace('_', ' '), getClientCaseType())}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {pageNotSelectedComponent(COMPONENT_STATUS_NAME.COURT_CASES.replace('_', ' '))}
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
            {tabValue === CASE_TABS.FILINGS.toString() && (
              <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
                {caseFilings()}
              </Grid>
            )}
            {tabValue === CASE_TABS.CALENDARS.toString() && (
              <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
                {caseCalendars()}
              </Grid>
            )}
            {tabValue === CASE_TABS.COLLECTIONS.toString() && (
              <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
                {caseCollections()}
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CourtCase)
