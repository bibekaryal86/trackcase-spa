import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'

import { CollectionFormCase, CollectionFormCash } from './CollectionForm'
import CollectionTable from './CollectionTable'
import {
  addModalComponent,
  deleteModalComponent,
  FetchRequestMetadata,
  getCurrency,
  getNumber,
  GlobalState,
  pageTitleComponent,
  secondaryButtonCallback,
  tableActionButtonsComponent,
  updateModalComponent,
  useModal,
} from '../../app'
import { CourtCaseSchema, getCourtCases } from '../../cases'
import { ClientSchema, getClients } from '../../clients'
import {
  ACTION_TYPES,
  ActionTypes,
  COLLECTION_TYPES,
  CollectionTypes,
  COMPONENT_STATUS_NAME,
  INVALID_INPUT,
} from '../../constants'
import { getRefTypes, RefTypesState } from '../../types'
import { collectionsAction, getCollections } from '../actions/collections.action'
import {
  CaseCollectionBase,
  CaseCollectionFormData,
  CaseCollectionResponse,
  CaseCollectionSchema,
  CashCollectionBase,
  CashCollectionFormData,
  CashCollectionResponse,
  DefaultCaseCollectionFormData,
  DefaultCaseCollectionFormErrorData,
  DefaultCashCollectionFormData,
  DefaultCashCollectionFormErrorData,
} from '../types/collections.data.types'
import {
  isAreTwoCaseCollectionsSame,
  isAreTwoCashCollectionsSame,
  validateCaseCollection,
  validateCashCollection,
} from '../utils/collections.utils'

const mapStateToProps = ({ collections, refTypes, courtCases, clients }: GlobalState) => {
  return {
    caseCollectionsList: collections.caseCollections,
    refTypes: refTypes,
    courtCasesList: courtCases.courtCases,
    clientsList: clients.clients,
  }
}

const mapDispatchToProps = {
  getRefTypes: () => getRefTypes(),
  getCollections: (requestMetadata: Partial<FetchRequestMetadata>) => getCollections(requestMetadata),
  getCourtCasesList: () => getCourtCases(),
  getClientsList: () => getClients(),
}

interface CollectionsProps {
  caseCollectionsList: CaseCollectionSchema[]
  getCollections: (requestMetadata: Partial<FetchRequestMetadata>) => void
  refTypes: RefTypesState
  getRefTypes: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCasesList: () => void
  clientsList: ClientSchema[]
  getClientsList: () => void
}

