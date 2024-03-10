import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { REF_TYPES_REGISTRY } from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import { HEARING_TYPE_UNMOUNT } from '../types/refTypes.action.types'
import { HearingTypeSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    hearingTypesList: refTypes.hearingType,
  }
}

const mapDispatchToProps = {
  getHearingTypes: () => getRefType(REF_TYPES_REGISTRY.HEARING_TYPE),
  addHearingType: (name: string, description: string) => addRefType(REF_TYPES_REGISTRY.HEARING_TYPE, name, description),
  editHearingType: (id: number, name: string, description: string) =>
    editRefType(REF_TYPES_REGISTRY.HEARING_TYPE, id, name, description),
  deleteHearingType: (id: number) => deleteRefType(REF_TYPES_REGISTRY.HEARING_TYPE, id),
  unmountPage: () => unmountPage(HEARING_TYPE_UNMOUNT),
}

interface HearingTypesProps {
  hearingTypesList: HearingTypeSchema[]
  getHearingTypes: () => void
  addHearingType: (name: string, description: string) => void
  editHearingType: (id: number, name: string, description: string) => void
  deleteHearingType: (id: number) => void
  unmountPage: () => void
}

const HearingTypes = (props: HearingTypesProps): React.ReactElement => {
  const { unmountPage } = props

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const refTypes = () => (
    <RefTypes
      refTypeId="hearing_type"
      refTypeName="Hearing Type"
      refTypesList={props.hearingTypesList}
      getRefTypes={props.getHearingTypes}
      addRefType={props.addHearingType}
      editRefType={props.editHearingType}
      deleteRefType={props.deleteHearingType}
    />
  )

  return <>{refTypes()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(HearingTypes)
