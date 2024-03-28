import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import ClientForm from './ClientForm'
import ClientTable from './ClientTable'
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
import { ACTION_TYPES, ActionTypes, COMPONENT_STATUS_NAME, INVALID_INPUT, REF_TYPES_REGISTRY } from '../../constants'
import { getJudges, JudgeSchema } from '../../judges'
import { ComponentStatusSchema, getRefType } from '../../types'
import { clientsAction, getClients } from '../actions/clients.action'
import {
  ClientBase,
  ClientFormData,
  ClientResponse,
  ClientSchema,
  DefaultClientFormData,
  DefaultClientFormErrorData,
} from '../types/clients.data.types'
import { validateClient } from '../utils/clients.utils'

const mapStateToProps = ({ refTypes, clients, judges }: GlobalState) => {
  return {
    componentStatusList: refTypes.componentStatus,
    clientsList: clients.clients,
    judgesList: judges.judges,
  }
}

const mapDispatchToProps = {
  getRefType: () => getRefType(REF_TYPES_REGISTRY.COMPONENT_STATUS),
  getClients: (requestMetadata: Partial<FetchRequestMetadata>) => getClients(requestMetadata),
  getJudges: () => getJudges(),
}

interface ClientsProps {
  clientsList: ClientSchema[]
  getClients: (requestMetadata: Partial<FetchRequestMetadata>) => void
  componentStatusList: ComponentStatusSchema[]
  getRefType: () => void
  judgesList: JudgeSchema[]
  getJudges: () => void
}

const Clients = (props: ClientsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [addModalState, updateModalState, deleteModalState] = [useModal(), useModal(), useModal()]

  const { clientsList, getClients } = props
  const { componentStatusList, getRefType } = props
  const { judgesList, getJudges } = props

  const [formData, setFormData] = useState(DefaultClientFormData)
  const [formDataReset, setFormDataReset] = useState(DefaultClientFormData)
  const [formErrors, setFormErrors] = useState(DefaultClientFormErrorData)

  const clientStatusList = useCallback(() => {
    return componentStatusList.filter((x) => x.componentName === COMPONENT_STATUS_NAME.CLIENTS)
  }, [componentStatusList])

  useEffect(() => {
    if (isForceFetch.current) {
      clientsList.length === 0 && getClients({})
      componentStatusList.length === 0 && getRefType()
      judgesList.length === 0 && getJudges()
    }
  }, [componentStatusList.length, clientsList.length, getClients, getRefType, judgesList.length, getJudges])

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
    />
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.CLIENTS)}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
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
