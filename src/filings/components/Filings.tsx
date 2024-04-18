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
import { getDayjsString, getNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { getCourtCases } from '@cases/actions/courtCases.action'
import { CourtCaseFormData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { getClients } from '@clients/actions/clients.action'
import { ClientSchema } from '@clients/types/clients.data.types'
import {
  ACTION_TYPES,
  ActionTypes,
  COMPONENT_STATUS_NAME,
  FILING_TYPES,
  FilingTypes,
  ID_DEFAULT,
  INVALID_INPUT,
} from '@constants/index'
import { FilingForm, FilingFormRfe } from '@filings/components/FilingForm'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import FilingTable from './FilingTable'
import { filingRfesAction, filingsAction, getFilings } from '../actions/filings.action'
import {
  DefaultFilingFormData,
  DefaultFilingFormErrorData,
  DefaultFilingRfeFormData,
  DefaultFilingRfeFormErrorData,
  FilingBase,
  FilingFormData,
  FilingResponse,
  FilingRfeBase,
  FilingRfeFormData,
  FilingRfeResponse,
  FilingSchema,
} from '../types/filings.data.types'
import {
  getClientFilingType,
  isAreTwoFilingRfesSame,
  isAreTwoFilingsSame,
  validateFiling,
  validateFilingRfe,
} from '../utils/filings.utils'

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
  selectedCourtCase?: CourtCaseFormData
}

const Filings = (props: FilingsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [
    addModalState,
    addModalStateRfe,
    updateModalState,
    updateModalStateRfe,
    deleteModalState,
    deleteModalStateRfe,
  ] = [useModal(), useModal(), useModal(), useModal(), useModal(), useModal()]

  const { filingsList, getFilings } = props
  const { refTypes, getRefTypes } = props
  const { courtCasesList, getCourtCases } = props
  const { clientsList, getClients } = props
  const { selectedCourtCase } = props

  const [formData, setFormData] = useState(DefaultFilingFormData)
  const [formDataRfe, setFormDataRfe] = useState(DefaultFilingRfeFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultFilingFormData)
  const [formDataResetRfe, setFormDataResetRfe] = useState(DefaultFilingRfeFormData)
  const [formErrors, setFormErrors] = useState(DefaultFilingFormErrorData)
  const [formErrorsRfe, setFormErrorsRfe] = useState(DefaultFilingRfeFormErrorData)

  const filingStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.FILINGS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      !selectedCourtCase && filingsList.length === 0 && getFilings({})
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
    selectedCourtCase,
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

  const primaryButtonCallback = async (action: ActionTypes, type?: string) => {
    const isRfe = type === FILING_TYPES.FILING_RFE
    const filingId = isRfe ? getNumber(formDataRfe.id) : getNumber(formData.id)

    const filingsRequest: FilingBase | FilingRfeBase = isRfe ? { ...formDataRfe } : { ...formData }

    const hasFormErrors = isRfe
      ? validateFilingRfe(formDataRfe, setFormErrorsRfe)
      : validateFiling(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let filingResponse: FilingResponse | FilingRfeResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (action === ACTION_TYPES.CREATE) {
      filingResponse = isRfe
        ? await filingRfesAction({ action, filingRfesRequest: filingsRequest as FilingRfeBase })(dispatch)
        : await filingsAction({ action, filingsRequest: filingsRequest as FilingBase })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(filingId) > 0
    ) {
      filingResponse = isRfe
        ? await filingRfesAction({
            action: action,
            filingRfesRequest: filingsRequest as FilingRfeBase,
            id: formDataRfe.id,
            isRestore: action === ACTION_TYPES.RESTORE,
            isHardDelete: formData.isHardDelete,
          })(dispatch)
        : await filingsAction({
            action: action,
            filingsRequest: filingsRequest as FilingBase,
            id: formData.id,
            isRestore: action === ACTION_TYPES.RESTORE,
            isHardDelete: formData.isHardDelete,
          })(dispatch)
    }

    if (filingResponse && !filingResponse.detail) {
      isRfe
        ? secondaryButtonCallback(
            addModalStateRfe,
            updateModalStateRfe,
            deleteModalStateRfe,
            setFormDataRfe,
            setFormErrorsRfe,
            DefaultFilingRfeFormData,
            DefaultFilingRfeFormErrorData,
          )
        : secondaryButtonCallback(
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

  const addUpdateModalContentRfe = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <FilingFormRfe
        formData={formDataRfe}
        setFormData={setFormDataRfe}
        formErrors={formErrorsRfe}
        setFormErrors={setFormErrorsRfe}
        filingsList={filingsList}
        filingTypesList={refTypes.filingType}
        courtCasesList={courtCasesList}
        clientsList={clientsList}
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
      FILING_TYPES.FILING,
      isAreTwoFilingsSame(formData, formDataReset),
      false,
      isAreTwoFilingsSame(formData, formDataReset),
    )

  const addModalRfe = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      addUpdateModalContentRfe(),
      primaryButtonCallback,
      addModalStateRfe,
      updateModalStateRfe,
      deleteModalStateRfe,
      setFormDataRfe,
      setFormErrorsRfe,
      formDataResetRfe,
      DefaultFilingRfeFormErrorData,
      formDataResetRfe,
      FILING_TYPES.FILING_RFE,
      isAreTwoFilingRfesSame(formDataRfe, formDataResetRfe),
      false,
      isAreTwoFilingRfesSame(formDataRfe, formDataResetRfe),
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
      FILING_TYPES.FILING,
      isAreTwoFilingsSame(formData, formDataReset),
      false,
      isAreTwoFilingsSame(formData, formDataReset),
    )

  const updateModalRfe = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      addUpdateModalContentRfe(),
      primaryButtonCallback,
      addModalStateRfe,
      updateModalStateRfe,
      deleteModalStateRfe,
      setFormDataRfe,
      setFormErrorsRfe,
      DefaultFilingRfeFormData,
      DefaultFilingRfeFormErrorData,
      formDataResetRfe,
      FILING_TYPES.FILING_RFE,
      isAreTwoFilingRfesSame(formDataRfe, formDataResetRfe),
      false,
      isAreTwoFilingRfesSame(formDataRfe, formDataResetRfe),
    )

  const getDeleteModalContextText = (type: FilingTypes) =>
    type === FILING_TYPES.FILING
      ? `ARE YOU SURE YOU WANT TO ${
          formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
        } FILING ${getClientFilingType(
          formData.filingTypeId,
          refTypes.filingType,
          formData.courtCaseId,
          courtCasesList,
          clientsList,
        )}?!?`
      : `ARE YOU SURE YOU WANT TO ${formDataRfe.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE} FILING RFE ${
          formDataRfe.rfeReason
        }, ${getDayjsString(formDataRfe.rfeDate)}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      getDeleteModalContextText(FILING_TYPES.FILING),
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
      FILING_TYPES.FILING,
    )

  const deleteModalRfe = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      getDeleteModalContextText(FILING_TYPES.FILING_RFE),
      primaryButtonCallback,
      addModalStateRfe,
      updateModalStateRfe,
      deleteModalStateRfe,
      setFormDataRfe,
      setFormErrorsRfe,
      DefaultFilingRfeFormData,
      DefaultFilingRfeFormErrorData,
      formDataRfe,
      formErrorsRfe,
      FILING_TYPES.FILING_RFE,
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

  const actionButtonsRfe = (formDataModal: FilingRfeFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.FILINGS,
      formDataModal,
      updateModalStateRfe,
      deleteModalStateRfe,
      setFormDataRfe,
      setFormDataResetRfe,
    )

  const addFilingRfeButtonCallback = (filingId: number) => {
    setFormDataRfe({ ...DefaultFilingRfeFormData, filingId })
    setFormDataResetRfe({ ...DefaultFilingRfeFormData, filingId })
  }

  const filingsTable = () => (
    <FilingTable
      filingsList={selectedCourtCase ? selectedCourtCase.filings || [] : filingsList}
      actionButtons={actionButtons}
      actionButtonsRfe={actionButtonsRfe}
      addModalState={addModalState}
      addModalStateRfe={addModalStateRfe}
      softDeleteCallback={getFilingsWithMetadata}
      componentStatusList={filingStatusList()}
      filingTypesList={refTypes.filingType}
      courtCasesList={courtCasesList}
      clientsList={clientsList}
      selectedCourtCase={selectedCourtCase}
      addFilingRfeButtonCallback={addFilingRfeButtonCallback}
    />
  )

  const showModals = () => (
    <>
      {addModal()}
      {addModalRfe()}
      {updateModal()}
      {updateModalRfe()}
      {deleteModal()}
      {deleteModalRfe()}
    </>
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
      {showModals()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Filings)
