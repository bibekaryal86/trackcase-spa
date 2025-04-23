import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import {
  addModalComponent,
  deleteModalComponent,
  pageTitleComponent,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  updateModalComponent,
} from '@app/components/CommonComponents'
import { GlobalState, useGlobalDispatch } from '@app/store/redux'
import { useModal } from '@app/utils/app.hooks'
import { getNumber } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ACTION_TYPES, ActionTypes, COMPONENT_STATUS_NAME, INVALID_INPUT } from '@constants/index'
import { getCourts } from '@courts/actions/courts.action'
import { CourtSchema } from '@courts/types/courts.data.types'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import JudgeForm from './JudgeForm'
import JudgeTable from './JudgeTable'
import { getJudges, judgesAction } from '../actions/judges.action'
import {
  DefaultJudgeFormData,
  DefaultJudgeFormErrorData,
  JudgeBase,
  JudgeFormData,
  JudgeResponse,
  JudgeSchema,
} from '../types/judges.data.types'
import { isAreTwoJudgesSame, validateJudge } from '../utils/judges.utils'

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
  const dispatch = useGlobalDispatch()
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
      undefined,
      isAreTwoJudgesSame(formData, formDataReset),
      false,
      isAreTwoJudgesSame(formData, formDataReset),
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
      undefined,
      isAreTwoJudgesSame(formData, formDataReset),
      false,
      isAreTwoJudgesSame(formData, formDataReset),
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
      componentStatusList={refTypes.componentStatus}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.JUDGES)}
        </Grid>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
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
