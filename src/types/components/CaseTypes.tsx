import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { addCaseType, deleteCaseType, editCaseType, getCaseTypes } from '../actions/caseTypes.action'
import { CASE_TYPE_UNMOUNT } from '../types/refTypes.action.types'
import { CaseTypeSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ caseType }: GlobalState) => {
  return {
    caseTypesList: caseType.data,
  }
}

const mapDispatchToProps = {
  getCaseTypes: () => getCaseTypes(),
  addCaseType: (name: string, description: string) => addCaseType(name, description),
  editCaseType: (id: number, name: string, description: string) => editCaseType(id, name, description),
  deleteCaseType: (id: number) => deleteCaseType(id),
  unmountPage: () => unmountPage(CASE_TYPE_UNMOUNT),
}

interface CaseTypesProps {
  caseTypesList: CaseTypeSchema[]
  getCaseTypes: () => void
  addCaseType: (name: string, description: string) => void
  editCaseType: (id: number, name: string, description: string) => void
  deleteCaseType: (id: number) => void
  unmountPage: () => void
}

const CaseTypes = (props: CaseTypesProps): React.ReactElement => {
  const { unmountPage } = props

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const refTypes = () => (
    <RefTypes
      refTypeId="case_type"
      refTypeName="Case Type"
      refTypesList={props.caseTypesList}
      getRefTypes={props.getCaseTypes}
      addRefType={props.addCaseType}
      editRefType={props.editCaseType}
      deleteRefType={props.deleteCaseType}
    />
  )

  return <>{refTypes()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseTypes)
