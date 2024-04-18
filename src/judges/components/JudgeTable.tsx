import OpenInNew from '@mui/icons-material/OpenInNew'
import React from 'react'

import { tableAddButtonComponent } from '@app/components/CommonComponents'
import Link from '@app/components/Link'
import Table from '@app/components/Table'
import { ModalState, TableData, TableHeaderData } from '@app/types/app.data.types'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ACTION_TYPES, COMPONENT_STATUS_NAME } from '@constants/index'
import { CourtFormData, CourtSchema } from '@courts/types/courts.data.types'
import { ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

import { JudgeFormData, JudgeSchema } from '../types/judges.data.types'
import { getJudgeFormDataFromSchema } from '../utils/judges.utils'

interface JudgeTableProps {
  judgesList: JudgeSchema[]
  actionButtons?: (formDataForModal: JudgeFormData) => React.JSX.Element
  addModalState?: ModalState
  softDeleteCallback?: (requestMetadata: Partial<FetchRequestMetadata>) => void
  selectedCourt?: CourtSchema | CourtFormData
  componentStatusList: ComponentStatusSchema[]
}

const JudgeTable = (props: JudgeTableProps): React.ReactElement => {
  const { judgesList, actionButtons, addModalState, softDeleteCallback } = props
  const { selectedCourt, componentStatusList } = props

  const judgesTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'name',
        label: 'NAME',
      },
      {
        id: 'court',
        label: 'COURT',
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
      (checkUserHasPermission(COMPONENT_STATUS_NAME.JUDGES, ACTION_TYPES.UPDATE) ||
        checkUserHasPermission(COMPONENT_STATUS_NAME.JUDGES, ACTION_TYPES.DELETE)) &&
      !selectedCourt
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
    webex ? <Link text="" icon={<OpenInNew />} href={webex} target="_blank" /> : ''

  const linkToCourt = (x?: CourtSchema) =>
    selectedCourt ? (
      selectedCourt.name
    ) : (
      <Link text={`${x?.name}, ${x?.state}`} navigateToPage={`/court/${x?.id}?backTo=${window.location.pathname}`} />
    )

  const linkToJudge = (x: JudgeSchema) => <Link text={x.name} navigateToPage={`/judge/${x.id}`} />

  const getComponentStatus = (x: JudgeSchema) => {
    if (x.componentStatus) {
      return x.componentStatus.statusName
    } else {
      const componentStatus = componentStatusList.find((y) => y.id === x.componentStatusId)
      return componentStatus?.statusName
    }
  }

  const judgesTableData = (): TableData[] => {
    return Array.from(judgesList, (x) => {
      return {
        name: linkToJudge(x),
        court: linkToCourt(x.court),
        webex: linkToWebex(x.webex),
        status: getComponentStatus(x),
        isDeleted: x.isDeleted,
        actions: actionButtons ? actionButtons(getJudgeFormDataFromSchema(x)) : undefined,
      }
    })
  }

  return (
    <Table
      componentName={COMPONENT_STATUS_NAME.JUDGES}
      headerData={judgesTableHeaderData()}
      tableData={judgesTableData()}
      addModelComponent={tableAddButtonComponent(
        COMPONENT_STATUS_NAME.JUDGES,
        COMPONENT_STATUS_NAME.JUDGES,
        addModalState,
      )}
      getSoftDeletedCallback={() => (softDeleteCallback ? softDeleteCallback({ isIncludeDeleted: true }) : undefined)}
    />
  )
}

export default JudgeTable
