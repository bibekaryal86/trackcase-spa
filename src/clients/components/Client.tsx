import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import ClientForm from './ClientForm'
import ClientTable from './ClientTable'
import {
  addNote,
  convertNotesToNotesList,
  deleteNote,
  editNote,
  getNumber,
  getStatusesList,
  GlobalState,
  Link,
  Modal,
  Notes,
  StatusSchema,
  unmountPage,
} from '../../app'
import { CourtCases } from '../../cases'
import { BUTTON_CLOSE, ID_DEFAULT, ID_LIST, NOTE_OBJECT_TYPES } from '../../constants'
import { getJudges, JudgeSchema } from '../../judges'
import { editClient, getClient } from '../actions/clients.action'
import { CLIENTS_UNMOUNT } from '../types/clients.action.types'
import { ClientSchema, DefaultClientSchema, HistoryClientSchema } from '../types/clients.data.types'
import { isAreTwoClientsSame } from '../utils/clients.utils'

const mapStateToProps = ({ clients, statuses, judges }: GlobalState) => {
  return {
    isForceFetch: clients.isForceFetch,
    selectedClient: clients.selectedClient,
    statusList: statuses.statuses,
    judgesList: judges.judges,
  }
}

const mapDispatchToProps = {
  getClient: (clientId: number) => getClient(clientId),
  editClient: (clientId: number, client: ClientSchema) => editClient(clientId, client),
  unmountPage: () => unmountPage(CLIENTS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => addNote(noteObjectType, noteObjectId, note),
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) =>
    editNote(noteObjectType, noteObjectId, note, noteId),
  deleteNote: (noteObjectType: string, noteId: number) => deleteNote(noteObjectType, noteId),
  getJudges: () => getJudges(),
}

interface ClientProps {
  isForceFetch: boolean
  selectedClient: ClientSchema
  getClient: (clientId: number) => void
  editClient: (id: number, client: ClientSchema) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => void
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) => void
  deleteNote: (noteObjectType: string, noteId: number) => void
  judgesList: JudgeSchema[]
  getJudges: () => void
}

const Client = (props: ClientProps): React.ReactElement => {
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { isForceFetch } = props
  const { getClient, editClient } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props
  const { judgesList, getJudges } = props

  const [selectedClient, setSelectedClient] = useState<ClientSchema>(DefaultClientSchema)
  const [selectedClientForReset, setSelectedClientForReset] = useState<ClientSchema>(DefaultClientSchema)
  const [clientStatusList, setClientStatusList] = useState<string[]>([])
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [isShowHistory, setIsShowHistory] = useState(false)

  useEffect(() => {
    if (id) {
      getClient(getNumber(id))
    }
    // add selectedClient.id to dependency array for note/history
  }, [id, getClient, selectedClient.id])

  useEffect(() => {
    if (isForceFetch) {
      statusList.court_case.all.length === 0 && getStatusesList()
      judgesList.length === 0 && getJudges()
    }
  }, [isForceFetch, statusList.court_case.all, getStatusesList, judgesList.length, getJudges])

  useEffect(() => {
    if (statusList.court.all.length > 0) {
      setClientStatusList(statusList.court.all)
    }
  }, [statusList.court.all])

  useEffect(() => {
    setSelectedClient(props.selectedClient)
    setSelectedClientForReset(props.selectedClient)
  }, [props.selectedClient])

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const inPageTopLinks = () => {
    const backToPage = searchQueryParams.get('backTo') || ''
    const prevPage = searchQueryParams.get('prevPage') || ''
    return (
      <Box sx={{ display: 'flex' }}>
        <Link text="View All Clients" navigateToPage="/clients/" color="primary" />
        {backToPage && (
          <Box sx={{ ml: 2 }}>
            <Link text={`Back to ${prevPage}`} navigateToPage={backToPage} color="primary" />
          </Box>
        )}
      </Box>
    )
  }

  const clientPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary">
      {id ? `Client: ${selectedClient.name}` : 'Client'}
    </Typography>
  )

  const noClient = () => (
    <Typography component="h1" variant="h6" color="error" gutterBottom>
      Client not selected! Nothing to display! Go to All Clients and select one!!!
    </Typography>
  )

  const updateAction = () => {
    editClient(getNumber(id), selectedClient)
  }

  const notesContent = () => (
    <Notes
      noteObjectType={NOTE_OBJECT_TYPES.CLIENT}
      noteObjectId={selectedClient.id || ID_DEFAULT}
      notesList={convertNotesToNotesList(selectedClient.noteClients || [], selectedClient.id || ID_LIST)}
      addNote={props.addNote}
      editNote={props.editNote}
      deleteNote={props.deleteNote}
    />
  )

  const historyContent = () => {
    const judgeMap = new Map(judgesList.map((judge) => [judge.id, judge]))
    const historyClients = selectedClient.historyClients
      ? JSON.parse(JSON.stringify(selectedClient.historyClients))
      : []
    historyClients.forEach((x: HistoryClientSchema) => {
      const matchingJudge = judgeMap.get(x.judgeId)
      if (matchingJudge) {
        x.judge = matchingJudge
      }
    })
    return <ClientTable isHistoryView={true} clientsList={[]} historyClientsList={historyClients || []} />
  }

  const notesModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpen={() => setIsShowNotes(false)}
        maxWidth="sm"
        title="Client Notes"
        primaryButtonText={BUTTON_CLOSE}
        primaryButtonCallback={() => setIsShowNotes(false)}
        content={notesContent()}
      />
    )
  }

  const historyModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpen={() => setIsShowHistory(false)}
        maxWidth="lg"
        title="Client Update History"
        primaryButtonText={BUTTON_CLOSE}
        primaryButtonCallback={() => setIsShowHistory(false)}
        content={historyContent()}
      />
    )
  }

  const clientButtons = () => {
    return (
      <>
        <Button disabled={isAreTwoClientsSame(selectedClient, selectedClientForReset)} onClick={updateAction}>
          Update
        </Button>
        <Button
          disabled={isAreTwoClientsSame(selectedClient, selectedClientForReset)}
          onClick={() => setSelectedClient(selectedClientForReset)}
        >
          Cancel
        </Button>
        <Button onClick={() => setIsShowNotes(true)}>View Client Notes [{selectedClient.noteClients?.length}]</Button>
        <Button onClick={() => setIsShowHistory(true)}>
          View Client Update History [{selectedClient.historyClients?.length}]
        </Button>
      </>
    )
  }

  const clientForm = () => (
    <ClientForm
      selectedClient={selectedClient}
      setSelectedClient={setSelectedClient}
      clientStatusList={clientStatusList}
      isShowOneClient={true}
      judgesList={judgesList}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {inPageTopLinks()}
          {clientPageTitle()}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {noClient()}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {clientForm()}
              {clientButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Typography component="h1" variant="h6" color="primary">
                Court Cases Assigned to Client:
              </Typography>
              <CourtCases clientId={id} />
            </Grid>
            {isShowHistory && historyModal()}
            {isShowNotes && notesModal()}
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Client)
