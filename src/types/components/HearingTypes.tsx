import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { addHearingType, deleteHearingType, editHearingType, getHearingTypes } from '../actions/hearingTypes.action'
import { HEARING_TYPES_UNMOUNT } from '../types/refTypes.action.types'
import { HearingTypeSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ hearingTypes }: GlobalState) => {
  return {
    hearingTypesList: hearingTypes.data,
  }
}

const mapDispatchToProps = {
  getHearingTypes: () => getHearingTypes(),
  addHearingType: (name: string, description: string) => addHearingType(name, description),
  editHearingType: (id: number, name: string, description: string) => editHearingType(id, name, description),
  deleteHearingType: (id: number) => deleteHearingType(id),
  unmountPage: () => unmountPage(HEARING_TYPES_UNMOUNT),
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
