import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch, useStore } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import CourtForm from './CourtForm'
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
import { ComponentStatusSchema, getRefType } from '../../types'
import { courtsAction, getCourt } from '../actions/courts.action'
import { CourtBase, CourtResponse, DefaultCourtFormData, DefaultCourtFromErrorData } from '../types/courts.data.types'
import { getCourtFormDataFromSchema, isAreTwoCourtsSame, validateCourt } from '../utils/courts.utils'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    componentStatusList: refTypes.componentStatus,
  }
}

const mapDispatchToProps = {
  getRefType: () => getRefType(REF_TYPES_REGISTRY.COMPONENT_STATUS),
}

interface CourtProps {
  componentStatusList: ComponentStatusSchema[]
  getRefType: () => void
}

const Court = (props: CourtProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const store = useStore<GlobalState>().getState()
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()

  const { componentStatusList, getRefType } = props

  const [formData, setFormData] = useState(DefaultCourtFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultCourtFormData)
  const [formErrors, setFormErrors] = useState(DefaultCourtFromErrorData)

  const courtStatusList = useCallback(() => {
    return componentStatusList.filter((x) => x.componentName === COMPONENT_STATUS_NAME.COURTS)
  }, [componentStatusList])

  useEffect(() => {
    if (isForceFetch.current) {
      const fetchCourt = async (id: number) => {
        return await getCourt(id)(dispatch, store)
      }
      if (isValidId(id)) {
        fetchCourt(getNumber(id)).then((oneCourt) => {
          if (oneCourt) {
            const oneCourtFormData = getCourtFormDataFromSchema(oneCourt)
            setFormData(oneCourtFormData)
            setFormDataReset(oneCourtFormData)
          }
        })
      }
      componentStatusList.length === 0 && getRefType()
    }
    isForceFetch.current = false
  }, [componentStatusList.length, dispatch, getRefType, id, store])

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
              <Typography component="h1" variant="h6" color="primary">
                JUDGES IN COURT:
              </Typography>
              {/*<Judges courtId={id} />*/}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Court)
