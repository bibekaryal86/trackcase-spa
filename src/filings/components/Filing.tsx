import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useStore } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  pageActionButtonsComponent,
  pageNotSelectedComponent,
  pageTitleComponent,
  pageTopLinksComponent,
} from '@app/components/CommonComponents'
import { GlobalState, useGlobalDispatch } from '@app/store/redux'
import { getNumber, isValidId } from '@app/utils/app.utils'
import CalendarTable from '@calendars/components/CalendarTable'
import { TaskCalendarSchema } from '@calendars/types/calendars.data.types'
import { getCourtCases } from '@cases/actions/courtCases.action'
import { CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { getClients } from '@clients/actions/clients.action'
import { ClientSchema } from '@clients/types/clients.data.types'
import { ACTION_TYPES, CALENDAR_TYPES, COMPONENT_STATUS_NAME, INVALID_INPUT } from '@constants/index'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import { FilingForm } from './FilingForm'
import { filingsAction, getFiling, getFilings } from '../actions/filings.action'
import {
  DefaultFilingFormData,
  DefaultFilingFormErrorData,
  FilingBase,
  FilingResponse,
  FilingSchema,
} from '../types/filings.data.types'
import {
  getClientFilingType,
  getFilingFormDataFromSchema,
  isAreTwoFilingsSame,
  validateFiling,
} from '../utils/filings.utils'

const mapStateToProps = ({ refTypes, clients, courtCases, filings }: GlobalState) => {
  return {
    refTypes: refTypes,
    clientsList: clients.clients,
    courtCasesList: courtCases.courtCases,
    filingsList: filings.filings,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getClients: () => getClients(),
  getCourtCases: () => getCourtCases(),
  getFilings: () => getFilings(),
}

interface FilingProps {
  refTypes: RefTypesState
  getRefTypes: () => void
  clientsList: ClientSchema[]
  getClients: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCases: () => void
  filingsList: FilingSchema[]
  getFilings: () => void
}

const Filing = (props: FilingProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useGlobalDispatch()
  const store = useStore<GlobalState>().getState()
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()

  const { refTypes, getRefTypes } = props
  const { clientsList, getClients } = props
  const { courtCasesList, getCourtCases } = props
  const { filingsList, getFilings } = props

  const [formData, setFormData] = useState(DefaultFilingFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultFilingFormData)
  const [formErrors, setFormErrors] = useState(DefaultFilingFormErrorData)
  const [taskCalendars, setTaskCalendars] = useState([] as TaskCalendarSchema[])

  const filingStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.FILINGS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      const fetchFiling = async (id: number) => {
        return await getFiling(id, true)(dispatch, store)
      }
      if (isValidId(id)) {
        fetchFiling(getNumber(id)).then((oneFiling) => {
          if (oneFiling) {
            const oneFilingFormData = getFilingFormDataFromSchema(oneFiling)
            setFormData(oneFilingFormData)
            setFormDataReset(oneFilingFormData)
            setTaskCalendars(oneFiling.taskCalendars || [])
          }
        })
      }

      if (refTypes.componentStatus.length === 0 || refTypes.filingType.length === 0) {
        getRefTypes()
      }
      clientsList.length === 0 && getClients()
      courtCasesList.length === 0 && getCourtCases()
      filingsList.length === 0 && getFilings()
    }
    isForceFetch.current = false
  }, [
    clientsList.length,
    courtCasesList.length,
    dispatch,
    filingsList.length,
    getClients,
    getCourtCases,
    getFilings,
    getRefTypes,
    id,
    refTypes.componentStatus.length,
    refTypes.filingType.length,
    store,
  ])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const filingForm = () => (
    <FilingForm
      formData={formData}
      setFormData={setFormData}
      formErrors={formErrors}
      setFormErrors={setFormErrors}
      filingStatusList={filingStatusList()}
      isShowOneFiling={true}
      courtCasesList={courtCasesList}
      filingTypesList={refTypes.filingType}
    />
  )

  const primaryButtonCallback = async () => {
    const hasFormErrors = validateFiling(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let filingResponse: FilingResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (isValidId(id)) {
      const filingsRequest: FilingBase = { ...formData }
      filingResponse = await filingsAction({
        action: ACTION_TYPES.UPDATE,
        filingsRequest: filingsRequest,
        id: formData.id,
      })(dispatch)
    }

    if (filingResponse && !filingResponse.detail) {
      isForceFetch.current = true
    }
  }

  const filingButtons = () =>
    pageActionButtonsComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      formData,
      primaryButtonCallback,
      () => setFormData(formDataReset),
      !isValidId(id) || isAreTwoFilingsSame(formData, formDataReset),
    )

  const taskCalendarsTable = () => (
    <CalendarTable
      type={CALENDAR_TYPES.TASK_CALENDAR}
      calendarsList={taskCalendars}
      courtCasesList={courtCasesList}
      filingsList={filingsList}
      componentStatusList={refTypes.componentStatus}
      selectedFiling={formData}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTopLinksComponent(COMPONENT_STATUS_NAME.FILINGS, '/filings/', searchQueryParams)}
          {pageTitleComponent(
            COMPONENT_STATUS_NAME.FILINGS,
            getClientFilingType(
              formData.filingTypeId,
              refTypes.filingType,
              formData.courtCaseId,
              courtCasesList,
              clientsList,
            ),
          )}
        </Grid>
        {!id ? (
          <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {pageNotSelectedComponent(COMPONENT_STATUS_NAME.FILINGS)}
          </Grid>
        ) : (
          <>
            <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {filingForm()}
              {filingButtons()}
            </Grid>
            <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Divider />
              <Typography component="h1" variant="h6" color="primary">
                TASK CALENDARS OF FILINGS
              </Typography>
              {taskCalendarsTable()}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Filing)
