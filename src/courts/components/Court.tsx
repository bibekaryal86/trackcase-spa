import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import CourtForm from './CourtForm'
import CourtTable from './CourtTable'
import {
  addNote,
  convertNotesToNotesList,
  deleteNote,
  editNote,
  getStatusesList,
  GlobalState,
  Link,
  Modal,
  Notes,
  StatusSchema,
  unmountPage,
} from '../../app'
import { BUTTON_CLOSE, NOTE_OBJECT_TYPES } from '../../constants'
import { Judges } from '../../judges'
import { editCourt, getCourt } from '../actions/courts.action'
import { COURTS_UNMOUNT } from '../types/courts.action.types'
import { CourtSchema, DefaultCourtSchema } from '../types/courts.data.types'
import { isAreTwoCourtsSame, validateCourt } from '../utils/courts.utils'

const mapStateToProps = ({ courts, statuses }: GlobalState) => {
  return {
    selectedCourt: courts.selectedCourt,
    statusList: statuses.statuses,
  }
}

const mapDispatchToProps = {
  getCourt: (courtId: number) => getCourt(courtId),
  editCourt: (courtId: number, court: CourtSchema) => editCourt(courtId, court),
  unmountPage: () => unmountPage(COURTS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => addNote(noteObjectType, noteObjectId, note),
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) =>
    editNote(noteObjectType, noteObjectId, note, noteId),
  deleteNote: (noteObjectType: string, noteId: number) => deleteNote(noteObjectType, noteId),
}

interface CourtProps {
  selectedCourt: CourtSchema
  getCourt: (courtId: number) => void
  editCourt: (id: number, court: CourtSchema) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => void
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) => void
  deleteNote: (noteObjectType: string, noteId: number) => void
}

const Court = (props: CourtProps): React.ReactElement => {
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { getCourt, editCourt } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props

  const [selectedCourt, setSelectedCourt] = useState<CourtSchema>(DefaultCourtSchema)
  const [selectedCourtForReset, setSelectedCourtForReset] = useState<CourtSchema>(DefaultCourtSchema)
  const [courtStatusList, setCourtStatusList] = useState<string[]>([])
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [isShowHistory, setIsShowHistory] = useState(false)

  useEffect(() => {
    if (id) {
      getCourt(Number(id))
    }
    // add selectedCourt.id to dependency array for note/history
  }, [id, getCourt, selectedCourt.id])

  useEffect(() => {
    setSelectedCourt(props.selectedCourt)
    setSelectedCourtForReset(props.selectedCourt)
  }, [props.selectedCourt])

  useEffect(() => {
    if (statusList.court.all.length === 0) {
      getStatusesList()
    } else {
      setCourtStatusList(statusList.court.all)
    }
  }, [statusList.court.all, getStatusesList])

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
        <Link text="View All Courts" navigateToPage="/courts/" color="primary" />
        {backToPage && (
          <Box sx={{ ml: 2 }}>
            <Link text={`Back to ${prevPage}`} navigateToPage={backToPage} color="primary" />
          </Box>
        )}
      </Box>
    )
  }

  const courtPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary">
      {id ? `Court: ${selectedCourt?.name}, ${selectedCourt?.state}` : 'Court'}
    </Typography>
  )

  const noCourt = () => (
    <Typography component="h1" variant="h6" color="error" gutterBottom>
      Court not selected! Nothing to display! Go to All Courts and select one!!!
    </Typography>
  )

  const updateAction = () => {
    if (validateCourt(selectedCourt)) {
      editCourt(Number(id), selectedCourt)
    }
  }

  const notesContent = () => (
    <Notes
      noteObjectType={NOTE_OBJECT_TYPES.COURT}
      noteObjectId={selectedCourt.id || -1}
      notesList={convertNotesToNotesList(selectedCourt.note_courts || [], selectedCourt.id || -1)}
      addNote={props.addNote}
      editNote={props.editNote}
      deleteNote={props.deleteNote}
    />
  )

  const historyContent = () => (
    <CourtTable isHistoryView={true} courtsList={[]} historyCourtsList={selectedCourt.history_courts || []} />
  )

  const notesModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpen={() => setIsShowNotes(false)}
        maxWidth="sm"
        title="Court Notes"
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
        maxWidth="md"
        title="Court Update History"
        primaryButtonText={BUTTON_CLOSE}
        primaryButtonCallback={() => setIsShowHistory(false)}
        content={historyContent()}
      />
    )
  }

  const courtButtons = () => {
    return (
      <>
        <Button disabled={isAreTwoCourtsSame(selectedCourt, selectedCourtForReset)} onClick={updateAction}>
          Update
        </Button>
        <Button
          disabled={isAreTwoCourtsSame(selectedCourt, selectedCourtForReset)}
          onClick={() => setSelectedCourt(selectedCourtForReset)}
        >
          Cancel
        </Button>
        <Button onClick={() => setIsShowNotes(true)}>View Court Notes [{selectedCourt.note_courts?.length}]</Button>
        <Button onClick={() => setIsShowHistory(true)}>
          View Court Update History [{selectedCourt.history_courts?.length}]
        </Button>
      </>
    )
  }

  const courtForm = () => (
    <CourtForm
      selectedCourt={selectedCourt}
      setSelectedCourt={setSelectedCourt}
      courtStatusList={courtStatusList}
      isShowOneCourt={true}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {inPageTopLinks()}
          {courtPageTitle()}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {noCourt()}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {courtForm()}
              {courtButtons()}
            </Grid>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              <Typography component="h1" variant="h6" color="primary">
                Judges in Court:
              </Typography>
              <Judges courtId={id} />
            </Grid>
            {isShowHistory && historyModal()}
            {isShowNotes && notesModal()}
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Court)
