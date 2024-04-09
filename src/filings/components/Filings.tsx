import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import {
  addModalComponent,
  deleteModalComponent,
  pageTitleComponent,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  updateModalComponent,
} from '@app/components/CommonComponents'
import { GlobalState } from '@app/store/redux'
import { useModal } from '@app/utils/app.hooks'
import { getNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { getCourtCases } from '@cases/actions/courtCases.action'
import { CourtCaseFormData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { getClients } from '@clients/actions/clients.action'
import { ClientSchema } from '@clients/types/clients.data.types'
import { ACTION_TYPES, ActionTypes, COMPONENT_STATUS_NAME, ID_DEFAULT, INVALID_INPUT } from '@constants/index'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import FilingForm from './FilingForm'
import FilingTable from './FilingTable'
import { filingsAction, getFilings } from '../actions/filings.action'
import {
  DefaultFilingFormData,
  DefaultFilingFormErrorData,
  FilingBase,
  FilingFormData,
  FilingResponse,
  FilingSchema,
} from '../types/filings.data.types'
import { getClientFilingType, isAreTwoFilingsSame, validateFiling } from '../utils/filings.utils'

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
  selectedCourtCase?: CourtCaseSchema | CourtCaseFormData
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
  const { selectedCourtCase } = props

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

      if (refTypes.componentStatus.length === 0 || refTypes.caseType.length === 0) {
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
    refTypes.caseType.length,
    refTypes.componentStatus.length,
  ])

  useEffect(() => {
    if (selectedCourtCase) {
      formData.courtCaseId = selectedCourtCase.id || ID_DEFAULT
    }
  }, [formData, selectedCourtCase])

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
        selectedCourtCase={selectedCourtCase}
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
      undefined,
      isAreTwoFilingsSame(formData, formDataReset),
      isAreTwoFilingsSame(formData, formDataReset),
      isAreTwoFilingsSame(formData, formDataReset),
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
      undefined,
      isAreTwoFilingsSame(formData, formDataReset),
      isAreTwoFilingsSame(formData, formDataReset),
      isAreTwoFilingsSame(formData, formDataReset),
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } FILING ${getClientFilingType(
    formData.filingTypeId,
    refTypes.filingType,
    formData.courtCaseId,
    courtCasesList,
    clientsList,
  )}?!?`

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
      componentStatusList={filingStatusList()}
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
