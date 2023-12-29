import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { addFormType, deleteFormType, editFormType, getFormTypes } from '../actions/form_types.action'
import { FORM_TYPES_UNMOUNT } from '../types/ref_types.action.types'
import { FormTypeSchema } from '../types/ref_types.data.types'

const mapStateToProps = ({ formTypes }: GlobalState) => {
  return {
    formTypesList: formTypes.form_types,
  }
}

const mapDispatchToProps = {
  getFormTypes: () => getFormTypes(),
  addFormType: (name: string, description: string) => addFormType(name, description),
  editFormType: (id: number, name: string, description: string) => editFormType(id, name, description),
  deleteFormType: (id: number) => deleteFormType(id),
  unmountPage: () => unmountPage(FORM_TYPES_UNMOUNT),
}

interface FormTypesProps {
  formTypesList: FormTypeSchema[]
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
      refTypeName="Form Type"
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
