import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { addFilingType, deleteFilingType, editFilingType, getFilingType } from '../actions/filingTypes.action'
import { FILING_TYPES_UNMOUNT } from '../types/refTypes.action.types'
import { FilingTypeSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ filingTypes }: GlobalState) => {
  return {
    formTypesList: filingTypes.formTypes,
  }
}

const mapDispatchToProps = {
  getFormTypes: () => getFilingType(),
  addFormType: (name: string, description: string) => addFilingType(name, description),
  editFormType: (id: number, name: string, description: string) => editFilingType(id, name, description),
  deleteFormType: (id: number) => deleteFilingType(id),
  unmountPage: () => unmountPage(FILING_TYPES_UNMOUNT),
}

interface FormTypesProps {
  formTypesList: FilingTypeSchema[]
  getFormTypes: () => void
  addFormType: (name: string, description: string) => void
  editFormType: (id: number, name: string, description: string) => void
  deleteFormType: (id: number) => void
  unmountPage: () => void
}

const FormTypes = (props: FormTypesProps): React.ReactElement => {
  const { unmountPage } = props

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const refTypes = () => (
    <RefTypes
      refTypeId="form_type"
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

export default connect(mapStateToProps, mapDispatchToProps)(FormTypes)
