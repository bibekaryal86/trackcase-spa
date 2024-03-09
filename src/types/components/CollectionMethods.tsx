import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import {
  addCollectionMethod,
  deleteCollectionMethod,
  editCollectionMethod,
  getCollectionMethods,
} from '../actions/collectionMethods.action'
import { COLLECTION_METHODS_UNMOUNT } from '../types/refTypes.action.types'
import { CollectionMethodSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ collectionMethods }: GlobalState) => {
  return {
    collectionMethodsList: collectionMethods.data,
  }
}

const mapDispatchToProps = {
  getCollectionMethods: () => getCollectionMethods(),
  addCollectionMethod: (name: string, description: string) => addCollectionMethod(name, description),
  editCollectionMethod: (id: number, name: string, description: string) => editCollectionMethod(id, name, description),
  deleteCollectionMethod: (id: number) => deleteCollectionMethod(id),
  unmountPage: () => unmountPage(COLLECTION_METHODS_UNMOUNT),
}

interface CollectionMethodsProps {
  collectionMethodsList: CollectionMethodSchema[]
  getCollectionMethods: () => void
  addCollectionMethod: (name: string, description: string) => void
  editCollectionMethod: (id: number, name: string, description: string) => void
  deleteCollectionMethod: (id: number) => void
  unmountPage: () => void
}

const CollectionMethods = (props: CollectionMethodsProps): React.ReactElement => {
  const { unmountPage } = props

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const refTypes = () => (
    <RefTypes
      refTypeId="collection_method"
      refTypeName="Collection Method"
      refTypesList={props.collectionMethodsList}
      getRefTypes={props.getCollectionMethods}
      addRefType={props.addCollectionMethod}
      editRefType={props.editCollectionMethod}
      deleteRefType={props.deleteCollectionMethod}
    />
  )

  return <>{refTypes()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionMethods)
