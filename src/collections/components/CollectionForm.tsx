import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import { Dayjs } from 'dayjs'
import React from 'react'

import {
  FormCommentsField,
  FormDatePickerField,
  FormSelectField,
  FormSelectStatusField,
  FormTextField,
  getComments,
  getNumber,
  getString,
  GridFormWrapper,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ClientSchema } from '../../clients'
import { ID_LIST, USE_MEDIA_QUERY_INPUT } from '../../constants'
import { CollectionMethodSchema } from '../../types'
import { CaseCollectionSchema, CashCollectionSchema } from '../types/collections.data.types'
import {
  handleCollectionDateOnChange,
  handleCollectionFormOnChange,
  isCaseCollection,
  isCollectionFormFieldError,
} from '../utils/collections.utils'

interface CollectionFormProps {
  collectionType: string
  selectedCollection: CaseCollectionSchema | CashCollectionSchema
  setSelectedCollection: (collection: CaseCollectionSchema | CashCollectionSchema) => void
  collectionMethodsList: CollectionMethodSchema[]
  courtCasesList: CourtCaseSchema[]
  clientsList: ClientSchema[]
  caseCollectionList: CaseCollectionSchema[]
  collectionStatusList: string[]
  isShowOneCollection: boolean
  minCollectionDate: Dayjs
  maxCollectionDate: Dayjs
}

