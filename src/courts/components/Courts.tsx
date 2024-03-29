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
import { ACTION_TYPES, ActionTypes, COMPONENT_STATUS_NAME, INVALID_INPUT } from '../../constants'
import { getRefTypes, RefTypesState } from '../../types'
import { courtsAction, getCourts } from '../actions/courts.action'
import {
  CourtBase,
  CourtFormData,
  CourtResponse,
  CourtSchema,
  DefaultCourtFormData,
  DefaultCourtFormErrorData,
} from '../types/courts.data.types'
import { validateCourt } from '../utils/courts.utils'

const mapStateToProps = ({ refTypes, courts }: GlobalState) => {
  return {
    refTypes: refTypes,
    courtsList: courts.courts,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getCourts: (requestMetadata: Partial<FetchRequestMetadata>) => getCourts(requestMetadata),
}

interface CourtsProps {
  courtsList: CourtSchema[]
  getCourts: (requestMetadata: Partial<FetchRequestMetadata>) => void
  refTypes: RefTypesState
  getRefTypes: () => void
}

const Courts = (props: CourtsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { courtsList, getCourts } = props
  const { refTypes, getRefTypes } = props

  const [formData, setFormData] = useState(DefaultCourtFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultCourtFormData)
  const [formErrors, setFormErrors] = useState(DefaultCourtFormErrorData)

  const courtStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.COURTS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      courtsList.length === 0 && getCourts({})
      refTypes.componentStatus.length === 0 && getRefTypes()
    }
  }, [courtsList.length, getCourts, getRefTypes, refTypes.componentStatus.length])

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
      courtResponse = await courtsAction({ action, courtsRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const courtsRequest: CourtBase = { ...formData }
      courtResponse = await courtsAction({
        action: action,
        courtsRequest: courtsRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (courtResponse && !courtResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultCourtFormData,
        DefaultCourtFormErrorData,
      )
      isForceFetch.current = true
      courtsList.length === 0 && getCourts({})
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
      DefaultCourtFormErrorData,
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
      DefaultCourtFormErrorData,
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
      DefaultCourtFormErrorData,
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
