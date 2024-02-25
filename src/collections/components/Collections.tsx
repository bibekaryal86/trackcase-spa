import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import CollectionForm from './CollectionForm'
import CollectionTable from './CollectionTable'
import { getCurrency, getNumber, getStatusesList, GlobalState, Modal, StatusSchema, unmountPage } from '../../app'
import { CourtCaseSchema, getCourtCase, getCourtCases } from '../../cases'
import { ClientSchema, getClients } from '../../clients'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_RESET,
  BUTTON_UPDATE,
  COLLECTION_OBJECT_TYPES,
  ID_DEFAULT,
} from '../../constants'
import { CaseTypeSchema, CollectionMethodSchema, getCaseTypes, getCollectionMethods } from '../../types'
import { addCollection, deleteCollection, editCollection, getCollections } from '../actions/collections.action'
import { COLLECTIONS_UNMOUNT } from '../types/collections.action.types'
import { CaseCollectionSchema, CashCollectionSchema, DefaultCollectionSchema } from '../types/collections.data.types'
import { isAreTwoCollectionsSame, isCaseCollection } from '../utils/collections.utils'

const mapStateToProps = ({ collections, statuses, collectionMethods, caseTypes, courtCases, clients }: GlobalState) => {
  return {
    isCloseModal: collections.isCloseModal,
    caseCollectionsList: collections.caseCollections,
    statusList: statuses.statuses,
    collectionMethodsList: collectionMethods.collectionMethods,
    caseTypesList: caseTypes.caseTypes,
    courtCasesList: courtCases.courtCases,
    clientsList: clients.clients,
    selectedCourtCase: courtCases.selectedCourtCase,
  }
}

