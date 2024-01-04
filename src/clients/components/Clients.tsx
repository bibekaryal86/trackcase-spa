import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import ClientForm from './ClientForm'
import ClientTable from './ClientTable'
import { getNumber, getStatusesList, GlobalState, Modal, StatusSchema, unmountPage } from '../../app'
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
import { getJudge, getJudges, JudgeSchema } from '../../judges'
import { addClient, deleteClient, editClient, getClients } from '../actions/clients.action'
import { CLIENTS_UNMOUNT } from '../types/clients.action.types'
import { ClientSchema, DefaultClientSchema } from '../types/clients.data.types'
import { isAreTwoClientsSame, validateClient } from '../utils/clients.utils'

const mapStateToProps = ({ clients, statuses, judges }: GlobalState) => {
  return {
    isCloseModal: clients.isCloseModal,
    clientsList: clients.clients,
    statusList: statuses.statuses,
    judgesList: judges.judges,
    selectedJudge: judges.selectedJudge,
  }
}

const mapDispatchToProps = {
  getClients: () => getClients(),
  addClient: (client: ClientSchema) => addClient(client),
  editClient: (id: number, client: ClientSchema) => editClient(id, client),
  deleteClient: (id: number) => deleteClient(id),
  unmountPage: () => unmountPage(CLIENTS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getJudges: () => getJudges(),
  getJudge: (judgeId: number) => getJudge(judgeId),
}

interface ClientsProps {
  isCloseModal: boolean
  clientsList: ClientSchema[]
  getClients: () => void
  addClient: (client: ClientSchema) => void
  editClient: (id: number, client: ClientSchema) => void
  deleteClient: (id: number) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  judgesList: JudgeSchema[]
  getJudges: () => void
  judgeId?: string
  selectedJudge?: JudgeSchema
  getJudge: (judgeId: number) => void
}

const Clients = (props: ClientsProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { clientsList, getClients, judgesList, getJudges } = props
  const { unmountPage } = props
  const { isCloseModal } = props
  const { statusList, getStatusesList } = props
  const { judgeId, selectedJudge, getJudge } = props

  const [modal, setModal] = useState('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedClient, setSelectedClient] = useState<ClientSchema>(DefaultClientSchema)
  const [selectedClientForReset, setSelectedClientForReset] = useState<ClientSchema>(DefaultClientSchema)
  const [clientStatusList, setClientStatusList] = useState<string[]>([])

  useEffect(() => {
    if (judgeId) {
      setSelectedClient({ ...DefaultClientSchema, judge_id: getNumber(judgeId) })
      if (!selectedJudge) {
        getJudge(getNumber(judgeId))
      }
    }
  }, [judgeId, selectedJudge, getJudge])

  useEffect(() => {
    if (!isFetchRunDone.current) {
      clientsList.length === 0 && getClients()
      judgesList.length === 0 && getJudges()
      statusList.court_case.all.length === 0 && getStatusesList()
    }
    isFetchRunDone.current = true
  }, [clientsList.length, getClients, statusList.court_case.all, getStatusesList, judgesList.length, getJudges])

  useEffect(() => {
    if (statusList.client.all.length > 0) {
      setClientStatusList(statusList.client.all)
    }
  }, [statusList.client.all])

  useEffect(() => {
    if (isCloseModal) {
      secondaryButtonCallback()
    }
  }, [isCloseModal])

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const primaryButtonCallback = (action: string, id?: number) => {
    if (id && action === ACTION_DELETE) {
      props.deleteClient(id)
    } else if (id && action === ACTION_UPDATE) {
      if (validateClient(selectedClient)) {
        props.editClient(id, selectedClient)
      }
    } else {
      if (validateClient(selectedClient)) {
        props.addClient(selectedClient)
      }
    }
    isFetchRunDone.current = false
  }

  const secondaryButtonCallback = () => {
    setModal('')
    setSelectedId(ID_DEFAULT)
    setSelectedClient(DefaultClientSchema)
    setSelectedClientForReset(DefaultClientSchema)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedClient(DefaultClientSchema)
    action === ACTION_UPDATE && setSelectedClient(selectedClientForReset)
  }

  const clientForm = () => (
    <ClientForm
      selectedClient={selectedClient}
      setSelectedClient={setSelectedClient}
      clientStatusList={clientStatusList}
      isShowOneClient={false}
      judgesList={judgesList}
    />
  )

  const addModal = () => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title="Add New Client"
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, undefined)}
      primaryButtonDisabled={isAreTwoClientsSame(selectedClient, selectedClientForReset)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={clientForm()}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
      resetButtonDisabled={isAreTwoClientsSame(selectedClient, selectedClientForReset)}
    />
  )

  const updateModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Update Client"
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, selectedId)}
        primaryButtonDisabled={isAreTwoClientsSame(selectedClient, selectedClientForReset)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={clientForm()}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
        resetButtonDisabled={isAreTwoClientsSame(selectedClient, selectedClientForReset)}
      />
    )
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Delete Client"
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`Are you sure you want to delete Client: '${selectedClient.name}'?!?`}
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

  const clientsPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      Clients
    </Typography>
  )

  const clientsTable = () => (
    <ClientTable
      isHistoryView={false}
      clientsList={!(judgeId && selectedJudge) ? clientsList : selectedJudge?.clients || []}
      historyClientsList={[]}
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedClient={setSelectedClient}
      setSelectedClientForReset={setSelectedClientForReset}
      selectedJudge={selectedJudge}
    />
  )

  return judgeId ? (
    <>
      {clientsTable()}
      {modal && showModal()}
    </>
  ) : (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {clientsPageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {clientsTable()}
        </Grid>
      </Grid>
      {modal && showModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients)
