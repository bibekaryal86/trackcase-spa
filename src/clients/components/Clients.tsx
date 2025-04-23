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
import { getJudges } from '@judges/actions/judges.action'
import { JudgeSchema } from '@judges/types/judges.data.types'
import { getRefTypes } from '@ref_types/actions/refTypes.action'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import ClientForm from './ClientForm'
import ClientTable from './ClientTable'
import { clientsAction, getClients } from '../actions/clients.action'
import {
  ClientBase,
  ClientFormData,
  ClientResponse,
  ClientSchema,
  DefaultClientFormData,
  DefaultClientFormErrorData,
} from '../types/clients.data.types'
import { isAreTwoClientsSame, validateClient } from '../utils/clients.utils'

const mapStateToProps = ({ refTypes, clients, judges }: GlobalState) => {
  return {
    refTypes: refTypes,
    clientsList: clients.clients,
    judgesList: judges.judges,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getClients: (requestMetadata: Partial<FetchRequestMetadata>) => getClients(requestMetadata),
  getJudges: () => getJudges(),
}

interface ClientsProps {
  clientsList: ClientSchema[]
  getClients: (requestMetadata: Partial<FetchRequestMetadata>) => void
  refTypes: RefTypesState
  getRefTypes: () => void
  judgesList: JudgeSchema[]
  getJudges: () => void
}

const Clients = (props: ClientsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useGlobalDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { clientsList, getClients } = props
  const { refTypes, getRefTypes } = props
  const { judgesList, getJudges } = props

  const [formData, setFormData] = useState(DefaultClientFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultClientFormData)
  const [formErrors, setFormErrors] = useState(DefaultClientFormErrorData)

  const clientStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.CLIENTS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      clientsList.length === 0 && getClients({})
      refTypes.componentStatus.length === 0 && getRefTypes()
      judgesList.length === 0 && getJudges()
    }
  }, [clientsList.length, getClients, getJudges, getRefTypes, judgesList.length, refTypes.componentStatus.length])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const getClientsWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getClients(requestMetadata)
  }

  const primaryButtonCallback = async (action: ActionTypes) => {
    const hasFormErrors = validateClient(formData, setFormErrors)
    if (hasFormErrors) {
      return
    }

    let clientResponse: ClientResponse = { data: [], detail: { error: INVALID_INPUT } }
    if (action === ACTION_TYPES.CREATE) {
      const clientsRequest: ClientBase = { ...formData }
      clientResponse = await clientsAction({ action, clientsRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      getNumber(formData.id) > 0
    ) {
      const clientsRequest: ClientBase = { ...formData }
      clientResponse = await clientsAction({
        action: action,
        clientsRequest: clientsRequest,
        id: formData.id,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: formData.isHardDelete,
      })(dispatch)
    }

    if (clientResponse && !clientResponse.detail) {
      secondaryButtonCallback(
        addModalState,
        updateModalState,
        deleteModalState,
        setFormData,
        setFormErrors,
        DefaultClientFormData,
        DefaultClientFormErrorData,
      )
      isForceFetch.current = true
      clientsList.length === 0 && getClients({})
    }
  }

  const addUpdateModalContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <ClientForm
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        clientStatusList={clientStatusList()}
        isShowOneClient={false}
        judgesList={judgesList}
      />
    </Box>
  )

  const addModal = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.CLIENTS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultClientFormData,
      DefaultClientFormErrorData,
      formDataReset,
      undefined,
      isAreTwoClientsSame(formData, formDataReset),
      false,
      isAreTwoClientsSame(formData, formDataReset),
    )

  const updateModal = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.CLIENTS,
      addUpdateModalContent(),
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultClientFormData,
      DefaultClientFormErrorData,
      formDataReset,
      undefined,
      isAreTwoClientsSame(formData, formDataReset),
      false,
      isAreTwoClientsSame(formData, formDataReset),
    )

  const deleteModalContextText = `ARE YOU SURE YOU WANT TO ${
    formData.isDeleted ? ACTION_TYPES.RESTORE : ACTION_TYPES.DELETE
  } CLIENT: ${formData.name}?!?`

  const deleteModal = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.CLIENTS,
      deleteModalContextText,
      primaryButtonCallback,
      addModalState,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormErrors,
      DefaultClientFormData,
      DefaultClientFormErrorData,
      formData,
      formErrors,
    )

  const actionButtons = (formDataModal: ClientFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.CLIENTS,
      formDataModal,
      updateModalState,
      deleteModalState,
      setFormData,
      setFormDataReset,
    )

  const clientsTable = () => (
    <ClientTable
      clientsList={clientsList}
      actionButtons={actionButtons}
      addModalState={addModalState}
      softDeleteCallback={getClientsWithMetadata}
      componentStatusList={refTypes.componentStatus}
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.CLIENTS)}
        </Grid>
        <Grid size={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {clientsTable()}
        </Grid>
      </Grid>
      {addModal()}
      {updateModal()}
      {deleteModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients)
