import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import CourtCaseForm from './CourtCaseForm'
import CourtCaseTable from './CourtCaseTable'
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
import { ClientSchema, getClients } from '../../clients'
import { BUTTON_CLOSE, ID_DEFAULT, ID_LIST, NOTE_OBJECT_TYPES } from '../../constants'
import { CaseTypeSchema } from '../../ref_types'
import { getCaseTypes } from '../../ref_types/actions/case_types.action'
import { editCourtCase, getCourtCase } from '../actions/court_cases.action'
import { COURT_CASES_UNMOUNT } from '../types/court_cases.action.types'
import { CourtCaseSchema, DefaultCourtCaseSchema, HistoryCourtCaseSchema } from '../types/court_cases.data.types'
import { isAreTwoCourtCasesSame, validateCourtCase } from '../utils/court_cases.utils'

const mapStateToProps = ({ court_cases, statuses, caseTypes, clients }: GlobalState) => {
  return {
    selectedCourtCase: court_cases.selectedCourtCase,
    statusList: statuses.statuses,
    caseTypesList: caseTypes.case_types,
    clientsList: clients.clients,
  }
}

const mapDispatchToProps = {
  getCourtCase: (courtCaseId: number) => getCourtCase(courtCaseId),
  editCourtCase: (courtCaseId: number, courtCase: CourtCaseSchema) => editCourtCase(courtCaseId, courtCase),
  unmountPage: () => unmountPage(COURT_CASES_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => addNote(noteObjectType, noteObjectId, note),
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) =>
    editNote(noteObjectType, noteObjectId, note, noteId),
  deleteNote: (noteObjectType: string, noteId: number) => deleteNote(noteObjectType, noteId),
  getCaseTypes: () => getCaseTypes(),
  getClients: () => getClients(),
}

interface CourtCaseProps {
  selectedCourtCase: CourtCaseSchema
  getCourtCase: (courtCaseId: number) => void
  editCourtCase: (id: number, courtCase: CourtCaseSchema) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => void
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) => void
  deleteNote: (noteObjectType: string, noteId: number) => void
  caseTypesList: CaseTypeSchema[]
  getCaseTypes: () => void
  clientsList: ClientSchema[]
  getClients: () => void
}

