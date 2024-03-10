import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { REF_TYPES_REGISTRY } from '../../constants'
import { addRefType, deleteRefType, editRefType, getRefType } from '../actions/refTypes.action'
import { TASK_TYPE_UNMOUNT } from '../types/refTypes.action.types'
import { TaskTypeSchema } from '../types/refTypes.data.types'

const mapStateToProps = ({ refTypes }: GlobalState) => {
  return {
    taskTypesList: refTypes.taskType,
  }
}

const mapDispatchToProps = {
  getTaskTypes: () => getRefType(REF_TYPES_REGISTRY.TASK_TYPE),
  addTaskType: (name: string, description: string) => addRefType(REF_TYPES_REGISTRY.TASK_TYPE, name, description),
  editTaskType: (id: number, name: string, description: string) =>
    editRefType(REF_TYPES_REGISTRY.TASK_TYPE, id, name, description),
  deleteTaskType: (id: number) => deleteRefType(REF_TYPES_REGISTRY.TASK_TYPE, id),
  unmountPage: () => unmountPage(TASK_TYPE_UNMOUNT),
}

interface TaskTypesProps {
  taskTypesList: TaskTypeSchema[]
  getTaskTypes: () => void
  addTaskType: (name: string, description: string) => void
  editTaskType: (id: number, name: string, description: string) => void
  deleteTaskType: (id: number) => void
  unmountPage: () => void
}

const TaskTypes = (props: TaskTypesProps): React.ReactElement => {
  const { unmountPage } = props

  useEffect(() => {
    return () => {
      unmountPage()
    }
  }, [unmountPage])

  const refTypes = () => (
    <RefTypes
      refTypeId="task_type"
      refTypeName="Task Type"
      refTypesList={props.taskTypesList}
      getRefTypes={props.getTaskTypes}
      addRefType={props.addTaskType}
      editRefType={props.editTaskType}
      deleteRefType={props.deleteTaskType}
    />
  )

  return <>{refTypes()}</>
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskTypes)
