import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'

import CollectionForm from './CollectionForm'
import { getStatusesList, GlobalState, StatusSchema, unmountPage } from '../../app'
import { CourtCaseSchema, getCourtCases } from '../../cases'
import { ClientSchema, getClients } from '../../clients'
import { COLLECTION_OBJECT_TYPES } from '../../constants'
import { CollectionMethodSchema } from '../../types'
import { getCollectionMethods } from '../../types/actions/collectionMethods.action'
import { getCollections } from '../actions/collections.action'
import { COLLECTIONS_UNMOUNT } from '../types/collections.action.types'
import { CaseCollectionSchema, CashCollectionSchema, DefaultCollectionSchema } from '../types/collections.data.types'

const mapStateToProps = ({ collections, statuses, collectionMethods, courtCases, clients }: GlobalState) => {
  return {
    isCloseModal: collections.isCloseModal,
    caseCollectionsList: collections.caseCollections,
    statusList: statuses.statuses,
    collectionMethodsList: collectionMethods.collectionMethods,
    courtCasesList: courtCases.courtCases,
    clientsList: clients.clients,
    selectedCourtCase: courtCases.selectedCourtCase,
  }
}

const mapDispatchToProps = {
  getCaseCollections: () => getCollections(COLLECTION_OBJECT_TYPES.CASE),
  unmountPage: () => unmountPage(COLLECTIONS_UNMOUNT),
  getStatusesList: () => getStatusesList(),
  getCollectionMethodsList: () => getCollectionMethods(),
  getCourtCasesList: () => getCourtCases(),
  getClientsList: () => getClients(),
}

interface CollectionsProps {
  isCloseModal: boolean
  caseCollectionsList: CaseCollectionSchema[]
  getCaseCollections: () => void
  unmountPage: () => void
  statusList: StatusSchema<string>
  getStatusesList: () => void
  collectionMethodsList: CollectionMethodSchema[]
  getCollectionMethodsList: () => void
  courtCasesList: CourtCaseSchema[]
  getCourtCasesList: () => void
  clientsList: ClientSchema[]
  getClientsList: () => void
}

const Collections = (props: CollectionsProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)

  const { caseCollectionsList, getCaseCollections, statusList, getStatusesList, unmountPage } = props
  const { collectionMethodsList, getCollectionMethodsList } = props
  const { courtCasesList, getCourtCasesList, clientsList, getClientsList } = props

  const [selectedCollection, setSelectedCollection] = useState<CaseCollectionSchema | CashCollectionSchema>(
    DefaultCollectionSchema,
  )
  const [collectionStatusList, setCollectionStatusList] = useState<string[]>([])

  const minCollectionDate = dayjs().subtract(1, 'month')
  const maxCollectionDate = dayjs().add(1, 'week')

  useEffect(() => {
    if (isForceFetch.current) {
      caseCollectionsList.length === 0 && getCaseCollections()
      statusList.collections.all.length === 0 && getStatusesList()
      collectionMethodsList.length === 0 && getCollectionMethodsList()
      courtCasesList.length === 0 && getCourtCasesList()
      clientsList.length === 0 && getClientsList()
    }
    isForceFetch.current = false
  }, [
    caseCollectionsList.length,
    clientsList.length,
    collectionMethodsList.length,
    courtCasesList.length,
    getCaseCollections,
    getClientsList,
    getCollectionMethodsList,
    getCourtCasesList,
    getStatusesList,
    statusList.collections.all.length,
  ])

  useEffect(() => {
    if (statusList.collections.all.length > 0) {
      setCollectionStatusList(statusList.collections.all)
    }
  }, [statusList.collections.all])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
      unmountPage()
    }
  }, [unmountPage])

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
    />
  )
  // TODO
  console.log(collectionForm(COLLECTION_OBJECT_TYPES.CASE).type)

  const pageText = () => (
    <>
      <h5>This is the Collections!</h5>
    </>
  )

  return <>{pageText()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(Collections)
