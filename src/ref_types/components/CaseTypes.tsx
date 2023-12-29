import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { addCaseType, deleteCaseType, editCaseType, getCaseTypes } from '../actions/case_types.action'
import { CASE_TYPES_UNMOUNT } from '../types/ref_types.action.types'
import { CaseTypeSchema } from '../types/ref_types.data.types'

const mapStateToProps = ({ caseTypes }: GlobalState) => {
  return {
    caseTypesList: caseTypes.case_types,
  }
}

const mapDispatchToProps = {
  getCaseTypes: () => getCaseTypes(),
  addCaseType: (name: string, description: string) => addCaseType(name, description),
  editCaseType: (id: number, name: string, description: string) => editCaseType(id, name, description),
  deleteCaseType: (id: number) => deleteCaseType(id),
  unmountPage: () => unmountPage(CASE_TYPES_UNMOUNT),
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
