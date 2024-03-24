import React from 'react'

import {
  FetchRequestMetadata,
  getFullAddress,
  getNumber,
  TableData,
  TableHeaderData,
  validateAddress,
  validatePhoneNumber,
} from '../../app'
import { ACTION_TYPES, ID_DEFAULT } from '../../constants'
import { checkUserHasPermission, isSuperuser } from '../../users'
import { CourtFormData, CourtFormErrorData, CourtSchema, DefaultCourtFromErrorData } from '../types/courts.data.types'

export const validateCourt = (formData: CourtFormData, setFormErrors: (formErrors: CourtFormErrorData) => void) => {
  let hasValidationErrors = false
  const formErrorsLocal: CourtFormErrorData = { ...DefaultCourtFromErrorData }

  if (!formData.name.trim()) {
    hasValidationErrors = true
    formErrorsLocal.name = 'REQUIRED'
  }
  if (!validateAddress(formData.streetAddress, formData.city, formData.state, formData.zipCode, true)) {
    hasValidationErrors = true
    formErrorsLocal.streetAddress = 'INCOMPLETE ADDRESS'
  }
  if (!validatePhoneNumber(formData.phoneNumber)) {
    hasValidationErrors = true
    formErrorsLocal.phoneNumber = 'INCOMPLETE/INVALID'
  }
  if (getNumber(formData.componentStatusId) <= 0) {
    hasValidationErrors = true
    formErrorsLocal.componentStatusError = 'REQUIRED'
  }
  if (hasValidationErrors) {
    setFormErrors(formErrorsLocal)
  }
  return hasValidationErrors
}

export const courtDispatch = ({
  type = '',
  error = '',
  success = '',
  courts = [] as CourtSchema[],
  requestMetadata = {} as Partial<FetchRequestMetadata>,
} = {}) => {
  if (error) {
    return {
      type,
      error,
    }
  } else if (success) {
    return {
      type,
      success,
    }
  } else if (courts) {
    return {
      type,
      courts,
      requestMetadata,
    }
  } else {
    return {
      type,
    }
  }
}

export const courtsTableHeaderData = (): TableHeaderData[] => {
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
  if (checkUserHasPermission('COURTS', ACTION_TYPES.UPDATE) || checkUserHasPermission('COURTS', ACTION_TYPES.DELETE)) {
    tableHeaderData.push({
      id: 'actions',
      label: 'ACTIONS',
      align: 'center' as const,
    })
  }
  return tableHeaderData
}

const getCourtsFormDataForModal = (x: CourtSchema): CourtFormData => {
  return {
    ...x,
    id: x.id || ID_DEFAULT,
    isHardDelete: false,
    isShowSoftDeleted: false,
  }
}

export const courtsTableData = (
  courtsList: CourtSchema[],
  actionButtons: (formDataForModal: CourtFormData) => React.JSX.Element,
): TableData[] =>
  Array.from(courtsList, (x) => {
    return {
      name: x.name,
      address: getFullAddress(x.streetAddress, x.city, x.state, x.zipCode),
      phone: x.phoneNumber,
      dhsAddress: x.dhsAddress,
      status: x.componentStatus?.statusName,
      isDeleted: x.isDeleted,
      actions: actionButtons(getCourtsFormDataForModal(x)),
    }
  })
