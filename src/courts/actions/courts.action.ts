import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  COURT_CREATE_FAILURE,
  COURT_CREATE_REQUEST,
  COURT_CREATE_SUCCESS,
  COURT_DELETE_FAILURE,
  COURT_DELETE_REQUEST,
  COURT_DELETE_SUCCESS,
  COURT_UPDATE_FAILURE,
  COURT_UPDATE_REQUEST,
  COURT_UPDATE_SUCCESS,
  COURTS_COMPLETE,
  COURTS_RETRIEVE_FAILURE,
  COURTS_RETRIEVE_REQUEST,
  COURTS_RETRIEVE_SUCCESS,
  SET_SELECTED_COURT,
} from '../types/courts.action.types'
import { CourtResponse, CourtSchema } from '../types/courts.data.types'

export const addCourt = (court: CourtSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(courtsRequest(COURT_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COURT_CREATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: getRequestBody(court),
      }

      const courtResponse = (await Async.fetch(urlPath, options)) as CourtResponse

      if (courtResponse.detail) {
        dispatch(courtsFailure(COURT_CREATE_FAILURE, getErrMsg(courtResponse.detail)))
      } else {
        dispatch(courtsSuccess(COURT_CREATE_SUCCESS, CREATE_SUCCESS('Court'), []))
      }
    } catch (error) {
      console.log('Add Court Error: ', error)
      dispatch(courtsFailure(COURT_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(courtsComplete())
    }
  }
}

export const getCourts = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(courtsRequest(COURTS_RETRIEVE_REQUEST))

    try {
      let courtResponse: CourtResponse
      const courtsInStore: CourtSchema[] = getStore().courts.courts

      if (isForceFetch || courtsInStore.length === 0) {
        const urlPath = getEndpoint(process.env.COURTS_RETRIEVE_ENDPOINT as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        courtResponse = (await Async.fetch(urlPath, options)) as CourtResponse

        if (courtResponse.detail) {
          dispatch(courtsFailure(COURTS_RETRIEVE_FAILURE, getErrMsg(courtResponse.detail)))
        } else {
          dispatch(courtsSuccess(COURTS_RETRIEVE_SUCCESS, '', courtResponse.courts))
        }
      } else {
        courtResponse = {
          courts: courtsInStore,
        }
        dispatch(courtsSuccess(COURTS_RETRIEVE_SUCCESS, '', courtResponse.courts))
      }
    } catch (error) {
      console.log('Get Courts Error: ', error)
      dispatch(courtsFailure(COURTS_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(courtsComplete())
    }
  }
}

export const getCourt = (courtId: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(courtsRequest(COURTS_RETRIEVE_REQUEST))

    // call api, if it fails fallback to store
    try {
      const urlPath = getEndpoint(process.env.COURT_RETRIEVE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'GET',
        pathParams: { court_id: courtId },
        extraParams: {
          isIncludeExtra: true,
          isIncludeHistory: true,
        },
      }

      const courtResponse = (await Async.fetch(urlPath, options)) as CourtResponse
      if (courtResponse.detail) {
        dispatch(courtsFailure(COURTS_RETRIEVE_FAILURE, getErrMsg(courtResponse.detail)))
        setSelectedCourtFromStore(getStore(), dispatch, courtId)
      } else {
        dispatch(courtSelect(courtResponse.courts[0]))
      }
    } catch (error) {
      console.log('Get Court Error: ', error)
      dispatch(courtsFailure(COURTS_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
      setSelectedCourtFromStore(getStore(), dispatch, courtId)
    } finally {
      dispatch(courtsComplete())
    }
  }
}

export const editCourt = (id: number, court: CourtSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(courtsRequest(COURT_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COURT_UPDATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { court_id: id },
        requestBody: getRequestBody(court),
      }

      const courtResponse = (await Async.fetch(urlPath, options)) as CourtResponse

      if (courtResponse.detail) {
        dispatch(courtsFailure(COURT_UPDATE_FAILURE, getErrMsg(courtResponse.detail)))
      } else {
        dispatch(courtsSuccess(COURT_UPDATE_SUCCESS, UPDATE_SUCCESS('Court'), []))
      }
    } catch (error) {
      console.log('Edit Court Error: ', error)
      dispatch(courtsFailure(COURT_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(courtsComplete())
    }
  }
}

export const deleteCourt = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(courtsRequest(COURT_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.COURT_DELETE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { court_id: id },
      }

      const courtResponse = (await Async.fetch(urlPath, options)) as CourtResponse

      if (courtResponse.detail) {
        dispatch(courtsFailure(COURT_DELETE_FAILURE, getErrMsg(courtResponse.detail)))
      } else {
        dispatch(courtsSuccess(COURT_DELETE_SUCCESS, DELETE_SUCCESS('Court'), []))
      }
    } catch (error) {
      console.log('Delete Court Error: ', error)
      dispatch(courtsFailure(COURT_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(courtsComplete())
    }
  }
}

const courtsRequest = (type: string) => ({
  type: type,
})

const courtsSuccess = (type: string, success: string, courts: CourtSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      courts: courts,
    }
  }
}

const courtsFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const courtSelect = (selectedCourt: CourtSchema) => ({
  type: SET_SELECTED_COURT,
  selectedCourt,
})

const courtsComplete = () => ({
  type: COURTS_COMPLETE,
})

const getRequestBody = (court: CourtSchema) => {
  return {
    name: court.name,
    street_address: court.streetAddress,
    city: court.city,
    state: court.state,
    zip_code: court.zipCode,
    phone_number: court.phoneNumber,
    dhs_address: court.dhsAddress,
    status: court.status,
    comments: court.comments,
  }
}

const setSelectedCourtFromStore = (store: GlobalState, dispatch: React.Dispatch<GlobalDispatch>, courtId: number) => {
  const courtsInStore: CourtSchema[] = store.courts.courts
  const courtInStore: CourtSchema | undefined = courtsInStore.find((court) => court.id === courtId)
  if (courtInStore) {
    dispatch(courtSelect(courtInStore))
  }
}
