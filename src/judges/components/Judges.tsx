import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import JudgeForm from './JudgeForm'
import JudgeTable from './JudgeTable'
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
import { CourtSchema, getCourt, getCourts } from '../../courts'
import { addJudge, deleteJudge, editJudge, getJudges } from '../actions/judges.action'
import { JUDGES_UNMOUNT } from '../types/judges.action.types'
import { DefaultJudgeSchema, JudgeSchema } from '../types/judges.data.types'
import { isAreTwoJudgesSame, validateJudge } from '../utils/judges.utils'

const mapStateToProps = ({ judges, statuses, courts }: GlobalState) => {
  return {
    isCloseModal: judges.isCloseModal,
    judgesList: judges.judges,
    statusList: statuses.statuses,
    courtsList: courts.courts,
    selectedCourt: courts.selectedCourt,
  }
}

const mapDispatchToProps = {
  getJudges: () => getJudges(),
  addJudge: (judge: JudgeSchema) => addJudge(judge),
  editJudge: (id: number, judge: JudgeSchema) => editJudge(id, judge),
  deleteJudge: (id: number) => deleteJudge(id),
  unmountPage: () => unmountPage(JUDGES_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getCourts: () => getCourts(),
  getCourt: (courtId: number) => getCourt(courtId),
}

interface JudgesProps {
  isCloseModal: boolean
  judgesList: JudgeSchema[]
  getJudges: () => void
  addJudge: (judge: JudgeSchema) => void
  editJudge: (id: number, judge: JudgeSchema) => void
  deleteJudge: (id: number) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  courtsList: CourtSchema[]
  getCourts: () => void
  courtId?: string
  selectedCourt?: CourtSchema
  getCourt: (courtId: number) => void
}

const Judges = (props: JudgesProps): React.ReactElement => {
  // prevent infinite fetch if api returns empty
  const isFetchRunDone = useRef(false)
  const { judgesList, courtsList, getJudges, getCourts } = props
  const { unmountPage } = props
  const { isCloseModal } = props
  const { statusList, getStatusesList } = props
  const { courtId, selectedCourt, getCourt } = props

  const [modal, setModal] = useState('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedJudge, setSelectedJudge] = useState<JudgeSchema>(DefaultJudgeSchema)
  const [selectedJudgeForReset, setSelectedJudgeForReset] = useState<JudgeSchema>(DefaultJudgeSchema)
  const [judgeStatusList, setJudgeStatusList] = useState<string[]>([])

  useEffect(() => {
    if (courtId) {
      setSelectedJudge({ ...DefaultJudgeSchema, court_id: getNumber(courtId) })
      if (!selectedCourt) {
        getCourt(getNumber(courtId))
      }
    }
  }, [courtId, selectedCourt, getCourt, courtsList.length, getCourts, judgesList.length, getJudges])

  useEffect(() => {
    if (!isFetchRunDone.current) {
      judgesList.length === 0 && getJudges()
      courtsList.length === 0 && getCourts()
      statusList.court_case.all.length === 0 && getStatusesList()
    }
    isFetchRunDone.current = true
  }, [judgesList.length, getJudges, statusList.court_case.all, getStatusesList, courtsList.length, getCourts])

  useEffect(() => {
    if (statusList.judge.all.length > 0) {
      setJudgeStatusList(statusList.judge.all)
    }
  }, [statusList.judge.all])

  useEffect(() => {
    if (isCloseModal) {
      setModal('')
      setSelectedId(ID_DEFAULT)
      setSelectedJudge(courtId ? { ...DefaultJudgeSchema, court_id: getNumber(courtId) } : DefaultJudgeSchema)
      setSelectedJudgeForReset(courtId ? { ...DefaultJudgeSchema, court_id: getNumber(courtId) } : DefaultJudgeSchema)
    }
  }, [isCloseModal, courtId])

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
    setSelectedId(ID_DEFAULT)
    setSelectedJudge(courtId ? { ...DefaultJudgeSchema, court_id: getNumber(courtId) } : DefaultJudgeSchema)
    setSelectedJudgeForReset(courtId ? { ...DefaultJudgeSchema, court_id: getNumber(courtId) } : DefaultJudgeSchema)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedJudge(DefaultJudgeSchema)
    action === ACTION_UPDATE && setSelectedJudge(selectedJudgeForReset)
  }

  const judgeForm = () => (
    <JudgeForm
      selectedJudge={selectedJudge}
      setSelectedJudge={setSelectedJudge}
      judgeStatusList={judgeStatusList}
      isShowOneJudge={false}
      courtsList={courtsList}
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
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedJudge={setSelectedJudge}
      setSelectedJudgeForReset={setSelectedJudgeForReset}
      selectedCourt={selectedCourt}
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
