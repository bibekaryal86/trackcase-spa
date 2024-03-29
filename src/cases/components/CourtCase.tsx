import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch, useStore } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import CourtCaseForm from './CourtCaseForm'
import {
  getNumber,
  GlobalState,
  isValidId,
  pageActionButtonsComponent,
  pageNotSelectedComponent,
  pageTitleComponent,
  pageTopLinksComponent,
} from '../../app'
import { ClientSchema, getClients } from '../../clients'
import { ACTION_TYPES, COMPONENT_STATUS_NAME, INVALID_INPUT } from '../../constants'
import { getRefTypes, RefTypesState } from '../../types'
import { courtCasesAction, getCourtCase } from '../actions/courtCases.action'
import {
  CourtCaseBase,
  CourtCaseResponse,
  DefaultCourtCaseFormData,
  DefaultCourtCaseFormErrorData,
} from '../types/courtCases.data.types'
import { getCourtCaseFormDataFromSchema, isAreTwoCourtCasesSame, validateCourtCase } from '../utils/courtCases.utils'

const mapStateToProps = ({ refTypes, clients }: GlobalState) => {
  return {
    refTypes: refTypes,
    clientsList: clients.clients,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getClients: () => getClients(),
}

interface CourtCaseProps {
  refTypes: RefTypesState
  getRefTypes: () => void
  clientsList: ClientSchema[]
  getClients: () => void
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

  const [formData, setFormData] = useState(DefaultCourtCaseFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultCourtCaseFormData)
  const [formErrors, setFormErrors] = useState(DefaultCourtCaseFormErrorData)

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
      clientsList.length === 0 && getClients()
    }
    isForceFetch.current = false
  }, [
    clientsList.length,
    dispatch,
    getClients,
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
              <Divider />
              <Typography component="h1" variant="h6" color="primary">
                MANY THINGS OF THE CASE IN TABBED VIEW:
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CourtCase)
