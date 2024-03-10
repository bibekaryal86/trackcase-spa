import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { GlobalState, unmountPage } from '../../app'
import { RefTypesRegistry } from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import { RefTypesState } from '../types/refTypes.data.types'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    refTypes: refTypes
  }
}

const mapDispatchToProps = {
  getRefType: (refType: RefTypesRegistry) => getRefType(refType),
  addRefType: (refType: RefTypesRegistry, name: string, description: string) => addRefType(refType, name, description),
  editRefType: (refType: RefTypesRegistry, id: number, name: string, description: string, isActive?: boolean) =>
    editRefType(refType, id, name, description, isActive),
  deleteRefType: (refType: RefTypesRegistry, id: number) => deleteRefType(refType, id),
  unmountPage: (refType: RefTypesRegistry, ) => unmountPage(`${refType}_UNMOUNT`),
}

interface RefTypeProps {
  refType: string
  refTypes: RefTypesState
  getRefType: (refType: RefTypesRegistry) => void
  addRefType: (refType: RefTypesRegistry, name: string, description: string) => void
  editRefType: (refType: RefTypesRegistry, id: number, name: string, description: string, isActive?: boolean) => void
  deleteRefType: (refType: RefTypesRegistry, id: number) => void
  unmountPage: (refType: RefTypesRegistry) => void
}

const RefTypesNew = (props: RefTypeProps): React.ReactElement => {
  console.log(props.refType)

  const { unmountPage } = props

  useEffect(() => {
    return () => {
      unmountPage(props.refType as RefTypesRegistry)
    }
  }, [props.refType, unmountPage])
  const refTypes = () => (
    <>
      <h5>This is {props.refType}!</h5>
    </>
  )

  return <>{refTypes()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(RefTypesNew)
