import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  COURT_CASE_CREATE_FAILURE,
  COURT_CASE_CREATE_REQUEST,
  COURT_CASE_CREATE_SUCCESS,
  COURT_CASE_DELETE_FAILURE,
  COURT_CASE_DELETE_REQUEST,
  COURT_CASE_DELETE_SUCCESS,
  COURT_CASE_UPDATE_FAILURE,
  COURT_CASE_UPDATE_REQUEST,
  COURT_CASE_UPDATE_SUCCESS,
  COURT_CASES_COMPLETE,
  COURT_CASES_RETRIEVE_FAILURE,
  COURT_CASES_RETRIEVE_REQUEST,
  COURT_CASES_RETRIEVE_SUCCESS,
  SET_SELECTED_COURT_CASE,
} from '../types/courtCases.action.types'
import { CourtCaseResponse, CourtCaseSchema } from '../types/courtCases.data.types'

export const addCourtCase = (courtCase: CourtCaseSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(courtCasesRequest(COURT_CASE_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COURT_CASE_CREATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: getRequestBody(courtCase),
      }

      const courtCaseResponse = (await Async.fetch(urlPath, options)) as CourtCaseResponse

      if (courtCaseResponse.detail) {
        dispatch(courtCasesFailure(COURT_CASE_CREATE_FAILURE, getErrMsg(courtCaseResponse.detail)))
      } else {
        dispatch(courtCasesSuccess(COURT_CASE_CREATE_SUCCESS, CREATE_SUCCESS('CourtCase'), []))
      }
    } catch (error) {
      console.log('Add CourtCase Error: ', error)
      dispatch(courtCasesFailure(COURT_CASE_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(courtCasesComplete())
    }
  }
}

export const getCourtCases = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(courtCasesRequest(COURT_CASES_RETRIEVE_REQUEST))

    try {
      let courtCasesResponse: CourtCaseResponse
      const courtCasesInStore: CourtCaseSchema[] = getStore().courtCases.courtCases

      if (isForceFetch || courtCasesInStore.length === 0) {
        const urlPath = getEndpoint(process.env.COURT_CASES_RETRIEVE_ENDPOINT as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        courtCasesResponse = (await Async.fetch(urlPath, options)) as CourtCaseResponse

        if (courtCasesResponse.detail) {
          dispatch(courtCasesFailure(COURT_CASES_RETRIEVE_FAILURE, getErrMsg(courtCasesResponse.detail)))
        } else {
          dispatch(courtCasesSuccess(COURT_CASES_RETRIEVE_SUCCESS, '', courtCasesResponse.courtCases))
        }
      } else {
        courtCasesResponse = {
          courtCases: courtCasesInStore,
        }
        dispatch(courtCasesSuccess(COURT_CASES_RETRIEVE_SUCCESS, '', courtCasesResponse.courtCases))
      }
    } catch (error) {
      console.log('Get CourtCases Error: ', error)
      dispatch(courtCasesFailure(COURT_CASES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(courtCasesComplete())
    }
  }
}

export const getCourtCase = (courtCaseId: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(courtCasesRequest(COURT_CASES_RETRIEVE_REQUEST))

    // call api, if it fails fallback to store
    try {
      const urlPath = getEndpoint(process.env.COURT_CASE_RETRIEVE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'GET',
        pathParams: { court_case_id: courtCaseId },
        extraParams: {
          isIncludeExtra: true,
          isIncludeHistory: true,
        },
      }

      const courtCaseResponse = (await Async.fetch(urlPath, options)) as CourtCaseResponse
      if (courtCaseResponse.detail) {
        dispatch(courtCasesFailure(COURT_CASES_RETRIEVE_FAILURE, getErrMsg(courtCaseResponse.detail)))
        setSelectedCourtCaseFromStore(getStore(), dispatch, courtCaseId)
      } else {
        dispatch(courtCaseSelect(courtCaseResponse.courtCases[0]))
      }
    } catch (error) {
      console.log('Get CourtCase Error: ', error)
      dispatch(courtCasesFailure(COURT_CASES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
      setSelectedCourtCaseFromStore(getStore(), dispatch, courtCaseId)
    } finally {
      dispatch(courtCasesComplete())
    }
  }
}

export const editCourtCase = (id: number, courtCase: CourtCaseSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(courtCasesRequest(COURT_CASE_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COURT_CASE_UPDATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { court_case_id: id },
        requestBody: getRequestBody(courtCase),
      }

      const courtCaseResponse = (await Async.fetch(urlPath, options)) as CourtCaseResponse

      if (courtCaseResponse.detail) {
        dispatch(courtCasesFailure(COURT_CASE_UPDATE_FAILURE, getErrMsg(courtCaseResponse.detail)))
      } else {
        dispatch(courtCasesSuccess(COURT_CASE_UPDATE_SUCCESS, UPDATE_SUCCESS('CourtCase'), []))
      }
    } catch (error) {
      console.log('Edit CourtCase Error: ', error)
      dispatch(courtCasesFailure(COURT_CASE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(courtCasesComplete())
    }
  }
}

export const deleteCourtCase = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(courtCasesRequest(COURT_CASE_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COURT_CASE_DELETE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { court_case_id: id },
      }

      const courtCaseResponse = (await Async.fetch(urlPath, options)) as CourtCaseResponse

      if (courtCaseResponse.detail) {
        dispatch(courtCasesFailure(COURT_CASE_DELETE_FAILURE, getErrMsg(courtCaseResponse.detail)))
      } else {
        dispatch(courtCasesSuccess(COURT_CASE_DELETE_SUCCESS, DELETE_SUCCESS('CourtCase'), []))
      }
    } catch (error) {
      console.log('Delete CourtCase Error: ', error)
      dispatch(courtCasesFailure(COURT_CASE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(courtCasesComplete())
    }
  }
}

const courtCasesRequest = (type: string) => ({
  type: type,
})

const courtCasesSuccess = (type: string, success: string, courtCases: CourtCaseSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      courtCases: courtCases,
    }
  }
}

const courtCasesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const courtCaseSelect = (selectedCourtCase: CourtCaseSchema) => ({
  type: SET_SELECTED_COURT_CASE,
  selectedCourtCase,
})

const courtCasesComplete = () => ({
  type: COURT_CASES_COMPLETE,
})

const getRequestBody = (courtCase: CourtCaseSchema) => {
  return {
    case_type_id: courtCase.caseTypeId,
    client_id: courtCase.clientId,
    status: courtCase.status,
    comments: courtCase.comments,
  }
}

const setSelectedCourtCaseFromStore = (
  store: GlobalState,
  dispatch: React.Dispatch<GlobalDispatch>,
  courtCaseId: number,
) => {
  const courtCasesInStore: CourtCaseSchema[] = store.courtCases.courtCases
  const courtCaseInStore: CourtCaseSchema | undefined = courtCasesInStore.find(
    (courtCase) => courtCase.id === courtCaseId,
  )
  if (courtCaseInStore) {
    dispatch(courtCaseSelect(courtCaseInStore))
  }
}
