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
import ClientTable from '@clients/components/ClientTable.tsx'
import { ClientSchema } from '@clients/types/clients.data.types.ts'
import { ACTION_TYPES, COMPONENT_STATUS_NAME, INVALID_INPUT } from '@constants/index.ts'
import { getCourts } from '@courts/actions/courts.action.ts'
import { CourtSchema } from '@courts/types/courts.data.types.ts'
import { getJudge, judgesAction } from '@judges/actions/judges.action.ts'
import {
  DefaultJudgeFormData,
  DefaultJudgeFormErrorData,
  JudgeBase,
  JudgeResponse,
} from '@judges/types/judges.data.types.ts'
import { getJudgeFormDataFromSchema, isAreTwoJudgesSame, validateJudge } from '@judges/utils/judges.utils.ts'
import { getRefTypes } from '@ref_types/actions/refTypes.action.ts'
import { RefTypesState } from '@ref_types/types/refTypes.data.types.ts'

import JudgeForm from './JudgeForm.tsx'

const mapStateToProps = ({ refTypes, courts }: GlobalState) => {
  return {
    refTypes: refTypes,
    courtsList: courts.courts,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getCourts: () => getCourts(),
}

interface JudgeProps {
  refTypes: RefTypesState
  getRefTypes: () => void
  courtsList: CourtSchema[]
  getCourts: () => void
}

const Judge = (props: JudgeProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useGlobalDispatch()
  const store = useStore<GlobalState>().getState()
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()

  const { refTypes, getRefTypes } = props
  const { courtsList, getCourts } = props

  const [formData, setFormData] = useState(DefaultJudgeFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultJudgeFormData)
  const [formErrors, setFormErrors] = useState(DefaultJudgeFormErrorData)
  const [clientsList, setClientsList] = useState([] as ClientSchema[])

  const judgeStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.JUDGES)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      const fetchJudge = async (id: number) => {
        return await getJudge(id, true)(dispatch, store)
      }
      if (isValidId(id)) {
        fetchJudge(getNumber(id)).then((oneJudge) => {
          if (oneJudge) {
            const oneJudgeFormData = getJudgeFormDataFromSchema(oneJudge)
            setFormData(oneJudgeFormData)
            setFormDataReset(oneJudgeFormData)
            setClientsList(oneJudge.clients || [])
          }
        })
      }
      refTypes.componentStatus.length === 0 && getRefTypes()
      courtsList.length === 0 && getCourts()
    }
    isForceFetch.current = false
  }, [courtsList.length, dispatch, getCourts, getRefTypes, id, refTypes.componentStatus.length, store])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const judgeForm = () => (
    <JudgeForm
      formData={formData}
      setFormData={setFormData}
      formErrors={formErrors}
      setFormErrors={setFormErrors}
      judgeStatusList={judgeStatusList()}
      isShowOneJudge={true}
      courtsList={courtsList}
    />
  )

  const primaryButtonCallback = async () => {
    const hasFormErrors = validateJudge(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let judgeResponse: JudgeResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (isValidId(id)) {
      const judgesRequest: JudgeBase = { ...formData }
      judgeResponse = await judgesAction({
        action: ACTION_TYPES.UPDATE,
        judgesRequest: judgesRequest,
        id: formData.id,
      })(dispatch)
    }

    if (judgeResponse && !judgeResponse.detail) {
      isForceFetch.current = true
    }
  }

  const judgeButtons = () =>
    pageActionButtonsComponent(
      COMPONENT_STATUS_NAME.JUDGES,
      formData,
      primaryButtonCallback,
      () => setFormData(formDataReset),
      !isValidId(id) || isAreTwoJudgesSame(formData, formDataReset),
    )

  const clientsTable = () => (
    <ClientTable clientsList={clientsList} selectedJudge={formData} componentStatusList={refTypes.componentStatus} />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTopLinksComponent(COMPONENT_STATUS_NAME.JUDGES, '/judges/', searchQueryParams)}
          {pageTitleComponent(COMPONENT_STATUS_NAME.JUDGES, formData.name)}
        </Grid>
        {!id ? (
          <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {pageNotSelectedComponent(COMPONENT_STATUS_NAME.JUDGES)}
          </Grid>
        ) : (
          <>
            <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {judgeForm()}
              {judgeButtons()}
            </Grid>
            <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Divider />
              <Typography component="h1" variant="h6" color="primary">
                CLIENTS ASSIGNED TO JUDGE:
              </Typography>
              {clientsTable()}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Judge)
