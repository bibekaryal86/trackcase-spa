import React from 'react'

import {
  Async,
  FetchOptions,
  FetchRequestMetadata,
  getEndpoint,
  getErrMsg,
  GlobalDispatch,
  GlobalState,
} from '../../app'
import {
  ACTION_SUCCESS,
  ACTION_TYPES,
  ActionTypes,
  HTTP_METHODS,
  ID_DEFAULT,
  SOMETHING_WENT_WRONG,
} from '../../constants'
import {
  COURT_CASES_COMPLETE,
  COURT_CASES_READ_FAILURE,
  COURT_CASES_READ_REQUEST,
  COURT_CASES_READ_SUCCESS,
} from '../types/courtCases.action.types'
import { CourtCaseBase, CourtCaseResponse, CourtCaseSchema } from '../types/courtCases.data.types'
import { courtCaseDispatch } from '../utils/courtCases.utils'

export const courtCasesAction = ({
  action,
  courtCasesRequest,
  id,
  isRestore,
  isHardDelete,
}: {
  action: ActionTypes
  courtCasesRequest?: CourtCaseBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<CourtCaseResponse> => {
    if (action === ACTION_TYPES.RESTORE) {
      action = ACTION_TYPES.UPDATE
    }
    const typeRequest = `COURT_CASES_${action}_REQUEST`
    const typeSuccess = `COURT_CASES_${action}_SUCCESS`
    const typeFailure = `COURT_CASES_${action}_FAILURE`
    dispatch(courtCaseDispatch({ type: typeRequest }))

    let endpoint = ''
    let options: Partial<FetchOptions> = {}

    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.COURT_CASE_CREATE as string)
      options = {
        method: HTTP_METHODS.POST,
        requestBody: { ...courtCasesRequest },
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint = getEndpoint(process.env.COURT_CASE_UPDATE as string)
      options = {
        method: HTTP_METHODS.PUT,
        requestBody: courtCasesRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { court_case_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.COURT_CASE_DELETE as string)
      options = {
        method: HTTP_METHODS.DELETE,
        pathParams: { court_case_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    try {
      const courtCaseResponse = (await Async.fetch(endpoint, options)) as CourtCaseResponse
      if (courtCaseResponse.detail) {
        dispatch(courtCaseDispatch({ type: typeFailure, error: getErrMsg(courtCaseResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          dispatch(courtCaseDispatch({ type: typeSuccess, courtCases: courtCaseResponse.data }))
        } else {
          dispatch(courtCaseDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'COURT_CASE') }))
        }
      }
      return courtCaseResponse
    } catch (error) {
      console.log(`CourtCase ${action} Error: `, error)
      dispatch(courtCaseDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(courtCaseDispatch({ type: COURT_CASES_COMPLETE }))
    }
  }
}

export const getCourtCases = (requestMetadata?: Partial<FetchRequestMetadata>) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(courtCaseDispatch({ type: COURT_CASES_READ_REQUEST }))

    let courtCaseResponse: CourtCaseResponse = { data: [] }

    if (requestMetadata === getStore().courtCases.requestMetadata) {
      // no need to fetch request, metadata is same
      courtCaseResponse.data = getStore().courtCases.courtCases
    }
    const endpoint = getEndpoint(process.env.COURT_CASE_READ as string)
    const options: Partial<FetchOptions> = {
      method: HTTP_METHODS.GET,
      metadataParams: requestMetadata,
    }

    try {
      if (courtCaseResponse.data.length <= 0) {
        courtCaseResponse = (await Async.fetch(endpoint, options)) as CourtCaseResponse
      }
      if (courtCaseResponse.detail) {
        dispatch(courtCaseDispatch({ type: COURT_CASES_READ_FAILURE, error: getErrMsg(courtCaseResponse.detail) }))
      } else {
        dispatch(
          courtCaseDispatch({
            type: COURT_CASES_READ_SUCCESS,
            courtCases: courtCaseResponse.data,
            requestMetadata: requestMetadata,
          }),
        )
      }
    } catch (error) {
      console.log(`Get CourtCases Error: `, error)
      dispatch(courtCaseDispatch({ type: COURT_CASES_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(courtCaseDispatch({ type: COURT_CASES_COMPLETE }))
    }
  }
}

export const getCourtCase = (courtCaseId: number, isIncludeExtra?: boolean) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, state: GlobalState): Promise<CourtCaseSchema | undefined> => {
    dispatch(courtCaseDispatch({ type: COURT_CASES_READ_REQUEST }))
    let oneCourtCase = undefined

    try {
      const courtCasesInStore = state.courtCases.courtCases
      if (courtCasesInStore) {
        oneCourtCase = courtCasesInStore.find((x) => x.id === courtCaseId)

        if (
          isIncludeExtra &&
          oneCourtCase &&
          (!oneCourtCase.forms ||
            !oneCourtCase.forms.length ||
            !oneCourtCase.caseCollections ||
            !oneCourtCase.caseCollections.length ||
            !oneCourtCase.forms ||
            !oneCourtCase.forms.length)
        ) {
          oneCourtCase = undefined
        }
      }

      if (oneCourtCase) {
        return oneCourtCase
      } else {
        const endpoint = getEndpoint(process.env.COURT_CASE_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: courtCaseId,
          isIncludeExtra: isIncludeExtra === true
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const courtCaseResponse = (await Async.fetch(endpoint, options)) as CourtCaseResponse
        if (courtCaseResponse.detail) {
          dispatch(courtCaseDispatch({ type: COURT_CASES_READ_FAILURE, error: getErrMsg(courtCaseResponse.detail) }))
        } else {
          oneCourtCase = courtCaseResponse.data.find((x) => x.id === courtCaseId)
        }
      }
      return oneCourtCase
    } catch (error) {
      console.log(`Get CourtCase Error: `, error)
      dispatch(courtCaseDispatch({ type: COURT_CASES_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneCourtCase
    } finally {
      dispatch(courtCaseDispatch({ type: COURT_CASES_COMPLETE }))
    }
  }
}
