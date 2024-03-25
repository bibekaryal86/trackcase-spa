import React from 'react'

import {
  FetchRequestMetadata,
  getFullAddress,
  Link,
  ModalState,
  Table,
  tableAddButtonComponent,
  TableData,
  TableHeaderData,
} from '../../app'
import { ACTION_TYPES, COMPONENT_STATUS_NAME, ID_DEFAULT } from '../../constants'
import { checkUserHasPermission, isSuperuser } from '../../users'
import { CourtFormData, CourtSchema } from '../types/courts.data.types'

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

  const linkToCourt = (x: CourtSchema) => <Link text={`${x.name}, ${x.state}`} navigateToPage={`/court/${x.id}`} />

  const getCourtFormDataForModal = (x: CourtSchema): CourtFormData => {
    return {
      id: x.id || ID_DEFAULT,
      name: x.name,
      componentStatusId: x.componentStatusId,
      streetAddress: x.streetAddress,
      city: x.city,
      state: x.state,
      zipCode: x.zipCode,
      phoneNumber: x.phoneNumber,
      dhsAddress: x.dhsAddress,
      comments: x.comments,
      isHardDelete: false,
      isShowSoftDeleted: false,
      isDeleted: x.isDeleted,
    }
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
        actions: actionButtons(getCourtFormDataForModal(x)),
      }
    })
  }

  return (
    <Table
      componentName={COMPONENT_STATUS_NAME.COURTS}
      headerData={courtsTableHeaderData()}
      tableData={courtsTableData()}
      addModelComponent={tableAddButtonComponent(COMPONENT_STATUS_NAME.COURTS, addModalState)}
      getSoftDeletedCallback={() => softDeleteCallback({ isIncludeDeleted: true })}
    />
  )
}

export default CourtTable
