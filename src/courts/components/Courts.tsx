import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import CourtForm from './CourtForm'
import CourtTable from './CourtTable'
import {
  addModalComponent,
  deleteModalComponent,
  FetchRequestMetadata,
  getNumber,
  GlobalState,
  pageTitleComponent,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  updateModalComponent,
  useModal,
} from '../../app'
import { ACTION_TYPES, ActionTypes, COMPONENT_STATUS_NAME, INVALID_INPUT, REF_TYPES_REGISTRY } from '../../constants'
import { ComponentStatusSchema, getRefType } from '../../types'
import { courtsAction, getCourts } from '../actions/courts.action'
import {
  CourtBase,
  CourtFormData,
  CourtResponse,
  CourtSchema,
  DefaultCourtFormData,
  DefaultCourtFromErrorData,
} from '../types/courts.data.types'
import { validateCourt } from '../utils/courts.utils'

const mapStateToProps = ({ refTypes, courts }: GlobalState) => {
  return {
    componentStatusList: refTypes.componentStatus,
    courtsList: courts.courts,
  }
}

const mapDispatchToProps = {
  getRefType: () => getRefType(REF_TYPES_REGISTRY.COMPONENT_STATUS),
  getCourts: (requestMetadata: Partial<FetchRequestMetadata>) => getCourts({ requestMetadata: requestMetadata }),
}

interface CourtsProps {
  courtsList: CourtSchema[]
  getCourts: (requestMetadata: Partial<FetchRequestMetadata>) => void
  componentStatusList: ComponentStatusSchema[]
  getRefType: () => void
}

const Courts = (props: CourtsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { courtsList, getCourts } = props
  const { componentStatusList, getRefType } = props

  const [formData, setFormData] = useState(DefaultCourtFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultCourtFormData)
  const [formErrors, setFormErrors] = useState(DefaultCourtFromErrorData)

  const courtStatusList = useCallback(() => {
    return componentStatusList.filter((x) => x.componentName === COMPONENT_STATUS_NAME.COURTS)
  }, [componentStatusList])

  useEffect(() => {
    if (isForceFetch.current) {
      courtsList.length === 0 && getCourts({})
      componentStatusList.length === 0 && getRefType()
    }
  }, [componentStatusList.length, courtsList.length, getCourts, getRefType])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const getCourtsWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getCourts(requestMetadata)
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateCourt(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let courtResponse: CourtResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (action === ACTION_TYPES.CREATE) {
      const courtsRequest: CourtBase = { ...formData }
      courtResponse = await (await courtsAction({ action, courtsRequest }))(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const courtsRequest: CourtBase = { ...formData }
      courtResponse = await (
        await courtsAction({
          action: action,
          courtsRequest: courtsRequest,
          id: formData.id,
          isRestore: action === ACTION_TYPES.RESTORE,
          isHardDelete: formData.isHardDelete,
        })
      )(dispatch)
    }

    if (courtResponse && !courtResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultCourtFormData,
        DefaultCourtFromErrorData,
      )
      isForceFetch.current = true
    }
  }

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <CourtForm
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        courtStatusList={courtStatusList()}
        isShowOneCourt={false}
      />
    </Box>
  )

  const addModal = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.COURTS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultCourtFormData,
      DefaultCourtFromErrorData,
      formDataReset,
    )

  const updateModal = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.COURTS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultCourtFormData,
      DefaultCourtFromErrorData,
      formDataReset,
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } COURT: ${formData.name}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.COURTS,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultCourtFormData,
      DefaultCourtFromErrorData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: CourtFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.COURTS,
      formDataModal,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const courtsTable = () => (
    <CourtTable
      courtsList={courtsList}
      actionButtons={actionButtons}
      addModalState={addModalState}
      softDeleteCallback={getCourtsWithMetadata}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.COURTS)}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {courtsTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Courts)
