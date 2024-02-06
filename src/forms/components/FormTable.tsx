import Button from '@mui/material/Button'
import React from 'react'

import { convertDateToLocaleString, Link, Table, TableData, TableHeaderData } from '../../app'
import { CourtCaseSchema } from '../../cases'
import {
  ACTION_ADD,
  ACTION_DELETE,
  ACTION_UPDATE,
  BUTTON_DELETE,
  BUTTON_UPDATE,
  ID_ACTION_BUTTON,
  ID_DEFAULT,
} from '../../constants'
import { FormSchema } from '../types/forms.data.types'

interface FormTableProps {
  formsList: FormSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedForm?: (form: FormSchema) => void
  setSelectedFormForReset?: (form: FormSchema) => void
  courtCasesList: CourtCaseSchema[]
}

const FormTable = (props: FormTableProps): React.ReactElement => {
  const { formsList, courtCasesList } = props
  const { setModal, setSelectedId, setSelectedForm, setSelectedFormForReset } = props

  const formsTableHeaderData = (): TableHeaderData[] => {
    return [
      {
        id: 'clientCase',
        label: 'Client Case',
      },
      {
        id: 'type',
        label: 'Type',
      },
      {
        id: 'submit',
        label: 'Submit Date',
      },
      {
        id: 'receipt',
        label: 'Receipt Date',
      },
      {
        id: 'receiptNumber',
        label: 'Receipt Number',
      },
      {
        id: 'priority',
        label: 'Priority Date',
      },
      {
        id: 'rfe',
        label: 'RFE Date',
      },
      {
        id: 'rfeSubmit',
        label: 'RFE Submit Date',
      },
      {
        id: 'decision',
        label: 'Decision Date',
      },
      {
        id: 'status',
        label: 'Status',
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'center' as const,
        isDisableSorting: true,
      },
    ]
  }

  const actionButtons = (id: number, form: FormSchema) => (
    <>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_UPDATE)
          setSelectedId && setSelectedId(id)
          setSelectedForm && setSelectedForm(form)
          setSelectedFormForReset && setSelectedFormForReset(form)
        }}
      >
        {BUTTON_UPDATE}
      </Button>
      <Button
        onClick={() => {
          setModal && setModal(ACTION_DELETE)
          setSelectedId && setSelectedId(id)
          setSelectedForm && setSelectedForm(form)
        }}
      >
        {BUTTON_DELETE}
      </Button>
    </>
  )

  const linkToForm = (clientName: string, caseTypeName: string, formId: number) => (
    <Link text={`${clientName}, ${caseTypeName}`} navigateToPage={`/form/${formId}`} />
  )

  const getClientCase = (x: FormSchema) => {
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    return linkToForm(courtCase?.client?.name || 'Client', courtCase?.caseType?.name || 'Type', x.id || ID_DEFAULT)
  }

  const formsTableDataCommon = (x: FormSchema) => {
    return {
      clientCase: getClientCase(x),
      type: x.formType?.name,
      submit: convertDateToLocaleString(x.submitDate),
      receipt: convertDateToLocaleString(x.receiptDate),
      receiptNumber: x.receiptNumber,
      priority: convertDateToLocaleString(x.priorityDate),
      rfe: convertDateToLocaleString(x.rfeDate),
      rfeSubmit: convertDateToLocaleString(x.rfeSubmitDate),
      decision: convertDateToLocaleString(x.decisionDate),
      status: x.status,
    }
  }

  const formsTableData = (): TableData[] => {
    return Array.from(formsList, (x) => {
      return {
        ...formsTableDataCommon(x),
        actions: actionButtons(x.id || ID_ACTION_BUTTON, x),
      }
    })
  }

  const addButton = () => <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Form</Button>

  return (
    <Table
      componentName="Form"
      headerData={formsTableHeaderData()}
      tableData={formsTableData()}
      addModelComponent={addButton()}
    />
  )
}

export default FormTable
