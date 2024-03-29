import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import JudgeForm from './JudgeForm'
import JudgeTable from './JudgeTable'
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
import { ACTION_TYPES, ActionTypes, COMPONENT_STATUS_NAME, INVALID_INPUT } from '../../constants'
import { CourtSchema, getCourts } from '../../courts'
import { getRefTypes, RefTypesState } from '../../types'
import { getJudges, judgesAction } from '../actions/judges.action'
import {
  DefaultJudgeFormData,
  DefaultJudgeFormErrorData,
  JudgeBase,
  JudgeFormData,
  JudgeResponse,
  JudgeSchema,
} from '../types/judges.data.types'
import { validateJudge } from '../utils/judges.utils'

const mapStateToProps = ({ refTypes, judges, courts }: GlobalState) => {
  return {
    refTypes: refTypes,
    judgesList: judges.judges,
    courtsList: courts.courts,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getJudges: (requestMetadata: Partial<FetchRequestMetadata>) => getJudges(requestMetadata),
  getCourts: () => getCourts(),
}

interface JudgesProps {
  judgesList: JudgeSchema[]
  getJudges: (requestMetadata: Partial<FetchRequestMetadata>) => void
  refTypes: RefTypesState
  getRefTypes: () => void
  courtsList: CourtSchema[]
  getCourts: () => void
}

const Judges = (props: JudgesProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { judgesList, getJudges } = props
  const { refTypes, getRefTypes } = props
  const { courtsList, getCourts } = props

  const [formData, setFormData] = useState(DefaultJudgeFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultJudgeFormData)
  const [formErrors, setFormErrors] = useState(DefaultJudgeFormErrorData)

  const judgeStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.JUDGES)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      judgesList.length === 0 && getJudges({})
      refTypes.componentStatus.length === 0 && getRefTypes()
      courtsList.length === 0 && getCourts()
    }
  }, [courtsList.length, getCourts, getJudges, getRefTypes, judgesList.length, refTypes.componentStatus.length])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const getJudgesWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getJudges(requestMetadata)
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateJudge(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let judgeResponse: JudgeResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (action === ACTION_TYPES.CREATE) {
      const judgesRequest: JudgeBase = { ...formData }
      judgeResponse = await judgesAction({ action, judgesRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const judgesRequest: JudgeBase = { ...formData }
      judgeResponse = await judgesAction({
        action: action,
        judgesRequest: judgesRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (judgeResponse && !judgeResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultJudgeFormData,
        DefaultJudgeFormErrorData,
      )
      isForceFetch.current = true
      judgesList.length === 0 && getJudges({})
    }
  }

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <JudgeForm
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        judgeStatusList={judgeStatusList()}
        isShowOneJudge={false}
        courtsList={courtsList}
      />
    </Box>
  )

  const addModal = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.JUDGES,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultJudgeFormData,
      DefaultJudgeFormErrorData,
      formDataReset,
    )

  const updateModal = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.JUDGES,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultJudgeFormData,
      DefaultJudgeFormErrorData,
      formDataReset,
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } JUDGE: ${formData.name}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.JUDGES,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultJudgeFormData,
      DefaultJudgeFormErrorData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: JudgeFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.JUDGES,
      formDataModal,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const judgesTable = () => (
    <JudgeTable
      judgesList={judgesList}
      actionButtons={actionButtons}
      addModalState={addModalState}
      softDeleteCallback={getJudgesWithMetadata}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.JUDGES)}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {judgesTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Judges)
