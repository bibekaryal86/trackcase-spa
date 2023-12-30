import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import JudgeForm from './JudgeForm'
import JudgeTable from './JudgeTable'
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
import { CourtSchema, getCourts } from '../../courts'
import { editJudge, getJudge } from '../actions/judges.action'
import { JUDGES_UNMOUNT } from '../types/judges.action.types'
import { DefaultJudgeSchema, HistoryJudgeSchema, JudgeSchema } from '../types/judges.data.types'
import { isAreTwoJudgesSame, validateJudge } from '../utils/judges.utils'

const mapStateToProps = ({ judges, courts, statuses }: GlobalState) => {
  return {
    selectedJudge: judges.selectedJudge,
    statusList: statuses.statuses,
    courtsList: courts.courts,
  }
}

const mapDispatchToProps = {
  getJudge: (judgeId: number) => getJudge(judgeId),
  getCourts: () => getCourts(),
  editJudge: (judgeId: number, judge: JudgeSchema) => editJudge(judgeId, judge),
  unmountPage: () => unmountPage(JUDGES_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => addNote(noteObjectType, noteObjectId, note),
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) =>
    editNote(noteObjectType, noteObjectId, note, noteId),
  deleteNote: (noteObjectType: string, noteId: number) => deleteNote(noteObjectType, noteId),
}

interface JudgeProps {
  selectedJudge: JudgeSchema
  courtsList: CourtSchema[]
  getJudge: (judgeId: number) => void
  editJudge: (judgeId: number, judge: JudgeSchema) => void
  getCourts: () => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  addNote: (noteObjectType: string, noteObjectId: number, note: string) => void
  editNote: (noteObjectType: string, noteObjectId: number, note: string, noteId: number) => void
  deleteNote: (noteObjectType: string, noteId: number) => void
}

const Judge = (props: JudgeProps): React.ReactElement => {
  const { id } = useParams()
  const [searchQueryParams] = useSearchParams()
  const { getJudge, editJudge } = props
  const { courtsList, getCourts } = props
  const { statusList, getStatusesList } = props
  const { unmountPage } = props

  const [selectedJudge, setSelectedJudge] = useState<JudgeSchema>(DefaultJudgeSchema)
  const [selectedJudgeForReset, setSelectedJudgeForReset] = useState<JudgeSchema>(DefaultJudgeSchema)
  const [judgeStatusList, setJudgeStatusList] = useState<string[]>([])
  const [isShowNotes, setIsShowNotes] = useState(false)
  const [isShowHistory, setIsShowHistory] = useState(false)

  useEffect(() => {
    if (id) {
      getJudge(Number(id))
    }
    // add selectedJudge.id to dependency array for note/history
  }, [id, getJudge, selectedJudge.id])

  useEffect(() => {
    if (courtsList.length === 0) {
      getCourts()
    }
  }, [courtsList, getCourts])

  useEffect(() => {
    setSelectedJudge(props.selectedJudge)
    setSelectedJudgeForReset(props.selectedJudge)
  }, [props.selectedJudge])

  useEffect(() => {
    if (statusList.judge.all.length === 0) {
      getStatusesList()
    } else {
      setJudgeStatusList(statusList.judge.all)
    }
  }, [statusList.judge.all, getStatusesList])

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
        <Link text="View All Judges" navigateToPage="/judges/" color="primary" />
        {backToPage && (
          <Box sx={{ ml: 2 }}>
            <Link text={`Back to ${prevPage}`} navigateToPage={backToPage} color="primary" />
          </Box>
        )}
      </Box>
    )
  }

  const judgePageTitle = () => (
    <Typography component="h1" variant="h6" color="primary">
      {id ? `Judge: ${selectedJudge?.name}` : 'Court'}
    </Typography>
  )

  const noJudge = () => (
    <Typography component="h1" variant="h6" color="error" gutterBottom>
      Judge not selected! Nothing to display! Go to All Judges and select one!!!
    </Typography>
  )

  const updateAction = () => {
    if (validateJudge(selectedJudge)) {
      editJudge(Number(id), selectedJudge)
    }
  }

  const notesContent = () => (
    <Notes
      noteObjectType={NOTE_OBJECT_TYPES.JUDGE}
      noteObjectId={selectedJudge.id || -1}
      notesList={convertNotesToNotesList(selectedJudge.note_judges || [], selectedJudge.id || -1)}
      addNote={props.addNote}
      editNote={props.editNote}
      deleteNote={props.deleteNote}
    />
  )

  const historyContent = () => {
    const courtMap = new Map(courtsList.map((court) => [court.id, court]))
    const historyJudges = selectedJudge.history_judges ? JSON.parse(JSON.stringify(selectedJudge.history_judges)) : []
    historyJudges.forEach((judge: HistoryJudgeSchema) => {
      const matchingCourt = courtMap.get(judge.court_id)
      if (matchingCourt) {
        judge.court = matchingCourt
      }
    })
    return <JudgeTable isHistoryView={true} judgesList={[]} historyJudgesList={historyJudges} />
  }

  const notesModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpen={() => setIsShowNotes(false)}
        maxWidth="sm"
        title="Judge Notes"
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
        title="Judge Update History"
        primaryButtonText={BUTTON_CLOSE}
        primaryButtonCallback={() => setIsShowHistory(false)}
        content={historyContent()}
      />
    )
  }

  const judgeButtons = () => {
    return (
      <>
        <Button disabled={isAreTwoJudgesSame(selectedJudge, selectedJudgeForReset)} onClick={updateAction}>
          Update
        </Button>
        <Button
          disabled={isAreTwoJudgesSame(selectedJudge, selectedJudgeForReset)}
          onClick={() => setSelectedJudge(selectedJudgeForReset)}
        >
          Cancel
        </Button>
        <Button onClick={() => setIsShowNotes(true)}>View Judge Notes [{selectedJudge.note_judges?.length}]</Button>
        <Button onClick={() => setIsShowHistory(true)}>
          View Judge Update History [{selectedJudge.history_judges?.length}]
        </Button>
      </>
    )
  }

  const judgeForm = () => (
    <JudgeForm
      selectedJudge={selectedJudge}
      setSelectedJudge={setSelectedJudge}
      judgeStatusList={judgeStatusList}
      isShowOneJudge={true}
      courtsList={courtsList}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {inPageTopLinks()}
          {judgePageTitle()}
        </Grid>
        {!id ? (
          <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
            {noJudge()}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
              {judgeForm()}
              {judgeButtons()}
            </Grid>
            {isShowHistory && historyModal()}
            {isShowNotes && notesModal()}
          </>
        )}
      </Grid>
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Judge)
