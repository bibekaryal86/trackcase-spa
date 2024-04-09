import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import { Dayjs } from 'dayjs'
import React from 'react'

import { handleFormChange, handleFormDateChange } from '@app/components/CommonComponents'
import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStatusField,
  FormTextField,
  GridFormWrapper,
} from '@app/components/FormFields'
import { CourtCaseFormData, CourtCaseSchema } from '@cases/types/courtCases.data.types'
import { ClientSchema } from '@clients/types/clients.data.types'
import { USE_MEDIA_QUERY_INPUT } from '@constants/index'
import { CollectionMethodSchema, ComponentStatusSchema } from '@ref_types/types/refTypes.data.types'

import {
  CaseCollectionFormData,
  CaseCollectionFormErrorData,
  CaseCollectionSchema,
  CashCollectionFormData,
  CashCollectionFormErrorData,
} from '../types/collections.data.types'
import { getAmountForDisplay } from '../utils/collections.utils'

interface CollectionFormPropsCase {
  formData: CaseCollectionFormData
  setFormData: (formData: CaseCollectionFormData) => void
  formErrors: CaseCollectionFormErrorData
  setFormErrors: (formErrors: CaseCollectionFormErrorData) => void
  courtCasesList: CourtCaseSchema[]
  collectionStatusList: ComponentStatusSchema[]
  isShowOneCollection: boolean
  selectedCourtCase?: CourtCaseFormData
}

interface CollectionFormPropsCash {
  formData: CashCollectionFormData
  setFormData: (formData: CashCollectionFormData) => void
  formErrors: CashCollectionFormErrorData
  setFormErrors: (formErrors: CashCollectionFormErrorData) => void
  collectionMethodsList: CollectionMethodSchema[]
  courtCasesList: CourtCaseSchema[]
  clientsList: ClientSchema[]
  caseCollectionList: CaseCollectionSchema[]
  minCollectionDate: Dayjs
  maxCollectionDate: Dayjs
  isShowOneCollection: boolean
  selectedCourtCase?: CourtCaseFormData
}

export const CollectionFormCase = (props: CollectionFormPropsCase): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, setFormData, formErrors, setFormErrors } = props
  const { courtCasesList, collectionStatusList } = props
  const { isShowOneCollection } = props
  const { selectedCourtCase } = props

  const caseCollectionQuoteAmount = () => {
    return (
      // eslint-disable-next-line react/jsx-no-undef
      <FormTextField
        componentLabel="CASE COLLECTION--QUOTE AMOUNT"
        name="quoteAmount"
        value={getAmountForDisplay(formData.quoteAmount)}
        maxLength={5}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.quoteAmountError}
        helperText={formErrors.quoteAmountError}
        required
        fullWidth
      />
    )
  }

  const caseCollectionCourtCasesListForSelect = () => {
    if (selectedCourtCase) {
      return [
        <MenuItem key={selectedCourtCase.id} value={selectedCourtCase.id}>
          {selectedCourtCase.client?.name}, {selectedCourtCase.caseType?.name}
        </MenuItem>,
      ]
    }
    return courtCasesList
      .filter((x) => formData.courtCaseId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.client?.name}, {x.caseType?.name}
        </MenuItem>
      ))
  }

  const caseCollectionCourtCasesList = () => {
    return (
      <FormSelectField
        componentLabel="CASE COLLECTION--COURT CASE"
        name="courtCaseId"
        value={formData.courtCaseId}
        menuItems={caseCollectionCourtCasesListForSelect()}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.courtCaseError}
        helperText={formErrors.courtCaseError}
        required
        disabled={!!selectedCourtCase}
      />
    )
  }

  const caseCollectionStatus = () => (
    <FormSelectStatusField
      componentLabel="CASE COLLECTION--STATUS"
      value={formData.componentStatusId}
      onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      statusList={collectionStatusList}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
    />
  )

  const caseCollectionComments = () => {
    return (
      <FormCommentsField
        componentLabel="CASE COLLECTION--COMMENTS"
        value={formData.comments}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      />
    )
  }

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneCollection}
      justifyContent={isShowOneCollection ? 'flex-start' : 'flex-end'}
    >
      <Grid item xs={6}>
        {caseCollectionCourtCasesList()}
      </Grid>
      <Grid item xs={6}>
        {caseCollectionQuoteAmount()}
      </Grid>
      <Grid item xs={6}>
        {caseCollectionStatus()}
      </Grid>
      <Grid item xs={12}>
        {caseCollectionComments()}
      </Grid>
    </GridFormWrapper>
  )
}

