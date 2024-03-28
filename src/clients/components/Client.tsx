import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch, useStore } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import ClientForm from './ClientForm'
import {
  getNumber,
  GlobalState,
  isValidId,
  pageActionButtonsComponent,
  pageNotSelectedComponent,
  pageTitleComponent,
  pageTopLinksComponent,
} from '../../app'
import { ACTION_TYPES, COMPONENT_STATUS_NAME, INVALID_INPUT, REF_TYPES_REGISTRY } from '../../constants'
import { getJudges, JudgeSchema } from '../../judges'
import { ComponentStatusSchema, getRefType } from '../../types'
import { clientsAction, getClient } from '../actions/clients.action'
import {
  ClientBase,
  ClientResponse,
  DefaultClientFormData,
  DefaultClientFormErrorData,
} from '../types/clients.data.types'
import { getClientFormDataFromSchema, isAreTwoClientsSame, validateClient } from '../utils/clients.utils'

const mapStateToProps = ({ refTypes, judges }: GlobalState) => {
  return {
    componentStatusList: refTypes.componentStatus,
    judgesList: judges.judges,
  }
}

const mapDispatchToProps = {
  getRefType: () => getRefType(REF_TYPES_REGISTRY.COMPONENT_STATUS),
  getJudges: () => getJudges(),
}

interface ClientProps {
  componentStatusList: ComponentStatusSchema[]
  getRefType: () => void
  judgesList: JudgeSchema[]
  getJudges: () => void
}

const Client = (props: ClientProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const store = useStore<GlobalState>().getState()
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()

  const { componentStatusList, getRefType } = props
  const { judgesList, getJudges } = props

  const [formData, setFormData] = useState(DefaultClientFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultClientFormData)
  const [formErrors, setFormErrors] = useState(DefaultClientFormErrorData)

  const clientStatusList = useCallback(() => {
    return componentStatusList.filter((x) => x.componentName === COMPONENT_STATUS_NAME.CLIENTS)
  }, [componentStatusList])

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
          }
        })
      }
      componentStatusList.length === 0 && getRefType()
      judgesList.length === 0 && getJudges()
    }
    isForceFetch.current = false
  }, [componentStatusList.length, judgesList.length, dispatch, getJudges, getRefType, id, store])

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

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTopLinksComponent(COMPONENT_STATUS_NAME.CLIENTS, '/clients/', searchQueryParams)}
          {pageTitleComponent(COMPONENT_STATUS_NAME.CLIENTS, formData.name)}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {pageNotSelectedComponent(COMPONENT_STATUS_NAME.CLIENTS)}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {clientForm()}
              {clientButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Divider />
              <Typography component="h1" variant="h6" color="primary">
                COURT CASES OF CLIENT:
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Client)
