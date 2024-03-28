import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch, useStore } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import JudgeForm from './JudgeForm'
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
import { CourtSchema, getCourts } from '../../courts'
import { ComponentStatusSchema, getRefType } from '../../types'
import { getJudge, judgesAction } from '../actions/judges.action'
import { DefaultJudgeFormData, DefaultJudgeFormErrorData, JudgeBase, JudgeResponse } from '../types/judges.data.types'
import { getJudgeFormDataFromSchema, isAreTwoJudgesSame, validateJudge } from '../utils/judges.utils'

const mapStateToProps = ({ refTypes, courts }: GlobalState) => {
  return {
    componentStatusList: refTypes.componentStatus,
    courtsList: courts.courts,
  }
}

const mapDispatchToProps = {
  getRefType: () => getRefType(REF_TYPES_REGISTRY.COMPONENT_STATUS),
  getCourts: () => getCourts(),
}

interface JudgeProps {
  componentStatusList: ComponentStatusSchema[]
  getRefType: () => void
  courtsList: CourtSchema[]
  getCourts: () => void
}

const Judge = (props: JudgeProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const store = useStore<GlobalState>().getState()
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()

  const { componentStatusList, getRefType } = props
  const { courtsList, getCourts } = props

  const [formData, setFormData] = useState(DefaultJudgeFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultJudgeFormData)
  const [formErrors, setFormErrors] = useState(DefaultJudgeFormErrorData)

  const judgeStatusList = useCallback(() => {
    return componentStatusList.filter((x) => x.componentName === COMPONENT_STATUS_NAME.JUDGES)
  }, [componentStatusList])

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
          }
        })
      }
      componentStatusList.length === 0 && getRefType()
      courtsList.length === 0 && getCourts()
    }
    isForceFetch.current = false
  }, [componentStatusList.length, courtsList.length, dispatch, getCourts, getRefType, id, store])

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

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTopLinksComponent(COMPONENT_STATUS_NAME.JUDGES, '/judges/', searchQueryParams)}
          {pageTitleComponent(COMPONENT_STATUS_NAME.JUDGES, formData.name)}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {pageNotSelectedComponent(COMPONENT_STATUS_NAME.JUDGES)}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {judgeForm()}
              {judgeButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Divider />
              <Typography component="h1" variant="h6" color="primary">
                CLIENTS ASSIGNED TO JUDGE:
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Judge)
