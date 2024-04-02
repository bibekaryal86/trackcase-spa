import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import FilingForm from './FilingForm'
import FilingTable from './FilingTable'
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
import { CourtCaseSchema, getCourtCases } from '../../cases'
import { ClientSchema, getClients } from '../../clients'
import { ACTION_TYPES, ActionTypes, COMPONENT_STATUS_NAME, INVALID_INPUT } from '../../constants'
import { getRefTypes, RefTypesState } from '../../types'
import { filingsAction, getFilings } from '../actions/filings.action'
import {
  DefaultFilingFormData,
  DefaultFilingFormErrorData,
  FilingBase,
  FilingFormData,
  FilingResponse,
  FilingSchema,
} from '../types/filings.data.types'
import { validateFiling } from '../utils/filings.utils'

const mapStateToProps = ({ refTypes, filings, courtCases, clients }: GlobalState) => {
  return {
    refTypes: refTypes,
    filingsList: filings.filings,
    courtCasesList: courtCases.courtCases,
    clientsList: clients.clients,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getFilings: (requestMetadata: Partial<FetchRequestMetadata>) => getFilings(requestMetadata),
  getCourtCases: () => getCourtCases(),
  getClients: () => getClients(),
}

interface FilingsProps {
  filingsList: FilingSchema[]
  getFilings: (requestMetadata: Partial<FetchRequestMetadata>) => void
  refTypes: RefTypesState
  getRefTypes: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCases: () => void
  clientsList: ClientSchema[]
  getClients: () => void
}

const Filings = (props: FilingsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { filingsList, getFilings } = props
  const { refTypes, getRefTypes } = props
  const { courtCasesList, getCourtCases } = props
  const { clientsList, getClients } = props

  const [formData, setFormData] = useState(DefaultFilingFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultFilingFormData)
  const [formErrors, setFormErrors] = useState(DefaultFilingFormErrorData)

  const filingStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.FILINGS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      filingsList.length === 0 && getFilings({})
      courtCasesList.length === 0 && getCourtCases()
      clientsList.length === 0 && getClients()

      if (refTypes.componentStatus.length === 0) {
        getRefTypes()
      }
    }
  }, [
    clientsList.length,
    courtCasesList.length,
    filingsList.length,
    getClients,
    getCourtCases,
    getFilings,
    getRefTypes,
    refTypes.componentStatus.length,
  ])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const getFilingsWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getFilings(requestMetadata)
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateFiling(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let filingResponse: FilingResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (action === ACTION_TYPES.CREATE) {
      const filingsRequest: FilingBase = { ...formData }
      filingResponse = await filingsAction({ action, filingsRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const filingsRequest: FilingBase = { ...formData }
      filingResponse = await filingsAction({
        action: action,
        filingsRequest: filingsRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (filingResponse && !filingResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultFilingFormData,
        DefaultFilingFormErrorData,
      )
      isForceFetch.current = true
      filingsList.length === 0 && getFilings({})
    }
  }

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FilingForm
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        filingStatusList={filingStatusList()}
        isShowOneFiling={false}
        courtCasesList={courtCasesList}
        filingTypesList={refTypes.filingType}
      />
    </Box>
  )

  const addModal = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultFilingFormData,
      DefaultFilingFormErrorData,
      formDataReset,
    )

  const updateModal = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultFilingFormData,
      DefaultFilingFormErrorData,
      formDataReset,
    )

  const getClientFilingType = () => {
    const selectedFilingType = refTypes.filingType.find((x) => x.id === formData.filingTypeId)
    const selectedCourtCase = courtCasesList.find((x) => x.id === formData.courtCaseId)
    if (selectedCourtCase) {
      const selectedClient = clientsList.find((x) => x.id === selectedCourtCase?.clientId)
      if (selectedFilingType && selectedClient) {
        return ': ' + selectedClient.name + ', ' + selectedFilingType.name
      }
    }
    return ''
  }

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } FILING ${getClientFilingType()}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultFilingFormData,
      DefaultFilingFormErrorData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: FilingFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      formDataModal,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const filingsTable = () => (
    <FilingTable
      filingsList={filingsList}
      actionButtons={actionButtons}
      addModalState={addModalState}
      softDeleteCallback={getFilingsWithMetadata}
      componentStatusList={refTypes.componentStatus}
      filingTypesList={refTypes.filingType}
      courtCasesList={courtCasesList}
      clientsList={clientsList}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.FILINGS)}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {filingsTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Filings)