const CourtCase = (props: CourtCaseProps): React.ReactElement => {
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { getCourtCase, editCourtCase } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props
  const { caseTypesList, getCaseTypes, clientsList, getClients } = props

  const [selectedCourtCase, setSelectedCourtCase] = useState<CourtCaseSchema>(DefaultCourtCaseSchema)
  const [selectedCourtCaseForReset, setSelectedCourtCaseForReset] = useState<CourtCaseSchema>(DefaultCourtCaseSchema)
  const [courtCaseStatusList, setCourtCaseStatusList] = useState<string[]>([])
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [isShowHistory, setIsShowHistory] = useState(false)

  useEffect(() => {
    if (id) {
      getCourtCase(getNumber(id))
    }
    // add selectedCourtCase.id to dependency array for note/history
  }, [id, getCourtCase, selectedCourtCase.id])

  useEffect(() => {
    if (caseTypesList.length === 0) {
      getCaseTypes()
    }
    if (clientsList.length === 0) {
      getClients()
    }
  }, [caseTypesList, getCaseTypes, clientsList, getClients])

  useEffect(() => {
    if (statusList.court_case.all.length === 0) {
      getStatusesList()
    } else {
      setCourtCaseStatusList(statusList.court_case.all)
    }
  }, [statusList.court_case.all, getStatusesList])

  useEffect(() => {
    setSelectedCourtCase(props.selectedCourtCase)
    setSelectedCourtCaseForReset(props.selectedCourtCase)
  }, [props.selectedCourtCase])

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
        <Link text="View All CourtCases" navigateToPage="/court_cases/" color="primary" />
        {backToPage && (
          <Box sx={{ ml: 2 }}>
            <Link text={`Back to ${prevPage}`} navigateToPage={backToPage} color="primary" />
          </Box>
        )}
      </Box>
    )
  }

  const courtCasePageTitle = () => (
    <Typography component="h1" variant="h6" color="primary">
      {id ? `CourtCase: ${selectedCourtCase.client?.name}, ${selectedCourtCase.case_type?.name}` : 'CourtCase'}
    </Typography>
  )

  const noCourtCase = () => (
    <Typography component="h1" variant="h6" color="error" gutterBottom>
      CourtCase not selected! Nothing to display! Go to All CourtCases and select one!!!
    </Typography>
  )

  const updateAction = () => {
    if (validateCourtCase(selectedCourtCase)) {
      editCourtCase(getNumber(id), selectedCourtCase)
    }
  }

  const notesContent = () => (
    <Notes
      noteObjectType={NOTE_OBJECT_TYPES.COURT_CASE}
      noteObjectId={selectedCourtCase.id || ID_DEFAULT}
      notesList={convertNotesToNotesList(selectedCourtCase.note_court_cases || [], selectedCourtCase.id || ID_LIST)}
      addNote={props.addNote}
      editNote={props.editNote}
      deleteNote={props.deleteNote}
    />
  )

  const historyContent = () => {
    const caseTypesMap = new Map(caseTypesList.map((caseType) => [caseType.id, caseType]))
    const clientsMap = new Map(clientsList.map((client) => [client.id, client]))
    const historyCourtCases = selectedCourtCase.history_court_cases
      ? JSON.parse(JSON.stringify(selectedCourtCase.history_court_cases))
      : []
    historyCourtCases.forEach((x: HistoryCourtCaseSchema) => {
      const matchingCaseType = caseTypesMap.get(x.case_type_id)
      if (matchingCaseType) {
        x.case_type = matchingCaseType
      }
      const matchingClient = clientsMap.get(x.client_id)
      if (matchingClient) {
        x.client = matchingClient
      }
    })
    return <CourtCaseTable isHistoryView={true} courtCasesList={[]} historyCourtCasesList={historyCourtCases || []} />
  }

  const notesModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpen={() => setIsShowNotes(false)}
        maxWidth="sm"
        title="CourtCase Notes"
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
        title="CourtCase Update History"
        primaryButtonText={BUTTON_CLOSE}
        primaryButtonCallback={() => setIsShowHistory(false)}
        content={historyContent()}
      />
    )
  }

  const courtCaseButtons = () => {
    return (
      <>
        <Button disabled={isAreTwoCourtCasesSame(selectedCourtCase, selectedCourtCaseForReset)} onClick={updateAction}>
          Update
        </Button>
        <Button
          disabled={isAreTwoCourtCasesSame(selectedCourtCase, selectedCourtCaseForReset)}
          onClick={() => setSelectedCourtCase(selectedCourtCaseForReset)}
        >
          Cancel
        </Button>
        <Button onClick={() => setIsShowNotes(true)}>View CourtCase Notes [{selectedCourtCase.note_court_cases?.length}]</Button>
        <Button onClick={() => setIsShowHistory(true)}>
          View CourtCase Update History [{selectedCourtCase.history_court_cases?.length}]
        </Button>
      </>
    )
  }

  const courtCaseForm = () => (
    <CourtCaseForm
      selectedCourtCase={selectedCourtCase}
      setSelectedCourtCase={setSelectedCourtCase}
      courtCaseStatusList={courtCaseStatusList}
      isShowOneCourtCase={true}
      caseTypesList={caseTypesList}
      clientsList={clientsList}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {inPageTopLinks()}
          {courtCasePageTitle()}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {noCourtCase()}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {courtCaseForm()}
              {courtCaseButtons()}
            </Grid>
            {isShowHistory && historyModal()}
            {isShowNotes && notesModal()}
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CourtCase)
