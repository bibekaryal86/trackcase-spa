import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { REF_TYPES_REGISTRY } from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import { FILING_TYPE_UNMOUNT } from '../types/refTypes.action.types'
import { FilingTypeSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    formTypesList: refTypes.filingType,
  }
}

const mapDispatchToProps = {
  getFormTypes: () => getRefType(REF_TYPES_REGISTRY.FILING_TYPE),
  addFormType: (name: string, description: string) => addRefType(REF_TYPES_REGISTRY.FILING_TYPE, name, description),
  editFormType: (id: number, name: string, description: string) => editRefType(REF_TYPES_REGISTRY.FILING_TYPE, id, name, description),
  deleteFormType: (id: number) => deleteRefType(REF_TYPES_REGISTRY.FILING_TYPE, id),
  unmountPage: () => unmountPage(FILING_TYPE_UNMOUNT),
}

interface FormTypesProps {
  formTypesList: FilingTypeSchema[]
  getFormTypes: () => void
  addFormType: (name: string, description: string) => void
  editFormType: (id: number, name: string, description: string) => void
  deleteFormType: (id: number) => void
  unmountPage: () => void
}

const FilingTypes = (props: FormTypesProps): React.ReactElement => {
  const { unmountPage } = props

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const refTypes = () => (
    <RefTypes
      refTypeId="filing_type"
      refTypeName="Filing Type"
      refTypesList={props.formTypesList}
      getRefTypes={props.getFormTypes}
      addRefType={props.addFormType}
      editRefType={props.editFormType}
      deleteRefType={props.deleteFormType}
    />
  )

  return <>{refTypes()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(FilingTypes)
