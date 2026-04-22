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
} from '@app/components/CommonComponents.tsx'
import { GlobalState, useGlobalDispatch } from '@app/store/redux.ts'
import { getNumber, isValidId } from '@app/utils/app.utils.ts'
import CourtCaseTable from '@cases/components/CourtCaseTable.tsx'
import { CourtCaseSchema } from '@cases/types/courtCases.data.types.ts'
import { clientsAction, getClient } from '@clients/actions/clients.action.ts'
import {
  ClientBase,
  ClientResponse,
  DefaultClientFormData,
  DefaultClientFormErrorData,
} from '@clients/types/clients.data.types.ts'
import { getClientFormDataFromSchema, isAreTwoClientsSame, validateClient } from '@clients/utils/clients.utils.ts'
import { ACTION_TYPES, COMPONENT_STATUS_NAME, INVALID_INPUT } from '@constants/index.ts'
import { getJudges } from '@judges/actions/judges.action.ts'
import { JudgeSchema } from '@judges/types/judges.data.types.ts'
import { getRefTypes } from '@ref_types/actions/refTypes.action.ts'
import { RefTypesState } from '@ref_types/types/refTypes.data.types.ts'

import ClientForm from './ClientForm.tsx'

const mapStateToProps = ({ refTypes, judges }: GlobalState) => {
  return {
    refTypes: refTypes,
    caseTypesList: refTypes.caseType,
    judgesList: judges.judges,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getJudges: () => getJudges(),
}

interface ClientProps {
  refTypes: RefTypesState
  getRefTypes: () => void
  judgesList: JudgeSchema[]
  getJudges: () => void
}

const Client = (props: ClientProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useGlobalDispatch()
  const store = useStore<GlobalState>().getState()
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()

  const { refTypes, getRefTypes } = props
  const { judgesList, getJudges } = props

  const [formData, setFormData] = useState(DefaultClientFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultClientFormData)
  const [formErrors, setFormErrors] = useState(DefaultClientFormErrorData)
  const [courtCasesList, setCourtCasesList] = useState([] as CourtCaseSchema[])

  const clientStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.CLIENTS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      const fetchClient = async (id: number) => {
        return await getClient(id, true)(dispatch, store)
      }
      if (isValidId(id)) {
        fetchClient(getNumber(id)).then((oneClient) => {
          if (oneClient) {
            const oneClientFormData = getClientFormDataFromSchema(oneClient)
            setFormData(oneClientFormData)
            setFormDataReset(oneClientFormData)
            setCourtCasesList(oneClient.courtCases || [])
          }
        })
      }

      if (refTypes.componentStatus.length === 0 || refTypes.caseType.length === 0) {
        getRefTypes()
      }
      judgesList.length === 0 && getJudges()
    }
    isForceFetch.current = false
  }, [
    dispatch,
    getJudges,
    getRefTypes,
    id,
    judgesList.length,
    refTypes.caseType.length,
    refTypes.componentStatus.length,
    store,
  ])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const clientForm = () => (
    <ClientForm
      formData={formData}
      setFormData={setFormData}
      formErrors={formErrors}
      setFormErrors={setFormErrors}
      clientStatusList={clientStatusList()}
      isShowOneClient={true}
      judgesList={judgesList}
    />
  )

  const primaryButtonCallback = async () => {
    const hasFormErrors = validateClient(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let clientResponse: ClientResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (isValidId(id)) {
      const clientsRequest: ClientBase = { ...formData }
      clientResponse = await clientsAction({
        action: ACTION_TYPES.UPDATE,
        clientsRequest: clientsRequest,
        id: formData.id,
      })(dispatch)
    }

    if (clientResponse && !clientResponse.detail) {
      isForceFetch.current = true
    }
  }

  const clientButtons = () =>
    pageActionButtonsComponent(
      COMPONENT_STATUS_NAME.CLIENTS,
      formData,
      primaryButtonCallback,
      () => setFormData(formDataReset),
      !isValidId(id) || isAreTwoClientsSame(formData, formDataReset),
    )

  const courtCasesTable = () => (
    <CourtCaseTable
      courtCasesList={courtCasesList}
      selectedClient={formData}
      componentStatusList={refTypes.componentStatus}
      caseTypesList={refTypes.caseType}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTopLinksComponent(COMPONENT_STATUS_NAME.CLIENTS, '/clients/', searchQueryParams)}
          {pageTitleComponent(COMPONENT_STATUS_NAME.CLIENTS, formData.name)}
        </Grid>
        {!id ? (
          <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {pageNotSelectedComponent(COMPONENT_STATUS_NAME.CLIENTS)}
          </Grid>
        ) : (
          <>
            <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {clientForm()}
              {clientButtons()}
            </Grid>
            <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Divider />
              <Typography component="h1" variant="h6" color="primary">
                COURT CASES OF CLIENT:
              </Typography>
              {courtCasesTable()}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Client)
