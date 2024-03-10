import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { addFilingType, deleteFilingType, editFilingType, getFilingType } from '../actions/filingTypes.action'
import { FILING_TYPE_UNMOUNT } from '../types/refTypes.action.types'
import { FilingTypeSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ filingType }: GlobalState) => {
  return {
    formTypesList: filingType.data,
  }
}

const mapDispatchToProps = {
  getFormTypes: () => getFilingType(),
  addFormType: (name: string, description: string) => addFilingType(name, description),
  editFormType: (id: number, name: string, description: string) => editFilingType(id, name, description),
  deleteFormType: (id: number) => deleteFilingType(id),
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