export const CollectionFormCash = (props: CollectionFormPropsCash): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, setFormData, formErrors, setFormErrors } = props
  const { collectionMethodsList, courtCasesList, clientsList, caseCollectionList } = props
  const { minCollectionDate, maxCollectionDate, isShowOneCollection } = props
  const { selectedCourtCase } = props

  const cashCollectionCollectionDate = () => {
    return (
      <FormDatePickerField
        componentLabel="CASH COLLECTION--COLLECTION DATE"
        name="collectionDate"
        value={formData.collectionDate}
        onChange={(value) =>
          handleFormDateChange('collectionDate', value, formData, formErrors, setFormData, setFormErrors)
        }
        minDate={minCollectionDate}
        maxDate={maxCollectionDate}
        helperText={formErrors.collectionDateError}
        required
      />
    )
  }

  const cashCollectionCollectedAmount = () => {
    return (
      <FormTextField
        componentLabel="CASH COLLECTION--COLLECTED AMOUNT"
        name="collectedAmount"
        value={getAmountForDisplay(formData.collectedAmount)}
        maxLength={5}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.collectedAmountError}
        helperText={formErrors.collectedAmountError}
        required
        fullWidth
      />
    )
  }

  const cashCollectionWaivedAmount = () => {
    return (
      <FormTextField
        componentLabel="CASH COLLECTION--WAIVED AMOUNT"
        name="waivedAmount"
        value={getAmountForDisplay(formData.waivedAmount)}
        maxLength={5}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.waivedAmountError}
        helperText={formErrors.waivedAmountError}
        required
        fullWidth
      />
    )
  }

  const cashCollectionMemo = () => {
    return (
      <FormTextField
        componentLabel="CASH COLLECTION--MEMO"
        name="memo"
        value={formData.memo}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.memo}
        helperText={formErrors.memo}
        required
        fullWidth
      />
    )
  }

  const cashCollectionCollectionMethodsListForSelect = () =>
    collectionMethodsList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const cashCollectionCollectionMethodsList = () => {
    return (
      <FormSelectField
        componentLabel="CASH COLLECTION--COLLECTION METHOD"
        name="collectionMethodId"
        value={formData.collectionMethodId}
        menuItems={cashCollectionCollectionMethodsListForSelect()}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.collectionMethodError}
        helperText={formErrors.collectionMethodError}
        required
      />
    )
  }

  const cashCollectionCaseCollectionForSelect = (x: CaseCollectionSchema) => {
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    const client = clientsList.find((y) => courtCase?.clientId === y.id)
    return `${client?.name}, ${courtCase?.caseType?.name}`
  }

  const cashCollectionCaseCollectionListForSelect = () => {
    if (selectedCourtCase && selectedCourtCase.caseCollections) {
      return selectedCourtCase.caseCollections
        .filter((x) => formData.caseCollectionId === x.id || x.componentStatus?.isActive)
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {cashCollectionCaseCollectionForSelect(x)}
          </MenuItem>
        ))
    }
    return caseCollectionList
      .filter((x) => formData.caseCollectionId === x.id || x.componentStatus?.isActive)
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {cashCollectionCaseCollectionForSelect(x)}
        </MenuItem>
      ))
  }

  const cashCollectionCaseCollectionList = () => {
    return (
      <FormSelectField
        componentLabel="CASH COLLECTION--CASE COLLECTION"
        name="caseCollectionId"
        value={formData.caseCollectionId}
        menuItems={cashCollectionCaseCollectionListForSelect()}
        onChange={(event) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
        error={!!formErrors.caseCollectionError}
        helperText={formErrors.caseCollectionError}
        required
        disabled={!!selectedCourtCase}
      />
    )
  }

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneCollection}
      justifyContent={isShowOneCollection ? 'flex-start' : 'flex-end'}
    >
      <Grid item xs={6}>
        {cashCollectionCaseCollectionList()}
      </Grid>
      <Grid item xs={6}>
        {cashCollectionCollectionDate()}
      </Grid>
      <Grid item xs={6}>
        {cashCollectionCollectedAmount()}
      </Grid>
      <Grid item xs={6}>
        {cashCollectionCollectionMethodsList()}
      </Grid>
      <Grid item xs={6}>
        {cashCollectionWaivedAmount()}
      </Grid>
      <Grid item xs={12}>
        {cashCollectionMemo()}
      </Grid>
    </GridFormWrapper>
  )
}
