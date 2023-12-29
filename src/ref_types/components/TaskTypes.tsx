import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import RefTypes from './RefTypes'
import { GlobalState, unmountPage } from '../../app'
import { addTaskType, deleteTaskType, editTaskType, getTaskTypes } from '../actions/task_types.action'
import { TASK_TYPES_UNMOUNT } from '../types/ref_types.action.types'
import { TaskTypeSchema } from '../types/ref_types.data.types'

const mapStateToProps = ({ taskTypes }: GlobalState) => {
  return {
    taskTypesList: taskTypes.task_types,
  }
}

const mapDispatchToProps = {
  getTaskTypes: () => getTaskTypes(),
  addTaskType: (name: string, description: string) => addTaskType(name, description),
  editTaskType: (id: number, name: string, description: string) => editTaskType(id, name, description),
  deleteTaskType: (id: number) => deleteTaskType(id),
  unmountPage: () => unmountPage(TASK_TYPES_UNMOUNT),
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
