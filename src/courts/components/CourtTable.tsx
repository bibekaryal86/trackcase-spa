import OpenInNew from '@mui/icons-material/OpenInNew'
import React from 'react'

import { tableAddButtonComponent } from '@app/components/CommonComponents'
import Link from '@app/components/Link'
import Table from '@app/components/Table'
import { ModalState, TableData, TableHeaderData } from '@app/types/app.data.types'
import { getFullAddress } from '@app/utils/app.utils'
import { FetchRequestMetadata } from '@app/utils/fetch.utils'
import { ACTION_TYPES, COMPONENT_STATUS_NAME } from '@constants/index'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

import { CourtFormData, CourtSchema } from '../types/courts.data.types'
import { getCourtFormDataFromSchema } from '../utils/courts.utils'

interface CourtTableProps {
  courtsList: CourtSchema[]
  actionButtons: (formDataForModal: CourtFormData) => React.JSX.Element
  addModalState: ModalState
  softDeleteCallback: (requestMetadata: Partial<FetchRequestMetadata>) => void
}

const CourtTable = (props: CourtTableProps): React.ReactElement => {
  const { courtsList, actionButtons, addModalState, softDeleteCallback } = props

  const courtsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'name',
        label: 'NAME',
      },
      {
        id: 'address',
        label: 'ADDRESS',
        isDisableSorting: true,
      },
      {
        id: 'phone',
        label: 'PHONE',
        isDisableSorting: true,
      },
      {
        id: 'dhsAddress',
        label: 'DHS ADDRESS',
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
      checkUserHasPermission(COMPONENT_STATUS_NAME.COURTS, ACTION_TYPES.UPDATE) ||
      checkUserHasPermission(COMPONENT_STATUS_NAME.COURTS, ACTION_TYPES.DELETE)
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

  const linkToCourt = (x: CourtSchema) => {
    return (
      <>
        <Link text={`${x.name}, ${x.state}`} navigateToPage={`/court/${x.id}`} />
        {'  '}
        <Link text="" icon={<OpenInNew fontSize="small" />} href={x.courtUrl} target="_blank" />
      </>
    )
  }

  const courtsTableData = (): TableData[] => {
    return Array.from(courtsList, (x) => {
      return {
        name: linkToCourt(x),
        address: getFullAddress(x.streetAddress, x.city, x.state, x.zipCode),
        phone: x.phoneNumber,
        dhsAddress: x.dhsAddress,
        status: x.componentStatus?.statusName,
        isDeleted: x.isDeleted,
        actions: actionButtons(getCourtFormDataFromSchema(x)),
      }
    })
  }

  return (
    <Table
      componentName={COMPONENT_STATUS_NAME.COURTS}
      headerData={courtsTableHeaderData()}
      tableData={courtsTableData()}
      addModelComponent={tableAddButtonComponent(
        COMPONENT_STATUS_NAME.COURTS,
        COMPONENT_STATUS_NAME.COURTS,
        addModalState,
      )}
      getSoftDeletedCallback={() => softDeleteCallback({ isIncludeDeleted: true })}
    />
  )
}

export default CourtTable
