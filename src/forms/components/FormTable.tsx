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
} from '../../constants'
import { FormTypeSchema } from '../../types'
import { FormSchema } from '../types/forms.data.types'

interface FormTableProps {
  formsList: FormSchema[]
  setModal?: (action: string) => void
  setSelectedId?: (id: number) => void
  setSelectedForm?: (form: FormSchema) => void
  setSelectedFormForReset?: (form: FormSchema) => void
  courtCasesList: CourtCaseSchema[]
  selectedCourtCase?: CourtCaseSchema
  formTypesList: FormTypeSchema[]
}

const FormTable = (props: FormTableProps): React.ReactElement => {
  const { formsList, courtCasesList, selectedCourtCase, formTypesList } = props
  const { setModal, setSelectedId, setSelectedForm, setSelectedFormForReset } = props

  const formsTableHeaderData = (): TableHeaderData[] => {
    return [
      {
        id: 'type',
        label: 'Form',
      },
      {
        id: 'clientCase',
        label: 'Client Case',
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

  const linkToForm = (x: FormSchema) => {
    let formType = x.formType
    if (!formType) {
      formType = formTypesList.find((y) => x.formTypeId === y.id)
    }
    return <Link text={formType?.name} navigateToPage={`/form/${x.id}`} />
  }

  const linkToCourtCase = (x: FormSchema) => {
    if (selectedCourtCase) {
      return `${selectedCourtCase?.client?.name}, ${selectedCourtCase?.caseType?.name}`
    }
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    return (
      <Link
        text={`${courtCase?.client?.name}, ${courtCase?.caseType?.name}`}
        navigateToPage={`/court_case/${x.id}?backTo=${window.location.pathname}&prevPage=Forms`}
      />
    )
  }

  const formsTableDataCommon = (x: FormSchema) => {
    return {
      type: linkToForm(x),
      clientCase: linkToCourtCase(x),
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
