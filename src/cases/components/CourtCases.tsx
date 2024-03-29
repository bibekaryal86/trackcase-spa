import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import CourtCaseForm from './CourtCaseForm'
import CourtCaseTable from './CourtCaseTable'
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
import { ClientSchema, getClients } from '../../clients'
import {
  ACTION_TYPES,
  ActionTypes,
  COMPONENT_STATUS_NAME,
  INVALID_INPUT,
  REF_TYPES_REGISTRY,
  RefTypesRegistry,
} from '../../constants'
import { CaseTypeSchema, ComponentStatusSchema, getRefType } from '../../types'
import { courtCasesAction, getCourtCases } from '../actions/courtCases.action'
import {
  CourtCaseBase,
  CourtCaseFormData,
  CourtCaseResponse,
  CourtCaseSchema,
  DefaultCourtCaseFormData,
  DefaultCourtCaseFormErrorData,
} from '../types/courtCases.data.types'
import { validateCourtCase } from '../utils/courtCases.utils'

const mapStateToProps = ({ refTypes, courtCases, clients }: GlobalState) => {
  return {
    componentStatusList: refTypes.componentStatus,
    caseTypesList: refTypes.caseType,
    courtCasesList: courtCases.courtCases,
    clientsList: clients.clients,
  }
}

const mapDispatchToProps = {
  getRefType: (refType: RefTypesRegistry) => getRefType(refType),
  getCourtCases: (requestMetadata: Partial<FetchRequestMetadata>) => getCourtCases(requestMetadata),
  getClients: () => getClients(),
}

interface CourtCasesProps {
  courtCasesList: CourtCaseSchema[]
  getCourtCases: (requestMetadata: Partial<FetchRequestMetadata>) => void
  componentStatusList: ComponentStatusSchema[]
  caseTypesList: CaseTypeSchema[]
  getRefType: (refType: RefTypesRegistry) => void
  clientsList: ClientSchema[]
  getClients: () => void
}

const CourtCases = (props: CourtCasesProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { courtCasesList, getCourtCases } = props
  const { caseTypesList, componentStatusList, getRefType } = props
  const { clientsList, getClients } = props

  const [formData, setFormData] = useState(DefaultCourtCaseFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultCourtCaseFormData)
  const [formErrors, setFormErrors] = useState(DefaultCourtCaseFormErrorData)

  const courtCaseStatusList = useCallback(() => {
    return componentStatusList.filter((x) => x.componentName === COMPONENT_STATUS_NAME.COURT_CASES)
  }, [componentStatusList])

  useEffect(() => {
    if (isForceFetch.current) {
      courtCasesList.length === 0 && getCourtCases({})
      caseTypesList.length === 0 && getRefType(REF_TYPES_REGISTRY.CASE_TYPE)
      componentStatusList.length === 0 && getRefType(REF_TYPES_REGISTRY.COMPONENT_STATUS)
      clientsList.length === 0 && getClients()
    }
  }, [
    caseTypesList.length,
    componentStatusList.length,
    courtCasesList.length,
    getCourtCases,
    getRefType,
    clientsList.length,
    getClients,
  ])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const getCourtCasesWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getCourtCases(requestMetadata)
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateCourtCase(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let courtCaseResponse: CourtCaseResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (action === ACTION_TYPES.CREATE) {
      const courtCasesRequest: CourtCaseBase = { ...formData }
      courtCaseResponse = await courtCasesAction({ action, courtCasesRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const courtCasesRequest: CourtCaseBase = { ...formData }
      courtCaseResponse = await courtCasesAction({
        action: action,
        courtCasesRequest: courtCasesRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (courtCaseResponse && !courtCaseResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultCourtCaseFormData,
        DefaultCourtCaseFormErrorData,
      )
      isForceFetch.current = true
      courtCasesList.length === 0 && getCourtCases({})
    }
  }

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <CourtCaseForm
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        courtCaseStatusList={courtCaseStatusList()}
        isShowOneCourtCase={false}
        clientsList={clientsList}
        caseTypesList={caseTypesList}
      />
    </Box>
  )

  const addModal = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.COURT_CASES,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultCourtCaseFormData,
      DefaultCourtCaseFormErrorData,
      formDataReset,
    )

  const updateModal = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.COURT_CASES,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultCourtCaseFormData,
      DefaultCourtCaseFormErrorData,
      formDataReset,
    )

  const getClientCaseType = () => {
    const selectedCaseType = caseTypesList.find((x) => x.id === formData.caseTypeId)
    const selectedClient = clientsList.find((x) => x.id === formData.clientId)
    if (selectedCaseType && selectedClient) {
      return ': ' + selectedClient.name + ', ' + selectedCaseType.name
    }
    return ''
  }

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } COURT CASE ${getClientCaseType()}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.COURT_CASES,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultCourtCaseFormData,
      DefaultCourtCaseFormErrorData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: CourtCaseFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.COURT_CASES,
      formDataModal,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const courtCasesTable = () => (
    <CourtCaseTable
      courtCasesList={courtCasesList}
      actionButtons={actionButtons}
      addModalState={addModalState}
      softDeleteCallback={getCourtCasesWithMetadata}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.COURT_CASES.replace('_', ' '))}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {courtCasesTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CourtCases)
