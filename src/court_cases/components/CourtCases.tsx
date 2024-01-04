import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import CourtCaseForm from './CourtCaseForm'
import CourtCaseTable from './CourtCaseTable'
import { getNumber, getStatusesList, GlobalState, Modal, StatusSchema, unmountPage } from '../../app'
import { ClientSchema, getClient, getClients } from '../../clients'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_RESET,
  BUTTON_UPDATE,
  ID_DEFAULT,
} from '../../constants'
import { CaseTypeSchema } from '../../ref_types'
import { getCaseTypes } from '../../ref_types/actions/case_types.action'
import { addCourtCase, deleteCourtCase, editCourtCase, getCourtCases } from '../actions/court_cases.action'
import { COURT_CASES_UNMOUNT } from '../types/court_cases.action.types'
import { CourtCaseSchema, DefaultCourtCaseSchema } from '../types/court_cases.data.types'
import { isAreTwoCourtCasesSame, validateCourtCase } from '../utils/court_cases.utils'

const mapStateToProps = ({ court_cases, statuses, clients, caseTypes }: GlobalState) => {
  return {
    isCloseModal: court_cases.isCloseModal,
    courtCasesList: court_cases.court_cases,
    statusList: statuses.statuses,
    clientsList: clients.clients,
    selectedClient: clients.selectedClient,
    caseTypesList: caseTypes.case_types,
  }
}

const mapDispatchToProps = {
  getCourtCases: () => getCourtCases(),
  addCourtCase: (courtCase: CourtCaseSchema) => addCourtCase(courtCase),
  editCourtCase: (id: number, courtCase: CourtCaseSchema) => editCourtCase(id, courtCase),
  deleteCourtCase: (id: number) => deleteCourtCase(id),
  unmountPage: () => unmountPage(COURT_CASES_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getClients: () => getClients(),
  getClient: (clientId: number) => getClient(clientId),
  getCaseTypes: () => getCaseTypes(),
}

interface CourtCasesProps {
  isCloseModal: boolean
  courtCasesList: CourtCaseSchema[]
  getCourtCases: () => void
  addCourtCase: (courtCase: CourtCaseSchema) => void
  editCourtCase: (id: number, courtCase: CourtCaseSchema) => void
  deleteCourtCase: (id: number) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  clientsList: ClientSchema[]
  getClients: () => void
  clientId?: string
  selectedClient?: ClientSchema
  getClient: (clientId: number) => void
  caseTypesList: CaseTypeSchema[]
  getCaseTypes: () => void
}

const CourtCases = (props: CourtCasesProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { courtCasesList, getCourtCases, clientsList, getClients } = props
  const { unmountPage } = props
  const { isCloseModal } = props
  const { statusList, getStatusesList } = props
  const { clientId, selectedClient, getClient } = props
  const { caseTypesList, getCaseTypes } = props

  const [modal, setModal] = useState('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedCourtCase, setSelectedCourtCase] = useState<CourtCaseSchema>(DefaultCourtCaseSchema)
  const [selectedCourtCaseForReset, setSelectedCourtCaseForReset] = useState<CourtCaseSchema>(DefaultCourtCaseSchema)
  const [courtCaseStatusList, setCourtCaseStatusList] = useState<string[]>([])

  useEffect(() => {
    if (clientId) {
      setSelectedCourtCase({ ...DefaultCourtCaseSchema, client_id: getNumber(clientId) })
      if (!selectedClient) {
        getClient(getNumber(clientId))
      }
    }
  }, [clientId, selectedClient, getClient])

  useEffect(() => {
    if (!isFetchRunDone.current) {
      courtCasesList.length === 0 && getCourtCases()
      clientsList.length === 0 && getClients()
      caseTypesList.length === 0 && getCaseTypes()
      statusList.court_case.all.length === 0 && getStatusesList()
    }
    isFetchRunDone.current = true
  }, [courtCasesList.length, getCourtCases, statusList.court_case.all, getStatusesList, caseTypesList.length, getCaseTypes, clientsList.length, getClients])


  useEffect(() => {
    if (isCloseModal) {
      secondaryButtonCallback()
    }
  }, [isCloseModal])

  useEffect(() => {
    if (statusList.court_case.all.length > 0) {
      setCourtCaseStatusList(statusList.court_case.all)
    }
  }, [statusList.court_case.all])

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const primaryButtonCallback = (action: string, id?: number) => {
    if (id && action === ACTION_DELETE) {
      props.deleteCourtCase(id)
    } else if (id && action === ACTION_UPDATE) {
      if (validateCourtCase(selectedCourtCase)) {
        props.editCourtCase(id, selectedCourtCase)
      }
    } else {
      if (validateCourtCase(selectedCourtCase)) {
        props.addCourtCase(selectedCourtCase)
      }
    }
    isFetchRunDone.current = false
  }

  const secondaryButtonCallback = () => {
    setModal('')
    setSelectedId(ID_DEFAULT)
    setSelectedCourtCase(DefaultCourtCaseSchema)
    setSelectedCourtCaseForReset(DefaultCourtCaseSchema)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedCourtCase(DefaultCourtCaseSchema)
    action === ACTION_UPDATE && setSelectedCourtCase(selectedCourtCaseForReset)
  }

  const courtCaseForm = () => (
    <CourtCaseForm
      selectedCourtCase={selectedCourtCase}
      setSelectedCourtCase={setSelectedCourtCase}
      courtCaseStatusList={courtCaseStatusList}
      isShowOneCourtCase={false}
      caseTypesList={caseTypesList}
      clientsList={clientsList}
    />
  )

  const addModal = () => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title="Add New CourtCase"
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, undefined)}
      primaryButtonDisabled={isAreTwoCourtCasesSame(selectedCourtCase, selectedCourtCaseForReset)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={courtCaseForm()}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
      resetButtonDisabled={isAreTwoCourtCasesSame(selectedCourtCase, selectedCourtCaseForReset)}
    />
  )

  const updateModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Update CourtCase"
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, selectedId)}
        primaryButtonDisabled={isAreTwoCourtCasesSame(selectedCourtCase, selectedCourtCaseForReset)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={courtCaseForm()}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
        resetButtonDisabled={isAreTwoCourtCasesSame(selectedCourtCase, selectedCourtCaseForReset)}
      />
    )
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Delete CourtCase"
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`Are you sure you want to delete CourtCase: '${selectedCourtCase.client?.name}, ${selectedCourtCase.case_type?.name}'?!?`}
      />
    )
  }

  const showModal = () =>
    modal === ACTION_ADD
      ? addModal()
      : modal === ACTION_UPDATE
      ? updateModal()
      : modal === ACTION_DELETE
      ? deleteModal()
      : null

  const courtCasesPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      CourtCases
    </Typography>
  )

  const courtCasesTable = () => (
    <CourtCaseTable
      isHistoryView={false}
      courtCasesList={clientId && selectedClient ? selectedClient.court_cases || [] : courtCasesList}
      historyCourtCasesList={[]}
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedCourtCase={setSelectedCourtCase}
      setSelectedCourtCaseForReset={setSelectedCourtCaseForReset}
      selectedClient={selectedClient}
    />
  )

  return clientId ? (
    <>
      {courtCasesTable()}
      {modal && showModal()}
    </>
  ) : (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {courtCasesPageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {courtCasesTable()}
        </Grid>
      </Grid>
      {modal && showModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CourtCases)