const Collections = (props: CollectionsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)
  const dispatch = useDispatch()
  const [
    addModalStateCase,
    addModalStateCash,
    updateModalStateCase,
    updateModalStateCash,
    deleteModalStateCase,
    deleteModalStateCash,
  ] = [useModal(), useModal(), useModal(), useModal(), useModal(), useModal()]

  const { caseCollectionsList, getCollections } = props
  const { refTypes, getRefTypes } = props
  const { courtCasesList, getCourtCasesList } = props
  const { clientsList, getClientsList } = props

  const minCollectionDate = dayjs().subtract(1, 'month')
  const maxCollectionDate = dayjs().add(1, 'week')

  const [formDataCase, setFormDataCase] = useState(DefaultCaseCollectionFormData)
  const [formDataCash, setFormDataCash] = useState(DefaultCashCollectionFormData)
  const [formDataResetCase, setFormDataResetCase] = useState(DefaultCaseCollectionFormData)
  const [formDataResetCash, setFormDataResetCash] = useState(DefaultCashCollectionFormData)
  const [formErrorsCase, setFormErrorsCase] = useState(DefaultCaseCollectionFormErrorData)
  const [formErrorsCash, setFormErrorsCash] = useState(DefaultCashCollectionFormErrorData)

  const collectionStatusList = useCallback(() => {
    return refTypes.componentStatus.filter((x) => x.componentName === COMPONENT_STATUS_NAME.COLLECTIONS)
  }, [refTypes.componentStatus])

  useEffect(() => {
    if (isForceFetch.current) {
      caseCollectionsList.length === 0 && getCollections({ isIncludeExtra: true })
      courtCasesList.length === 0 && getCourtCasesList()
      clientsList.length === 0 && getClientsList()
      if (
        refTypes.componentStatus.length === 0 ||
        refTypes.collectionMethod.length === 0 ||
        refTypes.caseType.length === 0
      ) {
        getRefTypes()
      }
    }
  }, [
    caseCollectionsList.length,
    clientsList.length,
    courtCasesList.length,
    getClientsList,
    getCollections,
    getCourtCasesList,
    getRefTypes,
    refTypes.caseType.length,
    refTypes.collectionMethod.length,
    refTypes.componentStatus.length,
  ])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const getCollectionsWithMetadata = (requestMetadata: Partial<FetchRequestMetadata>) => {
    getCollections({ ...requestMetadata, isIncludeExtra: true })
  }

  const primaryButtonCallback = async (action: ActionTypes, type?: string) => {
    const isCase = type === COLLECTION_TYPES.CASE_COLLECTION
    const collectionId = isCase ? getNumber(formDataCase.id) : getNumber(formDataCash.id)

    const collectionsRequest: CaseCollectionBase | CashCollectionBase = isCase
      ? { ...formDataCase }
      : { ...formDataCash }

    const hasFormErrors = isCase
      ? validateCaseCollection(formDataCase, setFormErrorsCase)
      : validateCashCollection(formDataCash, setFormErrorsCash)
    if (hasFormErrors) {
      return
    }

    let collectionResponse: CaseCollectionResponse | CashCollectionResponse = {
      data: [],
      detail: { error: INVALID_INPUT },
    }
    if (action === ACTION_TYPES.CREATE) {
      collectionResponse = await collectionsAction({ type, action, collectionsRequest })(dispatch)
    } else if (
      (action === ACTION_TYPES.UPDATE || action === ACTION_TYPES.DELETE || action === ACTION_TYPES.RESTORE) &&
      collectionId > 0
    ) {
      collectionResponse = await collectionsAction({
        type,
        action,
        collectionsRequest: collectionsRequest,
        id: collectionId,
        isRestore: action === ACTION_TYPES.RESTORE,
        isHardDelete: isCase ? formDataCase.isHardDelete : formDataCash.isHardDelete,
      })(dispatch)
    }

    if (collectionResponse && !collectionResponse.detail) {
      isCase
        ? secondaryButtonCallback(
            addModalStateCase,
            updateModalStateCase,
            deleteModalStateCase,
            setFormDataCase,
            setFormErrorsCase,
            DefaultCaseCollectionFormData,
            DefaultCaseCollectionFormErrorData,
          )
        : secondaryButtonCallback(
            addModalStateCash,
            updateModalStateCash,
            deleteModalStateCash,
            setFormDataCash,
            setFormErrorsCash,
            DefaultCashCollectionFormData,
            DefaultCashCollectionFormErrorData,
          )
      isForceFetch.current = true
      caseCollectionsList.length === 0 && getCollections({})
    }
  }

  const addUpdateModalContentCase = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <CollectionFormCase
        formData={formDataCase}
        setFormData={setFormDataCase}
        formErrors={formErrorsCase}
        setFormErrors={setFormErrorsCase}
        courtCasesList={courtCasesList}
        collectionStatusList={collectionStatusList()}
        isShowOneCollection={false}
      />
    </Box>
  )

  const addUpdateModalContentCash = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', marginTop: -2 }}>
      <CollectionFormCash
        formData={formDataCash}
        setFormData={setFormDataCash}
        formErrors={formErrorsCash}
        setFormErrors={setFormErrorsCash}
        collectionMethodsList={refTypes.collectionMethod}
        courtCasesList={courtCasesList}
        clientsList={clientsList}
        caseCollectionList={caseCollectionsList}
        minCollectionDate={minCollectionDate}
        maxCollectionDate={maxCollectionDate}
        isShowOneCollection={false}
      />
    </Box>
  )

  const addModalCase = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.COLLECTIONS,
      addUpdateModalContentCase(),
      primaryButtonCallback,
      addModalStateCase,
      updateModalStateCase,
      deleteModalStateCase,
      setFormDataCase,
      setFormErrorsCase,
      DefaultCaseCollectionFormData,
      DefaultCaseCollectionFormErrorData,
      formDataResetCase,
      COLLECTION_TYPES.CASE_COLLECTION,
      isAreTwoCaseCollectionsSame(formDataCase, formDataResetCase),
      isAreTwoCaseCollectionsSame(formDataCase, formDataResetCase),
      isAreTwoCaseCollectionsSame(formDataCase, formDataResetCase),
    )

  const addModalCash = () =>
    addModalComponent(
      COMPONENT_STATUS_NAME.COLLECTIONS,
      addUpdateModalContentCash(),
      primaryButtonCallback,
      addModalStateCash,
      updateModalStateCash,
      deleteModalStateCash,
      setFormDataCash,
      setFormErrorsCash,
      DefaultCashCollectionFormData,
      DefaultCashCollectionFormErrorData,
      formDataResetCash,
      COLLECTION_TYPES.CASH_COLLECTION,
      isAreTwoCashCollectionsSame(formDataCash, formDataResetCash),
      isAreTwoCashCollectionsSame(formDataCash, formDataResetCash),
      isAreTwoCashCollectionsSame(formDataCash, formDataResetCash),
    )

  const updateModalCase = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.COLLECTIONS,
      addUpdateModalContentCase(),
      primaryButtonCallback,
      addModalStateCase,
      updateModalStateCase,
      deleteModalStateCase,
      setFormDataCase,
      setFormErrorsCase,
      DefaultCaseCollectionFormData,
      DefaultCaseCollectionFormErrorData,
      formDataResetCase,
      COLLECTION_TYPES.CASE_COLLECTION,
      isAreTwoCaseCollectionsSame(formDataCase, formDataResetCase),
      isAreTwoCaseCollectionsSame(formDataCase, formDataResetCase),
      isAreTwoCaseCollectionsSame(formDataCase, formDataResetCase),
    )

  const updateModalCash = () =>
    updateModalComponent(
      COMPONENT_STATUS_NAME.COLLECTIONS,
      addUpdateModalContentCash(),
      primaryButtonCallback,
      addModalStateCash,
      updateModalStateCash,
      deleteModalStateCash,
      setFormDataCash,
      setFormErrorsCash,
      DefaultCashCollectionFormData,
      DefaultCashCollectionFormErrorData,
      formDataResetCash,
      COLLECTION_TYPES.CASH_COLLECTION,
      isAreTwoCashCollectionsSame(formDataCash, formDataResetCash),
      isAreTwoCashCollectionsSame(formDataCash, formDataResetCash),
      isAreTwoCashCollectionsSame(formDataCash, formDataResetCash),
    )

  const getDeleteContextText = (type: CollectionTypes) => {
    if (type === COLLECTION_TYPES.CASE_COLLECTION) {
      const client = clientsList.find((x) => x.id === formDataCase.courtCase?.clientId)
      const caseType = refTypes.caseType.find((x) => x.id === formDataCase.courtCase?.caseTypeId)
      const clientCase = `${client?.name}, ${caseType?.name}`
      return `ARE YOU SURE YOU WANT TO DELETE COLLECTIONS FOR CASE ${clientCase}?!?`
    } else {
      const caseCollection = caseCollectionsList.find((x) => x.id === formDataCash.caseCollectionId)
      const client = clientsList.find((x) => x.id === caseCollection?.courtCase?.clientId)
      const caseType = refTypes.caseType.find((x) => x.id === caseCollection?.courtCase?.caseTypeId)
      const clientCase = `${client?.name}, ${caseType?.name}`
      const collectedAmount = getCurrency(formDataCash.collectedAmount)
      return `ARE YOU SURE YOU WANT TO DELETE ${collectedAmount} COLLECTED FROM CASE ${clientCase}?!?`
    }
  }

  const deleteModalCase = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.COLLECTIONS,
      getDeleteContextText(COLLECTION_TYPES.CASE_COLLECTION),
      primaryButtonCallback,
      addModalStateCase,
      updateModalStateCase,
      deleteModalStateCase,
      setFormDataCase,
      setFormErrorsCase,
      DefaultCaseCollectionFormData,
      DefaultCaseCollectionFormErrorData,
      formDataCase,
      formErrorsCase,
      COLLECTION_TYPES.CASE_COLLECTION,
    )

  const deleteModalCash = () =>
    deleteModalComponent(
      COMPONENT_STATUS_NAME.COLLECTIONS,
      getDeleteContextText(COLLECTION_TYPES.CASH_COLLECTION),
      primaryButtonCallback,
      addModalStateCash,
      updateModalStateCash,
      deleteModalStateCash,
      setFormDataCash,
      setFormErrorsCash,
      DefaultCashCollectionFormData,
      DefaultCashCollectionFormErrorData,
      formDataCash,
      formErrorsCash,
      COLLECTION_TYPES.CASH_COLLECTION,
    )

  const actionButtonsCase = (formDataModal: CaseCollectionFormData | CashCollectionFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.COLLECTIONS,
      formDataModal as CaseCollectionFormData,
      updateModalStateCase,
      deleteModalStateCase,
      setFormDataCase,
      setFormDataResetCase,
    )

  const actionButtonsCash = (formDataModal: CashCollectionFormData | CaseCollectionFormData) =>
    tableActionButtonsComponent(
      COMPONENT_STATUS_NAME.COLLECTIONS,
      formDataModal as CashCollectionFormData,
      updateModalStateCash,
      deleteModalStateCash,
      setFormDataCash,
      setFormDataResetCash,
    )

  const addCashCollectionButtonCallback = (caseCollectionId: number) =>
    setFormDataCash({ ...DefaultCashCollectionFormData, caseCollectionId })

  const collectionTable = () => (
    <CollectionTable
      caseCollectionsList={caseCollectionsList}
      componentStatusList={collectionStatusList()}
      collectionMethodsList={refTypes.collectionMethod}
      courtCasesList={courtCasesList}
      clientsList={clientsList}
      softDeleteCallback={getCollectionsWithMetadata}
      addModalStateCase={addModalStateCase}
      addModalStateCash={addModalStateCash}
      actionButtonsCase={actionButtonsCase}
      actionButtonsCash={actionButtonsCash}
      addCashCollectionButtonCallback={addCashCollectionButtonCallback}
    />
  )

  const showModals = () => (
    <>
      {addModalCase()}
      {addModalCash()}
      {updateModalCase()}
      {updateModalCash()}
      {deleteModalCase()}
      {deleteModalCash()}
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {pageTitleComponent(COMPONENT_STATUS_NAME.COLLECTIONS)}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {collectionTable()}
        </Grid>
      </Grid>
      {showModals()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections)
