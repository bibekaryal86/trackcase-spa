import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import CourtForm from './CourtForm'
import CourtTable from './CourtTable'
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
  ID_DEFAULT,
} from '../../constants'
import { addCourt, deleteCourt, editCourt, getCourts } from '../actions/courts.action'
import { COURTS_UNMOUNT } from '../types/courts.action.types'
import { CourtSchema, DefaultCourtSchema } from '../types/courts.data.types'
import { isAreTwoCourtsSame } from '../utils/courts.utils'

const mapStateToProps = ({ courts, statuses }: GlobalState) => {
  return {
    isCloseModal: courts.isCloseModal,
    courtsList: courts.courts,
    statusList: statuses.statuses,
  }
}

const mapDispatchToProps = {
  getCourts: () => getCourts(),
  addCourt: (court: CourtSchema) => addCourt(court),
  editCourt: (id: number, court: CourtSchema) => editCourt(id, court),
  deleteCourt: (id: number) => deleteCourt(id),
  unmountPage: () => unmountPage(COURTS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
}

interface CourtsProps {
  isCloseModal: boolean
  courtsList: CourtSchema[]
  getCourts: () => void
  addCourt: (court: CourtSchema) => void
  editCourt: (id: number, court: CourtSchema) => void
  deleteCourt: (id: number) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
}

const Courts = (props: CourtsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)

  const { courtsList, getCourts, addCourt, editCourt, deleteCourt } = props
  const { unmountPage } = props
  const { isCloseModal } = props
  const { statusList, getStatusesList } = props

  const [modal, setModal] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedCourt, setSelectedCourt] = useState<CourtSchema>(DefaultCourtSchema)
  const [selectedCourtForReset, setSelectedCourtForReset] = useState<CourtSchema>(DefaultCourtSchema)
  const [courtStatusList, setCourtStatusList] = useState<string[]>([])

  useEffect(() => {
    if (isForceFetch.current) {
      courtsList.length === 0 && getCourts()
      statusList.court.all.length === 0 && getStatusesList()
    }
    isForceFetch.current = false
  }, [courtsList.length, getCourts, statusList.court.all, getStatusesList])

  useEffect(() => {
    if (statusList.court.all.length > 0) {
      setCourtStatusList(statusList.court.all)
    }
  }, [statusList.court.all])

  useEffect(() => {
    if (isCloseModal) {
      secondaryButtonCallback()
    }
  }, [isCloseModal])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
      unmountPage()
    }
  }, [unmountPage])

  const primaryButtonCallback = (action: string, id?: number) => {
    isForceFetch.current = true
    if (id && action === ACTION_DELETE) {
      deleteCourt(id)
    } else if (id && action === ACTION_UPDATE) {
      editCourt(id, selectedCourt)
    } else {
      addCourt(selectedCourt)
    }
  }

  const secondaryButtonCallback = () => {
    setModal('')
    setSelectedId(ID_DEFAULT)
    setSelectedCourt(DefaultCourtSchema)
    setSelectedCourtForReset(DefaultCourtSchema)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedCourt(DefaultCourtSchema)
    action === ACTION_UPDATE && setSelectedCourt(selectedCourtForReset)
  }

  const courtForm = () => (
    <CourtForm
      selectedCourt={selectedCourt}
      setSelectedCourt={setSelectedCourt}
      courtStatusList={courtStatusList}
      isShowOneCourt={false}
    />
  )

  const addModal = () => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title="Add New Court"
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, undefined)}
      primaryButtonDisabled={isAreTwoCourtsSame(selectedCourt, selectedCourtForReset)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={courtForm()}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
      resetButtonDisabled={isAreTwoCourtsSame(selectedCourt, selectedCourtForReset)}
    />
  )

  const updateModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Update Court"
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, selectedId)}
        primaryButtonDisabled={isAreTwoCourtsSame(selectedCourt, selectedCourtForReset)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={courtForm()}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
        resetButtonDisabled={isAreTwoCourtsSame(selectedCourt, selectedCourtForReset)}
      />
    )
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title="Delete Court"
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={`Are you sure you want to delete Court: '${selectedCourt.name}'?!?`}
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

  const courtsPageTitle = () => (
    <Typography component="h1" variant="h6" color="primary" gutterBottom>
      Courts
    </Typography>
  )

  const courtsTable = () => (
    <CourtTable
      courtsList={courtsList}
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedCourt={setSelectedCourt}
      setSelectedCourtForReset={setSelectedCourtForReset}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {courtsPageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {courtsTable()}
        </Grid>
      </Grid>
      {modal && showModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Courts)
