import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  JUDGE_CREATE_FAILURE,
  JUDGE_CREATE_REQUEST,
  JUDGE_CREATE_SUCCESS,
  JUDGE_DELETE_FAILURE,
  JUDGE_DELETE_REQUEST,
  JUDGE_DELETE_SUCCESS,
  JUDGE_UPDATE_FAILURE,
  JUDGE_UPDATE_REQUEST,
  JUDGE_UPDATE_SUCCESS,
  JUDGES_COMPLETE,
  JUDGES_RETRIEVE_FAILURE,
  JUDGES_RETRIEVE_REQUEST,
  JUDGES_RETRIEVE_SUCCESS,
  SET_SELECTED_JUDGE,
} from '../types/judges.action.types'
import { JudgeResponse, JudgeSchema } from '../types/judges.data.types'
import { validateJudge } from '../utils/judges.utils'

export const addJudge = (judge: JudgeSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateJudge(judge)
    if (validationErrors) {
      dispatch(judgesFailure(JUDGE_CREATE_FAILURE, validationErrors))
    }

    dispatch(judgesRequest(JUDGE_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.JUDGE_CREATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: getRequestBody(judge),
      }

      const judgeResponse = (await Async.fetch(urlPath, options)) as JudgeResponse

      if (judgeResponse.detail) {
        dispatch(judgesFailure(JUDGE_CREATE_FAILURE, getErrMsg(judgeResponse.detail)))
      } else {
        dispatch(judgesSuccess(JUDGE_CREATE_SUCCESS, CREATE_SUCCESS('Judge'), []))
      }
    } catch (error) {
      console.log('Add Judge Error: ', error)
      dispatch(judgesFailure(JUDGE_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(judgesComplete())
    }
  }
}

export const getJudges = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(judgesRequest(JUDGES_RETRIEVE_REQUEST))

    try {
      let judgeResponse: JudgeResponse
      const judgesInStore: JudgeSchema[] = getStore().judges.judges

      if (isForceFetch || judgesInStore.length === 0) {
        const urlPath = getEndpoint(process.env.JUDGES_RETRIEVE_ENDPOINT as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        judgeResponse = (await Async.fetch(urlPath, options)) as JudgeResponse

        if (judgeResponse.detail) {
          dispatch(judgesFailure(JUDGES_RETRIEVE_FAILURE, getErrMsg(judgeResponse.detail)))
        } else {
          dispatch(judgesSuccess(JUDGES_RETRIEVE_SUCCESS, '', judgeResponse.judges))
        }
      } else {
        judgeResponse = {
          judges: judgesInStore,
        }
        dispatch(judgesSuccess(JUDGES_RETRIEVE_SUCCESS, '', judgeResponse.judges))
      }
    } catch (error) {
      console.log('Get Judges Error: ', error)
      dispatch(judgesFailure(JUDGES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(judgesComplete())
    }
  }
}

export const getOneJudge = (judgeId: number) => {
  try {
    const urlPath = getEndpoint(process.env.JUDGE_RETRIEVE_ENDPOINT as string)
    const options: Partial<FetchOptions> = {
      method: 'GET',
      pathParams: { judge_id: judgeId },
      extraParams: {
        isIncludeExtra: true,
        isIncludeHistory: true,
      },
    }

    return Async.fetch(urlPath, options)
  } catch (error) {
    console.log('Get OneJudge Error: ', error)
    const errorResponse: JudgeResponse = { judges: [], detail: { error: error as string } }
    return Promise.resolve(errorResponse)
  }
}

export const getJudge = (judgeId: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(judgesRequest(JUDGES_RETRIEVE_REQUEST))

    // call api, if it fails fallback to store
    try {
      const judgeResponse = (await getOneJudge(judgeId)) as JudgeResponse
      if (judgeResponse.detail) {
        dispatch(judgesFailure(JUDGES_RETRIEVE_FAILURE, getErrMsg(judgeResponse.detail)))
        setSelectedJudgeFromStore(getStore(), dispatch, judgeId)
      } else {
        dispatch(judgeSelect(judgeResponse.judges[0]))
      }
    } catch (error) {
      console.log('Get Judge Error: ', error)
      dispatch(judgesFailure(JUDGES_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
      setSelectedJudgeFromStore(getStore(), dispatch, judgeId)
    } finally {
      dispatch(judgesComplete())
    }
  }
}

export const editJudge = (id: number, judge: JudgeSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateJudge(judge)
    if (validationErrors) {
      dispatch(judgesFailure(JUDGE_UPDATE_FAILURE, validationErrors))
    }

    dispatch(judgesRequest(JUDGE_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.JUDGE_UPDATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { judge_id: id },
        requestBody: getRequestBody(judge),
      }

      const judgeResponse = (await Async.fetch(urlPath, options)) as JudgeResponse

      if (judgeResponse.detail) {
        dispatch(judgesFailure(JUDGE_UPDATE_FAILURE, getErrMsg(judgeResponse.detail)))
      } else {
        dispatch(judgesSuccess(JUDGE_UPDATE_SUCCESS, UPDATE_SUCCESS('Judge'), []))
      }
    } catch (error) {
      console.log('Edit Judge Error: ', error)
      dispatch(judgesFailure(JUDGE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(judgesComplete())
    }
  }
}

export const deleteJudge = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(judgesRequest(JUDGE_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.JUDGE_DELETE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { judge_id: id },
      }

      const judgeResponse = (await Async.fetch(urlPath, options)) as JudgeResponse

      if (judgeResponse.detail) {
        dispatch(judgesFailure(JUDGE_DELETE_FAILURE, getErrMsg(judgeResponse.detail)))
      } else {
        dispatch(judgesSuccess(JUDGE_DELETE_SUCCESS, DELETE_SUCCESS('Judge'), []))
      }
    } catch (error) {
      console.log('Delete Judge Error: ', error)
      dispatch(judgesFailure(JUDGE_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(judgesComplete())
    }
  }
}

const judgesRequest = (type: string) => ({
  type: type,
})

const judgesSuccess = (type: string, success: string, judges: JudgeSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      judges: judges,
    }
  }
}

const judgesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const judgeSelect = (selectedJudge: JudgeSchema) => ({
  type: SET_SELECTED_JUDGE,
  selectedJudge,
})

const judgesComplete = () => ({
  type: JUDGES_COMPLETE,
})

const getRequestBody = (judge: JudgeSchema) => {
  return {
    name: judge.name,
    webex: judge.webex,
    court_id: judge.courtId,
    status: judge.status,
    comments: judge.comments,
  }
}

const setSelectedJudgeFromStore = (store: GlobalState, dispatch: React.Dispatch<GlobalDispatch>, judgeId: number) => {
  const judgesInStore: JudgeSchema[] = store.judges.judges
  const judgeInStore: JudgeSchema | undefined = judgesInStore.find((judge) => judge.id === judgeId)
  if (judgeInStore) {
    dispatch(judgeSelect(judgeInStore))
  }
}
