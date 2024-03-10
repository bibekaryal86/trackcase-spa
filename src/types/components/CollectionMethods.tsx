import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { REF_TYPES_REGISTRY } from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import { COLLECTION_METHOD_UNMOUNT } from '../types/refTypes.action.types'
import { CollectionMethodSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    collectionMethodsList: refTypes.collectionMethod,
  }
}

const mapDispatchToProps = {
  getCollectionMethods: () => getRefType(REF_TYPES_REGISTRY.COLLECTION_METHOD),
  addCollectionMethod: (name: string, description: string) => addRefType(REF_TYPES_REGISTRY.COLLECTION_METHOD, name, description),
  editCollectionMethod: (id: number, name: string, description: string) => editRefType(REF_TYPES_REGISTRY.COLLECTION_METHOD, id, name, description),
  deleteCollectionMethod: (id: number) => deleteRefType(REF_TYPES_REGISTRY.COLLECTION_METHOD, id),
  unmountPage: () => unmountPage(COLLECTION_METHOD_UNMOUNT),
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