const mapDispatchToProps = {
  getCaseCollections: () => getCollections(COLLECTION_OBJECT_TYPES.CASE),
  addCaseCollection: (collection: CaseCollectionSchema) => addCollection(collection, COLLECTION_OBJECT_TYPES.CASE),
  addCashCollection: (collection: CashCollectionSchema) => addCollection(collection, COLLECTION_OBJECT_TYPES.CASH),
  editCaseCollection: (id: number, collection: CaseCollectionSchema) =>
    editCollection(id, COLLECTION_OBJECT_TYPES.CASE, collection),
  editCashCollection: (id: number, collection: CashCollectionSchema) =>
    editCollection(id, COLLECTION_OBJECT_TYPES.CASH, collection),
  deleteCaseCollection: (id: number) => deleteCollection(id, COLLECTION_OBJECT_TYPES.CASE),
  deleteCashCollection: (id: number) => deleteCollection(id, COLLECTION_OBJECT_TYPES.CASH),
  unmountPage: () => unmountPage(COLLECTIONS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getCollectionMethodsList: () => getCollectionMethods(),
  getCaseTypesList: () => getCaseTypes(),
  getCourtCasesList: () => getCourtCases(),
  getClientsList: () => getClients(),
  getCourtCase: (courtCaseId: number) => getCourtCase(courtCaseId),
}

interface CollectionsProps {
  isCloseModal: boolean
  caseCollectionsList: CaseCollectionSchema[]
  getCaseCollections: () => void
  addCaseCollection: (collection: CaseCollectionSchema) => void
  addCashCollection: (collection: CashCollectionSchema) => void
  editCaseCollection: (id: number, collection: CaseCollectionSchema) => void
  editCashCollection: (id: number, collection: CashCollectionSchema) => void
  deleteCaseCollection: (id: number) => void
  deleteCashCollection: (id: number) => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  collectionMethodsList: CollectionMethodSchema[]
  getCollectionMethodsList: () => void
  caseTypesList: CaseTypeSchema[]
  getCaseTypesList: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCasesList: () => void
  clientsList: ClientSchema[]
  getClientsList: () => void
  courtCaseId?: string
  selectedCourtCase?: CourtCaseSchema
  getCourtCase: (courtCaseId: number) => void
}

const Collections = (props: CollectionsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)

  const {
    caseCollectionsList,
    getCaseCollections,
    addCaseCollection,
    addCashCollection,
    editCaseCollection,
    editCashCollection,
    deleteCaseCollection,
    deleteCashCollection,
  } = props
  const { unmountPage } = props
  const { isCloseModal } = props
  const { statusList, getStatusesList } = props
  const { collectionMethodsList, getCollectionMethodsList } = props
  const { caseTypesList, getCaseTypesList } = props
  const { courtCasesList, getCourtCasesList, clientsList, getClientsList } = props
  const { courtCaseId, selectedCourtCase, getCourtCase } = props

  const [modal, setModal] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number>(ID_DEFAULT)
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedCollection, setSelectedCollection] = useState<CaseCollectionSchema | CashCollectionSchema>(
    DefaultCollectionSchema,
  )
  const [selectedCollectionForReset, setSelectedCollectionForReset] = useState<
    CaseCollectionSchema | CashCollectionSchema
  >(DefaultCollectionSchema)
  const [collectionStatusList, setCollectionStatusList] = useState<string[]>([])

  const minCollectionDate = dayjs().subtract(1, 'month')
  const maxCollectionDate = dayjs().add(1, 'week')

  useEffect(() => {
    if (isForceFetch.current) {
      caseCollectionsList.length === 0 && getCaseCollections()
      statusList.collections.all.length === 0 && getStatusesList()
      collectionMethodsList.length === 0 && getCollectionMethodsList()
      caseTypesList.length === 0 && getCaseTypesList()
      courtCasesList.length === 0 && getCourtCasesList()
      clientsList.length === 0 && getClientsList()

      if (courtCaseId) {
        setSelectedCollection({ ...DefaultCollectionSchema, courtCaseId: getNumber(courtCaseId) })
        if (!selectedCourtCase) {
          getCourtCase(getNumber(courtCaseId))
        }
      }
    }
    isForceFetch.current = false
  }, [
    caseCollectionsList.length,
    clientsList.length,
    collectionMethodsList.length,
    caseTypesList.length,
    courtCasesList.length,
    getCaseCollections,
    getClientsList,
    getCollectionMethodsList,
    getCaseTypesList,
    getCourtCasesList,
    getStatusesList,
    statusList.collections.all.length,
    courtCaseId,
    selectedCourtCase,
    getCourtCase,
  ])

  useEffect(() => {
    if (statusList.collections.all.length > 0) {
      setCollectionStatusList(statusList.collections.all)
    }
  }, [statusList.collections.all])

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

  const primaryButtonCallback = (action: string, type: string, id?: number) => {
    isForceFetch.current = true
    if (id && action === ACTION_DELETE) {
      type === COLLECTION_OBJECT_TYPES.CASE && deleteCaseCollection(id)
      type === COLLECTION_OBJECT_TYPES.CASH && deleteCashCollection(id)
    } else if (id && action === ACTION_UPDATE) {
      type === COLLECTION_OBJECT_TYPES.CASE && editCaseCollection(id, selectedCollection as CaseCollectionSchema)
      type === COLLECTION_OBJECT_TYPES.CASH && editCashCollection(id, selectedCollection as CashCollectionSchema)
    } else {
      type === COLLECTION_OBJECT_TYPES.CASE && addCaseCollection(selectedCollection as CaseCollectionSchema)
      type === COLLECTION_OBJECT_TYPES.CASH && addCashCollection(selectedCollection as CashCollectionSchema)
    }
  }

  const secondaryButtonCallback = () => {
    setModal('')
    setSelectedId(ID_DEFAULT)
    setSelectedCollection(DefaultCollectionSchema)
    setSelectedCollectionForReset(DefaultCollectionSchema)
  }

  const resetButtonCallback = (action: string) => {
    action === ACTION_ADD && setSelectedCollection(DefaultCollectionSchema)
    action === ACTION_UPDATE && setSelectedCollection(selectedCollectionForReset)
  }

  const collectionForm = (collectionType: string) => (
    <CollectionForm
      collectionType={collectionType}
      selectedCollection={selectedCollection}
      setSelectedCollection={setSelectedCollection}
      collectionMethodsList={collectionMethodsList}
      courtCasesList={courtCasesList}
      clientsList={clientsList}
      caseCollectionList={caseCollectionsList}
      collectionStatusList={collectionStatusList}
      isShowOneCollection={false}
      minCollectionDate={minCollectionDate}
      maxCollectionDate={maxCollectionDate}
      courtCaseId={courtCaseId}
    />
  )

  const addModal = () => (
    <Modal
      isOpen={true}
      setIsOpenExtra={setModal}
      cleanupOnClose={secondaryButtonCallback}
      title={isCaseCollection(selectedType) ? 'Add Case Collection' : 'Add Cash Collection'}
      primaryButtonText={BUTTON_ADD}
      primaryButtonCallback={() => primaryButtonCallback(ACTION_ADD, selectedType)}
      primaryButtonDisabled={isAreTwoCollectionsSame(selectedType, selectedCollection, selectedCollectionForReset)}
      secondaryButtonText={BUTTON_CANCEL}
      secondaryButtonCallback={secondaryButtonCallback}
      contentText="Provide the following details..."
      content={collectionForm(selectedType)}
      resetButtonText={BUTTON_RESET}
      resetButtonCallback={() => resetButtonCallback(ACTION_ADD)}
      resetButtonDisabled={isAreTwoCollectionsSame(selectedType, selectedCollection, selectedCollectionForReset)}
    />
  )

  const updateModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title={isCaseCollection(selectedType) ? 'Update Case Collection' : 'Update Cash Collection'}
        primaryButtonText={BUTTON_UPDATE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_UPDATE, selectedType, selectedId)}
        primaryButtonDisabled={isAreTwoCollectionsSame(selectedType, selectedCollection, selectedCollectionForReset)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText="Provide the following details..."
        content={collectionForm(selectedType)}
        resetButtonText={BUTTON_RESET}
        resetButtonCallback={() => resetButtonCallback(ACTION_UPDATE)}
        resetButtonDisabled={isAreTwoCollectionsSame(selectedType, selectedCollection, selectedCollectionForReset)}
      />
    )
  }

  const getDeleteContextText = () => {
    if (isCaseCollection(selectedType)) {
      const caseCollection = selectedCollection as CaseCollectionSchema
      const client = clientsList.find((x) => x.id === caseCollection.courtCase?.clientId)
      const caseType = caseTypesList.find((x) => x.id === caseCollection.courtCase?.caseTypeId)
      const clientCase = `${client?.name}, ${caseType?.name}`
      return `Are you sure you want to delete Collections for case ${clientCase}?!?`
    } else {
      const cashCollection = selectedCollection as CashCollectionSchema
      const caseCollection = caseCollectionsList.find((x) => x.id === cashCollection.caseCollectionId)
      const client = clientsList.find((x) => x.id === caseCollection?.courtCase?.clientId)
      const caseType = caseTypesList.find((x) => x.id === caseCollection?.courtCase?.caseTypeId)
      const clientCase = `${client?.name}, ${caseType?.name}`
      const collectedAmount = getCurrency(cashCollection.collectedAmount)
      return `Are you sure you want to delete ${collectedAmount} collected from case ${clientCase}?!?`
    }
  }

  const deleteModal = () => {
    return (
      <Modal
        isOpen={true}
        setIsOpenExtra={setModal}
        cleanupOnClose={secondaryButtonCallback}
        title={isCaseCollection(selectedType) ? 'Delete Case Collection' : 'Delete Cash Collection'}
        primaryButtonText={BUTTON_DELETE}
        primaryButtonCallback={() => primaryButtonCallback(ACTION_DELETE, selectedType, selectedId)}
        secondaryButtonText={BUTTON_CANCEL}
        secondaryButtonCallback={secondaryButtonCallback}
        contentText={getDeleteContextText()}
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

  const collectionsPageTitle = () => (
    <Grid container alignItems="center" columnGap={2}>
      <Typography component="h1" variant="h6" color="primary" gutterBottom>
        Collections
      </Typography>
    </Grid>
  )

  const getCourtCaseCollections = (courtCaseCollectionsList?: CaseCollectionSchema[]) => {
    if (courtCaseCollectionsList && courtCaseCollectionsList.length > 0) {
      const courtCaseCollection = courtCaseCollectionsList[0]
      const caseCollection = caseCollectionsList.find((x) => x.id === courtCaseCollection.id)
      if (caseCollection) {
        return [caseCollection]
      }
    }
    return caseCollectionsList
  }

  const collectionTable = (collectionType: string) => (
    <CollectionTable
      collectionType={collectionType}
      caseCollectionsList={
        !(courtCaseId && selectedCourtCase)
          ? caseCollectionsList
          : getCourtCaseCollections(selectedCourtCase.caseCollections) || []
      }
      collectionMethodsList={collectionMethodsList}
      courtCasesList={courtCasesList}
      clientsList={clientsList}
      setModal={setModal}
      setSelectedId={setSelectedId}
      setSelectedType={setSelectedType}
      setSelectedCollection={setSelectedCollection}
      setSelectedCollectionForReset={setSelectedCollectionForReset}
      isAddModelComponent={!(courtCaseId && selectedCourtCase)}
    />
  )

  return courtCaseId ? (
    <>
      {collectionTable(COLLECTION_OBJECT_TYPES.CASE)}
      {modal && showModal()}
    </>
  ) : (
    <Box sx={{ display: 'flex' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {collectionsPageTitle()}
        </Grid>
        <Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>
          {collectionTable(COLLECTION_OBJECT_TYPES.CASE)}
        </Grid>
        {/*<Grid item xs={12} sx={{ ml: 1, mr: 1, p: 0 }}>*/}
        {/*  {collectionTable(COLLECTION_OBJECT_TYPES.CASH)}*/}
        {/*</Grid>*/}
      </Grid>
      {modal && showModal()}
    </Box>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections)