const CollectionForm = (props: CollectionFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { collectionType, selectedCollection, setSelectedCollection, isShowOneCollection } = props
  const { collectionMethodsList, courtCasesList, caseCollectionList, clientsList, collectionStatusList } = props
  const { minCollectionDate, maxCollectionDate } = props
  const isCaseCollectionForm = isCaseCollection(collectionType)

  const collectionDate = () => {
    const label = isCaseCollectionForm ? 'Case Collection--Quote Date' : 'Cash Collection--Collection Date'
    const value =
      isCaseCollectionForm && 'quoteDate' in selectedCollection
        ? selectedCollection.quoteDate
        : !isCaseCollectionForm && 'collectionDate' in selectedCollection
        ? selectedCollection.collectionDate
        : undefined
    const name = isCaseCollectionForm ? 'quoteDate' : 'collectionDate'
    return (
      <FormDatePickerField
        componentLabel={label}
        value={value}
        onChange={(newValue) => handleCollectionDateOnChange(name, newValue, selectedCollection, setSelectedCollection)}
        minDate={minCollectionDate}
        maxDate={maxCollectionDate}
        required
      />
    )
  }

  const collectionAmount = () => {
    let label: string
    let value: number | undefined
    let name: string
    let error: boolean
    if (isCaseCollectionForm) {
      const caseCollection = selectedCollection as CaseCollectionSchema
      label = 'Case Collection--Quote Amount'
      value = getNumber(caseCollection.quoteAmount) <= 0 ? undefined : caseCollection.quoteAmount
      name = 'quoteAmount'
      error = isCollectionFormFieldError(name, value, undefined)
    } else {
      const cashCollection = selectedCollection as CashCollectionSchema
      label = 'Cash Collection--Collected Amount'
      value = getNumber(cashCollection.collectedAmount) <= 0 ? undefined : cashCollection.collectedAmount
      name = 'collectedAmount'
      error = isCollectionFormFieldError(name, value, undefined)
    }
    return (
      <FormTextField
        componentLabel={label}
        maxLength={8}
        value={value ? String(value) : undefined}
        onChange={(e) =>
          handleCollectionFormOnChange(name, e.target.value, selectedCollection, setSelectedCollection, getNumber)
        }
        error={error}
        required
      />
    )
  }

  const collectionWaivedAmount = () => {
    const value =
      !isCaseCollectionForm && 'waivedAmount' in selectedCollection ? getNumber(selectedCollection.waivedAmount) <= 0 ? undefined : selectedCollection.waivedAmount : undefined
    return (
      <FormTextField
        componentLabel="Cash Collection--Waived Amount"
        maxLength={8}
        value={value ? String(value) : undefined}
        onChange={(e) =>
          handleCollectionFormOnChange(
            'waivedAmount',
            e.target.value,
            selectedCollection,
            setSelectedCollection,
            getNumber,
          )
        }
        error={isCollectionFormFieldError('waivedAmount', value, undefined)}
        required
      />
    )
  }

  const collectionMemo = () => {
    const value = !isCaseCollectionForm && 'memo' in selectedCollection ? selectedCollection.memo : undefined
    return (
      <FormTextField
        componentLabel="Cash Collection--Memo"
        value={value}
        onChange={(e) =>
          handleCollectionFormOnChange('memo', e.target.value, selectedCollection, setSelectedCollection, getString)
        }
        error={isCollectionFormFieldError('memo', value, undefined)}
        required
      />
    )
  }

  const collectionStatus = () => (
    <FormSelectStatusField
      componentLabel="Collection--Status"
      value={selectedCollection.status}
      onChange={(e) =>
        handleCollectionFormOnChange('status', e.target.value, selectedCollection, setSelectedCollection, getString)
      }
      statusList={collectionStatusList}
      error={isCollectionFormFieldError('status', selectedCollection.status, undefined)}
    />
  )

  const collectionComments = () => (
    <FormCommentsField
      componentLabel="Collection--Comments"
      value={selectedCollection.comments}
      onChange={(e) =>
        handleCollectionFormOnChange('comments', e.target.value, selectedCollection, setSelectedCollection, getComments)
      }
    />
  )

  const collectionCourtCasesListForSelect = () =>
    courtCasesList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.client?.name}, {x.caseType?.name}
      </MenuItem>
    ))

  const collectionCourtCasesList = () => {
    const value = 'courtCaseId' in selectedCollection ? selectedCollection.courtCaseId : ID_LIST
    return (
      <FormSelectField
        componentLabel="Case Collection--Court Case"
        value={value}
        onChange={(e) =>
          handleCollectionFormOnChange(
            'courtCaseId',
            e.target.value,
            selectedCollection,
            setSelectedCollection,
            getNumber,
          )
        }
        menuItems={collectionCourtCasesListForSelect()}
        error={isCollectionFormFieldError('courtCaseId', value, undefined)}
        required
      />
    )
  }

  const collectionCollectionMethodsListForSelect = () =>
    collectionMethodsList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const collectionCollectionMethodsList = () => {
    const value = 'collectionMethodId' in selectedCollection ? selectedCollection.collectionMethodId : ID_LIST
    return (
      <FormSelectField
        componentLabel="Cash Collection--Collection Method"
        value={value}
        onChange={(e) =>
          handleCollectionFormOnChange(
            'collectionMethodId',
            e.target.value,
            selectedCollection,
            setSelectedCollection,
            getNumber,
          )
        }
        menuItems={collectionCollectionMethodsListForSelect()}
        error={isCollectionFormFieldError('collectionMethodId', value, undefined)}
        required
      />
    )
  }

  const collectionCaseCollectionForSelect = (x: CaseCollectionSchema) => {
    const courtCase = courtCasesList.find((y) => x.courtCaseId === y.id)
    const client = clientsList.find((y) => courtCase?.clientId === y.id)
    return `${client?.name}, ${courtCase?.caseType?.name}`
  }

  const collectionCaseCollectionListForSelect = () =>
    caseCollectionList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {collectionCaseCollectionForSelect(x)}
      </MenuItem>
    ))

  const collectionCaseCollectionList = () => {
    const value = 'caseCollectionId' in selectedCollection ? selectedCollection.caseCollectionId : ID_LIST
    return (
      <FormSelectField
        componentLabel="Cash Collection--Case Collection"
        value={value}
        onChange={(e) =>
          handleCollectionFormOnChange(
            'caseCollectionId',
            e.target.value,
            selectedCollection,
            setSelectedCollection,
            getNumber,
          )
        }
        menuItems={collectionCaseCollectionListForSelect()}
        error={isCollectionFormFieldError('caseCollectionId', value, undefined)}
        required
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
        {collectionDate()}
      </Grid>
      <Grid item xs={6}>
        {collectionAmount()}
      </Grid>
      {isCaseCollectionForm ? (
        <Grid item xs={6}>
          {collectionCourtCasesList()}
        </Grid>
      ) : (
        <>
          <Grid item xs={6}>
            {collectionCaseCollectionList()}
          </Grid>
          <Grid item xs={6}>
            {collectionCollectionMethodsList()}
          </Grid>
          <Grid item xs={6}>
            {collectionWaivedAmount()}
          </Grid>
          <Grid item xs={6}>
            {collectionMemo()}
          </Grid>
        </>
      )}
      <Grid item xs={6}>
        {collectionStatus()}
      </Grid>
      <Grid item xs={12}>
        {collectionComments()}
      </Grid>
    </GridFormWrapper>
  )
}

export default CollectionForm
