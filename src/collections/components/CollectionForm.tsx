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
  StatusSchema,
} from '../../app'
import { CourtCaseSchema } from '../../cases'
import { ClientSchema } from '../../clients'
import { ID_DEFAULT, USE_MEDIA_QUERY_INPUT } from '../../constants'
import { CollectionMethodSchema } from '../../types'
import { CaseCollectionSchema, CashCollectionSchema } from '../types/collections.data.types'
import {
  getAmountForDisplay,
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
  courtCaseId?: string
  statusList: StatusSchema<string>
}

const CollectionForm = (props: CollectionFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { collectionType, selectedCollection, setSelectedCollection, isShowOneCollection } = props
  const { collectionMethodsList, courtCasesList, caseCollectionList, clientsList, collectionStatusList } = props
  const { courtCaseId, statusList } = props
  const { minCollectionDate, maxCollectionDate } = props
  const isCaseCollectionForm = isCaseCollection(collectionType)

  // case collection
  const caseCollectionQuoteAmount = () => {
    const value = (selectedCollection as CaseCollectionSchema).quoteAmount
    return (
      <FormTextField
        componentLabel="Case Collection--Quote Amount"
        maxLength={5}
        value={getAmountForDisplay(value)}
        onChange={(e) =>
          handleCollectionFormOnChange(
            'quoteAmount',
            e.target.value,
            selectedCollection,
            setSelectedCollection,
            getNumber,
          )
        }
        error={isCollectionFormFieldError('quoteAmount', value, undefined)}
        required
      />
    )
  }

  const caseCollectionCourtCasesListForSelect = () =>
    courtCasesList
      .filter(
        (x) =>
          ('courtCaseId' in selectedCollection && selectedCollection.courtCaseId === x.id) ||
          statusList.court_case.active.includes(x.status),
      )
      .map((x) => (
        <MenuItem key={x.id} value={x.id}>
          {x.client?.name}, {x.caseType?.name}
        </MenuItem>
      ))

  const caseCollectionCourtCasesList = () => {
    const value = 'courtCaseId' in selectedCollection ? selectedCollection.courtCaseId : ID_DEFAULT
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
        menuItems={caseCollectionCourtCasesListForSelect()}
        error={isCollectionFormFieldError('courtCaseId', value, undefined)}
        required
      />
    )
  }

  const caseCollectionStatus = () => {
    const value = 'status' in selectedCollection ? selectedCollection.status : ''
    return (
      <FormSelectStatusField
        componentLabel="Collection--Status"
        value={value}
        onChange={(e) =>
          handleCollectionFormOnChange('status', e.target.value, selectedCollection, setSelectedCollection, getString)
        }
        statusList={collectionStatusList}
        error={isCollectionFormFieldError('status', value, undefined)}
      />
    )
  }

  const caseCollectionComments = () => {
    const value = 'comments' in selectedCollection ? selectedCollection.comments : ''
    return (
      <FormCommentsField
        componentLabel="Collection--Comments"
        value={value}
        onChange={(e) =>
          handleCollectionFormOnChange(
            'comments',
            e.target.value,
            selectedCollection,
            setSelectedCollection,
            getComments,
          )
        }
      />
    )
  }

  // cash collections
  const cashCollectionCollectionDate = () => {
    return (
      <FormDatePickerField
        componentLabel="Cash Collection--Collection Date"
        value={(selectedCollection as CashCollectionSchema).collectionDate}
        onChange={(newValue) =>
          handleCollectionDateOnChange('collectionDate', newValue, selectedCollection, setSelectedCollection)
        }
        minDate={minCollectionDate}
        maxDate={maxCollectionDate}
        required
      />
    )
  }

  const cashCollectionCollectedAmount = () => {
    const value = (selectedCollection as CashCollectionSchema).collectedAmount
    return (
      <FormTextField
        componentLabel="Case Collection--Collected Amount"
        maxLength={5}
        value={getAmountForDisplay(value)}
        onChange={(e) =>
          handleCollectionFormOnChange(
            'collectedAmount',
            e.target.value,
            selectedCollection,
            setSelectedCollection,
            getNumber,
          )
        }
        error={isCollectionFormFieldError('collectedAmount', value, undefined)}
        required
      />
    )
  }

  const cashCollectionWaivedAmount = () => {
    const value = (selectedCollection as CashCollectionSchema).waivedAmount
    return (
      <FormTextField
        componentLabel="Cash Collection--Waived Amount"
        maxLength={5}
        value={getAmountForDisplay(value)}
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

  const cashCollectionMemo = () => {
    const value = (selectedCollection as CashCollectionSchema).memo
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

  const cashCollectionCollectionMethodsListForSelect = () =>
    collectionMethodsList.map((x) => (
      <MenuItem key={x.id} value={x.id}>
        {x.name}
      </MenuItem>
    ))

  const cashCollectionCollectionMethodsList = () => {
    const value = 'collectionMethodId' in selectedCollection ? selectedCollection.collectionMethodId : ID_DEFAULT
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
        menuItems={cashCollectionCollectionMethodsListForSelect()}
        error={isCollectionFormFieldError('collectionMethodId', value, undefined)}
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
    if (getNumber(courtCaseId) > 0) {
      const selectedCaseCollection = caseCollectionList.find((x) => x.courtCaseId === Number(courtCaseId))
      if (selectedCaseCollection) {
        return [
          <MenuItem key={selectedCaseCollection.id} value={selectedCaseCollection.id}>
            {cashCollectionCaseCollectionForSelect(selectedCaseCollection)}
          </MenuItem>,
        ]
      }
    } else {
      return caseCollectionList
        .filter(
          (x) =>
            ('caseCollectionId' in selectedCollection && selectedCollection.caseCollectionId === x.id) ||
            statusList.collections.active.includes(x.status),
        )
        .map((x) => (
          <MenuItem key={x.id} value={x.id}>
            {cashCollectionCaseCollectionForSelect(x)}
          </MenuItem>
        ))
    }
    return []
  }

  const cashCollectionCaseCollectionList = () => {
    const value = 'caseCollectionId' in selectedCollection ? selectedCollection.caseCollectionId : ID_DEFAULT
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
        menuItems={cashCollectionCaseCollectionListForSelect()}
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
      {isCaseCollectionForm ? (
        <>
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
        </>
      ) : (
        <>
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
        </>
      )}
    </GridFormWrapper>
  )
}

export default CollectionForm
