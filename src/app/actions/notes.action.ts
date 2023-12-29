import React from 'react'

import { SOMETHING_WENT_WRONG } from '../../constants'
import { GlobalDispatch } from '../store/redux'
import { NoteResponse, UserDetails } from '../types/app.data.types'
import { getEndpoint, getErrMsg } from '../utils/app.utils'
import { Async, FetchOptions } from '../utils/fetch.utils'
import { LocalStorage } from '../utils/storage.utils'

export const addNote = (noteObjectType: string, noteObjectId: number, note: string) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const requestType = `${noteObjectType.toUpperCase()}_NOTE_REQUEST`
    dispatch(notesRequest(requestType))

    const urlPath = getEndpoint(process.env.NOTE_CREATE_ENDPOINT as string)
    const options: Partial<FetchOptions> = {
      method: 'POST',
      pathParams: {
        note_object_type: noteObjectType,
      },
      requestBody: getRequestBody(noteObjectId, note),
    }
    await handleRequest(urlPath, options, noteObjectType, dispatch, 'ADDED')
  }
}

export const editNote = (noteObjectType: string, noteObjectId: number, note: string, noteId: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const requestType = `${noteObjectType.toUpperCase()}_NOTE_REQUEST`
    dispatch(notesRequest(requestType))

    const urlPath = getEndpoint(process.env.NOTE_UPDATE_ENDPOINT as string)
    const options: Partial<FetchOptions> = {
      method: 'PUT',
      pathParams: {
        note_object_type: noteObjectType,
        note_id: noteId,
      },
      requestBody: getRequestBody(noteObjectId, note),
    }
    await handleRequest(urlPath, options, noteObjectType, dispatch, 'UPDATED')
  }
}

export const deleteNote = (noteObjectType: string, noteId: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const requestType = `${noteObjectType.toUpperCase()}_NOTE_REQUEST`
    dispatch(notesRequest(requestType))

    const urlPath = getEndpoint(process.env.NOTE_DELETE_ENDPOINT as string)
    const options: Partial<FetchOptions> = {
      method: 'DELETE',
      pathParams: {
        note_object_type: noteObjectType,
        note_id: noteId,
      },
    }
    await handleRequest(urlPath, options, noteObjectType, dispatch, 'DELETED')
  }
}

async function handleRequest(
  urlPath: string,
  options: Partial<FetchOptions>,
  noteObjectType: string,
  dispatch: React.Dispatch<GlobalDispatch>,
  action: string,
) {
  try {
    const noteResponse = (await Async.fetch(urlPath, options)) as NoteResponse

    if (noteResponse.detail) {
      const responseType = `${noteObjectType.toUpperCase()}_NOTE_FAILURE`
      dispatch(notesFailure(responseType, getErrMsg(noteResponse.detail)))
    } else {
      const responseType = `${noteObjectType.toUpperCase()}_NOTE_SUCCESS`
      dispatch(notesSuccess(responseType, action))
    }
  } catch (error) {
    console.log('Add Judge Error: ', error)
    const responseType = `${noteObjectType.toUpperCase()}_NOTE_FAILURE`
    dispatch(notesFailure(responseType, SOMETHING_WENT_WRONG))
  } finally {
    const responseType = `${noteObjectType.toUpperCase()}_COMPLETE`
    dispatch(notesComplete(responseType))
  }
}

const notesRequest = (type: string) => ({
  type: type,
})

const notesSuccess = (type: string, action: string) => ({
  type: type,
  success: `Note ${action} successfully!`,
})

const notesFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const notesComplete = (type: string) => ({
  type: type,
})

const getRequestBody = (noteObjectId: number, note: string) => {
  const userDetails = LocalStorage.getItem('userDetails') as UserDetails
  return {
    user_name: userDetails.username,
    note: note.trim(),
    note_object_id: noteObjectId,
  }
}
