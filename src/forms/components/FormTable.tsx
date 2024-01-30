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
import { FormSchema, HistoryFormSchema } from '../types/forms.data.types'

interface FormTableProps {
  isHistoryView: boolean
  formsList: FormSchema[]
  historyFormsList: HistoryFormSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedForm?: (form: FormSchema) => void
  setSelectedFormForReset?: (form: FormSchema) => void
  courtCasesList: CourtCaseSchema[]
}

const FormTable = (props: FormTableProps): React.ReactElement => {
  const { isHistoryView, formsList, historyFormsList, courtCasesList } = props
  const { setModal, setSelectedId, setSelectedForm, setSelectedFormForReset } = props

  const formsTableHeaderData = (): TableHeaderData[] => {
    const tableHeaderData: TableHeaderData[] = [
      {
        id: 'clientCase',
        label: 'Client Case',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'type',
        label: 'Type',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'submit',
        label: 'Submit Date',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'receipt',
        label: 'Receipt Date',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'receiptNumber',
        label: 'Receipt Number',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'priority',
        label: 'Priority Date',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'rfe',
        label: 'RFE Date',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'rfeSubmit',
        label: 'RFE Submit Date',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'decision',
        label: 'Decision Date',
        isDisableSorting: isHistoryView,
      },
      {
        id: 'task',
        label: 'Task Calendar',
        isDisableSorting: true,
      },
      {
        id: 'status',
        label: 'Status',
        isDisableSorting: isHistoryView,
      },
    ]
    if (isHistoryView) {
      tableHeaderData.push(
        {
          id: 'user_name',
          label: 'User',
          isDisableSorting: true,
        },
        {
          id: 'date',
          label: 'Date (UTC)',
          isDisableSorting: true,
        },
      )
    } else {
      tableHeaderData.push({
        id: 'actions',
        label: 'Actions',
        align: 'center' as const,
        isDisableSorting: true,
      })
    }
    return tableHeaderData
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

  const getClientCase = (x: FormSchema | HistoryFormSchema) => {
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    return isHistoryView
      ? `${courtCase?.client?.name}, ${courtCase?.caseType?.name}`
      : linkToForm(courtCase?.client?.name || 'Client', courtCase?.caseType?.name || 'Type', x.id || ID_DEFAULT)
  }

  const formsTableDataCommon = (x: FormSchema | HistoryFormSchema) => {
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
      task: x.taskCalendar?.taskType?.name,
      status: x.status,
    }
  }

  const formsTableData = (): TableData[] => {
    let tableData: TableData[]
    if (isHistoryView) {
      tableData = Array.from(historyFormsList, (x) => {
        return {
          ...formsTableDataCommon(x),
          user: x.userName,
          date: convertDateToLocaleString(x.created),
        }
      })
    } else {
      tableData = Array.from(formsList, (x) => {
        return {
          ...formsTableDataCommon(x),
          action: actionButtons(x.id || ID_ACTION_BUTTON, x),
        }
      })
    }
    return tableData
  }

  const addButton = () =>
    isHistoryView ? undefined : <Button onClick={() => setModal && setModal(ACTION_ADD)}>Add New Form</Button>

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
