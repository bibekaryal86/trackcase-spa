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
  JUDGES_COMPLETE,
  JUDGES_READ_FAILURE,
  JUDGES_READ_REQUEST,
  JUDGES_READ_SUCCESS,
} from '../types/judges.action.types'
import { JudgeBase, JudgeResponse, JudgeSchema } from '../types/judges.data.types'
import { judgeDispatch } from '../utils/judges.utils'

export const judgesAction = ({
  action,
  judgesRequest,
  id,
  isRestore,
  isHardDelete,
}: {
  action: ActionTypes
  judgesRequest?: JudgeBase
  id?: number
  isRestore?: boolean
  isHardDelete?: boolean
}) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<JudgeResponse> => {
    if (action === ACTION_TYPES.RESTORE) {
      action = ACTION_TYPES.UPDATE
    }
    const typeRequest = `JUDGES_${action}_REQUEST`
    const typeSuccess = `JUDGES_${action}_SUCCESS`
    const typeFailure = `JUDGES_${action}_FAILURE`
    dispatch(judgeDispatch({ type: typeRequest }))

    let endpoint = ''
    let options: Partial<FetchOptions> = {}

    if (action === ACTION_TYPES.CREATE) {
      endpoint = getEndpoint(process.env.JUDGE_CREATE as string)
      options = {
        method: HTTP_METHODS.POST,
        requestBody: { ...judgesRequest },
      }
    } else if (action === ACTION_TYPES.UPDATE) {
      endpoint = getEndpoint(process.env.JUDGE_UPDATE as string)
      options = {
        method: HTTP_METHODS.PUT,
        requestBody: judgesRequest,
        queryParams: { is_restore: isRestore || false },
        pathParams: { judge_id: id || ID_DEFAULT },
      }
    } else if (action === ACTION_TYPES.DELETE) {
      endpoint = getEndpoint(process.env.JUDGE_DELETE as string)
      options = {
        method: HTTP_METHODS.DELETE,
        pathParams: { judge_id: id || ID_DEFAULT, is_hard_delete: isHardDelete || false },
      }
    }

    try {
      const judgeResponse = (await Async.fetch(endpoint, options)) as JudgeResponse
      if (judgeResponse.detail) {
        dispatch(judgeDispatch({ type: typeFailure, error: getErrMsg(judgeResponse.detail) }))
      } else {
        if (action === ACTION_TYPES.READ) {
          dispatch(judgeDispatch({ type: typeSuccess, judges: judgeResponse.data }))
        } else {
          dispatch(judgeDispatch({ type: typeSuccess, success: ACTION_SUCCESS(action, 'JUDGE') }))
        }
      }
      return judgeResponse
    } catch (error) {
      console.log(`Judge ${action} Error: `, error)
      dispatch(judgeDispatch({ type: typeFailure, error: SOMETHING_WENT_WRONG }))
      return { data: [], detail: { error: SOMETHING_WENT_WRONG } }
    } finally {
      dispatch(judgeDispatch({ type: JUDGES_COMPLETE }))
    }
  }
}

export const getJudges = (requestMetadata?: Partial<FetchRequestMetadata>) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, store: GlobalState): Promise<void> => {
    dispatch(judgeDispatch({ type: JUDGES_READ_REQUEST }))

    let judgeResponse: JudgeResponse = { data: [] }

    if (requestMetadata === store.judges.requestMetadata) {
      // no need to fetch request, metadata is same
      judgeResponse.data = store.judges.judges
    }
    const endpoint = getEndpoint(process.env.JUDGE_READ as string)
    const options: Partial<FetchOptions> = {
      method: HTTP_METHODS.GET,
      metadataParams: requestMetadata,
    }

    try {
      if (judgeResponse.data.length <= 0) {
        judgeResponse = (await Async.fetch(endpoint, options)) as JudgeResponse
      }
      if (judgeResponse.detail) {
        dispatch(judgeDispatch({ type: JUDGES_READ_FAILURE, error: getErrMsg(judgeResponse.detail) }))
      } else {
        dispatch(
          judgeDispatch({ type: JUDGES_READ_SUCCESS, judges: judgeResponse.data, requestMetadata: requestMetadata }),
        )
      }
    } catch (error) {
      console.log(`Get Judges Error: `, error)
      dispatch(judgeDispatch({ type: JUDGES_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
    } finally {
      dispatch(judgeDispatch({ type: JUDGES_COMPLETE }))
    }
  }
}

export const getJudge = (judgeId: number, isIncludeExtra?: boolean) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, state: GlobalState): Promise<JudgeSchema | undefined> => {
    dispatch(judgeDispatch({ type: JUDGES_READ_REQUEST }))
    let oneJudge = undefined

    try {
      const judgesInStore = state.judges.judges
      if (judgesInStore) {
        oneJudge = judgesInStore.find((x) => x.id === judgeId)

        if (isIncludeExtra && oneJudge && (!oneJudge.clients || !oneJudge.clients.length)) {
          oneJudge = undefined
        }
      }

      if (oneJudge) {
        return oneJudge
      } else {
        const endpoint = getEndpoint(process.env.JUDGE_READ as string)
        const requestMetadata: Partial<FetchRequestMetadata> = {
          schemaModelId: judgeId,
          isIncludeExtra: isIncludeExtra,
        }
        const options: Partial<FetchOptions> = {
          method: HTTP_METHODS.GET,
          metadataParams: requestMetadata,
        }
        const judgeResponse = (await Async.fetch(endpoint, options)) as JudgeResponse
        if (judgeResponse.detail) {
          dispatch(judgeDispatch({ type: JUDGES_READ_FAILURE, error: getErrMsg(judgeResponse.detail) }))
        } else {
          oneJudge = judgeResponse.data.find((x) => x.id === judgeId)
        }
      }
      return oneJudge
    } catch (error) {
      console.log(`Get Judge Error: `, error)
      dispatch(judgeDispatch({ type: JUDGES_READ_FAILURE, error: SOMETHING_WENT_WRONG }))
      return oneJudge
    } finally {
      dispatch(judgeDispatch({ type: JUDGES_COMPLETE }))
    }
  }
}
