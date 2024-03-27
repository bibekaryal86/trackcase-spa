import React from 'react'

import {
  FetchRequestMetadata,
  Link,
  ModalState,
  Table,
  tableAddButtonComponent,
  TableData,
  TableHeaderData,
} from '../../app'
import { ACTION_TYPES, COMPONENT_STATUS_NAME } from '../../constants'
import { CourtSchema } from '../../courts'
import { checkUserHasPermission, isSuperuser } from '../../users'
import { JudgeFormData, JudgeSchema } from '../types/judges.data.types'
import { getJudgeFormDataFromSchema } from '../utils/judges.utils'

interface JudgeTableProps {
  judgesList: JudgeSchema[]
  actionButtons: (formDataForModal: JudgeFormData) => React.JSX.Element
  addModalState: ModalState
  softDeleteCallback: (requestMetadata: Partial<FetchRequestMetadata>) => void
  selectedCourt?: CourtSchema
}

const JudgeTable = (props: JudgeTableProps): React.ReactElement => {
  const { judgesList, actionButtons, addModalState, softDeleteCallback } = props
  const { selectedCourt } = props

  const judgesTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'name',
        label: 'NAME',
      },
      {
        id: 'court',
        label: 'Court',
      },
      {
        id: 'webex',
        label: 'WEBEX',
        isDisableSorting: true,
      },
      {
        id: 'status',
        label: 'STATUS',
      },
    ]
    if (isSuperuser()) {
      tableHeaderData.push({
        id: 'isDeleted',
        label: 'IS DELETED?',
      })
    }
    if (
      checkUserHasPermission(COMPONENT_STATUS_NAME.JUDGES, ACTION_TYPES.UPDATE) ||
      checkUserHasPermission(COMPONENT_STATUS_NAME.JUDGES, ACTION_TYPES.DELETE)
    ) {
      tableHeaderData.push({
        id: 'actions',
        label: 'ACTIONS',
        isDisableSorting: true,
        align: 'center' as const,
      })
    }

    return tableHeaderData
  }

  const linkToWebex = (webex?: string) =>
    webex ? <Link text={webex} href={webex.toLowerCase()} target="_blank" /> : ''

  const linkToCourt = (x?: CourtSchema) =>
    selectedCourt ? (
      selectedCourt.name
    ) : (
      <Link text={`${x?.name}, ${x?.state}`} navigateToPage={`/court/${x?.id}?backTo=${window.location.pathname}`} />
    )

  const linkToJudge = (x: JudgeSchema) => <Link text={x.name} navigateToPage={`/judge/${x.id}`} />

  const judgesTableData = (): TableData[] => {
    return Array.from(judgesList, (x) => {
      return {
        name: linkToJudge(x),
        court: linkToCourt(x.court),
        webex: linkToWebex(x.webex),
        status: x.componentStatus?.statusName,
        isDeleted: x.isDeleted,
        actions: actionButtons(getJudgeFormDataFromSchema(x)),
      }
    })
  }

  return (
    <Table
      componentName={COMPONENT_STATUS_NAME.JUDGES}
      headerData={judgesTableHeaderData()}
      tableData={judgesTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.JUDGES, addModalState)}
      getSoftDeletedCallback={() => softDeleteCallback({ isIncludeDeleted: true })}
    />
  )
}

export default JudgeTable
