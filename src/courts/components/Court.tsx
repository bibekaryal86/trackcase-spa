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
import { ACTION_TYPES, COMPONENT_STATUS_NAME, INVALID_INPUT } from '@constants/index'
import JudgeTable from '@judges/components/JudgeTable'
import { JudgeSchema } from '@judges/types/judges.data.types'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import CourtForm from './CourtForm'
import { courtsAction, getCourt } from '../actions/courts.action'
import { CourtBase, CourtResponse, DefaultCourtFormData, DefaultCourtFormErrorData } from '../types/courts.data.types'
import { getCourtFormDataFromSchema, isAreTwoCourtsSame, validateCourt } from '../utils/courts.utils'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    refTypes: refTypes,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
}

interface CourtProps {
  refTypes: RefTypesState
  getRefTypes: () => void
}

const Court = (props: CourtProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useGlobalDispatch()
  const store = useStore<GlobalState>().getState()
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()

  const { refTypes, getRefTypes } = props

  const [formData, setFormData] = useState(DefaultCourtFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultCourtFormData)
  const [formErrors, setFormErrors] = useState(DefaultCourtFormErrorData)
  const [judgesList, setJudgesList] = useState([] as JudgeSchema[])

  const courtStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.COURTS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      const fetchCourt = async (id: number) => {
        return await getCourt(id, true)(dispatch, store)
      }
      if (isValidId(id)) {
        fetchCourt(getNumber(id)).then((oneCourt) => {
          if (oneCourt) {
            const oneCourtFormData = getCourtFormDataFromSchema(oneCourt)
            setFormData(oneCourtFormData)
            setFormDataReset(oneCourtFormData)
            setJudgesList(oneCourt.judges || [])
          }
        })
      }
      refTypes.componentStatus.length === 0 && getRefTypes()
    }
    isForceFetch.current = false
  }, [dispatch, getRefTypes, id, refTypes.componentStatus.length, store])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const courtForm = () => (
    <CourtForm
      formData={formData}
      setFormData={setFormData}
      formErrors={formErrors}
      setFormErrors={setFormErrors}
      courtStatusList={courtStatusList()}
      isShowOneCourt={true}
    />
  )

  const primaryButtonCallback = async () => {
    const hasFormErrors = validateCourt(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let courtResponse: CourtResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (isValidId(id)) {
      const courtsRequest: CourtBase = { ...formData }
      courtResponse = await courtsAction({
        action: ACTION_TYPES.UPDATE,
        courtsRequest: courtsRequest,
        id: formData.id,
      })(dispatch)
    }

    if (courtResponse && !courtResponse.detail) {
      isForceFetch.current = true
    }
  }

  const courtButtons = () =>
    pageActionButtonsComponent(
      COMPONENT_STATUS_NAME.COURTS,
      formData,
      primaryButtonCallback,
      () => setFormData(formDataReset),
      !isValidId(id) || isAreTwoCourtsSame(formData, formDataReset),
    )

  const judgesTable = () => (
    <JudgeTable judgesList={judgesList} selectedCourt={formData} componentStatusList={refTypes.componentStatus} />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTopLinksComponent(COMPONENT_STATUS_NAME.COURTS, '/courts/', searchQueryParams)}
          {pageTitleComponent(COMPONENT_STATUS_NAME.COURTS, `${formData.name}, ${formData.state}`)}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {pageNotSelectedComponent(COMPONENT_STATUS_NAME.COURTS)}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {courtForm()}
              {courtButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Divider />
              <Typography component="h1" variant="h6" color="primary">
                JUDGES IN COURT:
              </Typography>
              {judgesTable()}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Court)
