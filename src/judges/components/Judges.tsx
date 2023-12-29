import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import JudgeForm from './JudgeForm'
import JudgeTable from './JudgeTable'
import { getStatusesList, GlobalState, Modal, StatusSchema, unmountPage } from '../../app'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_RESET,
  BUTTON_UPDATE,
} from '../../constants'
import { CourtSchema, getCourt, getCourts } from '../../courts'
import { addJudge, deleteJudge, editJudge, getJudges } from '../actions/judges.action'
import { JUDGES_UNMOUNT } from '../types/judges.action.types'
import { DefaultJudgeSchema, JudgeSchema } from '../types/judges.data.types'
import { isAreTwoJudgesSame, validateJudge } from '../utils/judges.utils'

const mapStateToProps = ({ judges, courts, statuses }: GlobalState) => {
  return {
    isCloseModal: judges.isCloseModal,
    judgesList: judges.judges,
    courtsList: courts.courts,
    selectedCourt: courts.selectedCourt,
    statusList: statuses.statuses,
  }
}

const mapDispatchToProps = {
  getJudges: () => getJudges(),
  addJudge: (judge: JudgeSchema) => addJudge(judge),
  editJudge: (id: number, judge: JudgeSchema) => editJudge(id, judge),
  deleteJudge: (id: number) => deleteJudge(id),
  unmountPage: () => unmountPage(JUDGES_UNMOUNT),
  getCourts: () => getCourts(),
  getCourt: (court_id: number) => getCourt(court_id),
  getStatusesList: () => getStatusesList(),
}

interface JudgesProps {
  isCloseModal: boolean
  judgesList: JudgeSchema[]
  getJudges: () => void
  addJudge: (judge: JudgeSchema) => void
  editJudge: (id: number, judge: JudgeSchema) => void
  deleteJudge: (id: number) => void
  unmountPage: () => void
  courtsList: CourtSchema[]
  getCourts: () => void
  getCourt: (court_id: number) => void
  courtId?: string
  selectedCourt?: CourtSchema
  statusList: StatusSchema<string>
  getStatusesList: () => void
}

const Judges = (props: JudgesProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { judgesList, courtsList, getJudges, getCourts } = props
  const { unmountPage } = props
  const { isCloseModal } = props
  const { courtId, selectedCourt, getCourt } = props
  const { statusList, getStatusesList } = props

  const [modal, setModal] = useState('')
  const [selectedId, setSelectedId] = useState<number>(-1)
  const [selectedJudge, setSelectedJudge] = useState<JudgeSchema>(DefaultJudgeSchema)
  const [selectedJudgeForReset, setSelectedJudgeForReset] = useState<JudgeSchema>(DefaultJudgeSchema)
  const [judgeStatusList, setJudgeStatusList] = useState<string[]>([])

  useEffect(() => {
    if (courtId) {
      setSelectedJudge({ ...DefaultJudgeSchema, court_id: Number(courtId) })
      if (!selectedCourt) {
        getCourt(Number(courtId))
      }
      if (courtsList.length === 0) {
        getCourts()
      }
    } else if ((judgesList.length === 0 || courtsList.length === 0) && !isFetchRunDone.current) {
      judgesList.length === 0 && getJudges()
      courtsList.length === 0 && getCourts()
      isFetchRunDone.current = true
    }
  }, [courtId, courtsList.length, getCourt, getCourts, getJudges, judgesList.length, selectedCourt])

  useEffect(() => {
    if (isCloseModal) {
      setModal('')
      setSelectedId(-1)
      setSelectedJudge(courtId ? { ...DefaultJudgeSchema, court_id: Number(courtId) } : DefaultJudgeSchema)
      setSelectedJudgeForReset(courtId ? { ...DefaultJudgeSchema, court_id: Number(courtId) } : DefaultJudgeSchema)
    }
  }, [isCloseModal, courtId])

  useEffect(() => {
    if (Object.keys(statusList).length === 0) {
      getStatusesList()
    } else {
      setJudgeStatusList(statusList.judge.all)
    }
  }, [statusList, getStatusesList])

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const primaryButtonCallback = (action: string, id?: number) => {
    if (id && action === ACTION_DELETE) {
      props.deleteJudge(id)
    } else if (id && action === ACTION_UPDATE) {
      if (validateJudge(selectedJudge)) {
        props.editJudge(id, selectedJudge)
      }
    } else {
      if (validateJudge(selectedJudge)) {
        props.addJudge(selectedJudge)
      }
    }
    isFetchRunDone.current = false
  }

  const secondaryButtonCallback = () => {
    setModal('')
    setSelectedId(-1)
    setSelectedJudge(courtId ? { ...DefaultJudgeSchema, court_id: Number(courtId) } : DefaultJudgeSchema)
    setSelectedJudgeForReset(courtId ? { ...DefaultJudgeSchema, court_id: Number(courtId) } : DefaultJudgeSchema)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedJudge(DefaultJudgeSchema)
    action === ACTION_UPDATE && setSelectedJudge(selectedJudgeForReset)
  }

  const judgeForm = () => (
    <JudgeForm
      selectedJudge={selectedJudge}
      courtsList={courtsList}
      setSelectedJudge={setSelectedJudge}
      judgeStatusList={judgeStatusList}
      isShowOneJudge={false}
    />
  )

  const addModal = () => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title="Add New Judge"
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, undefined)}
      primaryButtonDisabled={isAreTwoJudgesSame(selectedJudge, selectedJudgeForReset)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={judgeForm()}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
      resetButtonDisabled={isAreTwoJudgesSame(selectedJudge, selectedJudgeForReset)}
    />
  )

  const updateModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Update Judge"
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, selectedId)}
        primaryButtonDisabled={isAreTwoJudgesSame(selectedJudge, selectedJudgeForReset)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={judgeForm()}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
        resetButtonDisabled={isAreTwoJudgesSame(selectedJudge, selectedJudgeForReset)}
      />
    )
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Delete Judge"
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`Are you sure you want to delete Judge: '${selectedJudge.name}' at court '${selectedJudge.court?.name}'?!?`}
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

  const judgesPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      Judges
    </Typography>
  )

  const judgesTable = () => (
    <JudgeTable
      isHistoryView={false}
      judgesList={!(courtId && selectedCourt) ? judgesList : selectedCourt.judges || []}
      historyJudgesList={[]}
      selectedCourt={selectedCourt}
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedJudge={setSelectedJudge}
      setSelectedJudgeForReset={setSelectedJudgeForReset}
    />
  )

  return courtId ? (
    <>
      {judgesTable()}
      {modal && showModal()}
    </>
  ) : (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {judgesPageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {judgesTable()}
        </Grid>
      </Grid>
      {modal && showModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Judges)
