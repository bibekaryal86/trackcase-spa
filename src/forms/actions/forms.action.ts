import React from 'react'

import { Async, FetchOptions, getEndpoint, getErrMsg, GlobalDispatch, GlobalState } from '../../app'
import { CREATE_SUCCESS, DELETE_SUCCESS, ID_DEFAULT, SOMETHING_WENT_WRONG, UPDATE_SUCCESS } from '../../constants'
import {
  FORM_CREATE_FAILURE,
  FORM_CREATE_REQUEST,
  FORM_CREATE_SUCCESS,
  FORM_DELETE_FAILURE,
  FORM_DELETE_REQUEST,
  FORM_DELETE_SUCCESS,
  FORM_UPDATE_FAILURE,
  FORM_UPDATE_REQUEST,
  FORM_UPDATE_SUCCESS,
  FORMS_COMPLETE,
  FORMS_RETRIEVE_FAILURE,
  FORMS_RETRIEVE_REQUEST,
  FORMS_RETRIEVE_SUCCESS,
  SET_SELECTED_FORM,
} from '../types/forms.action.types'
import { FormResponse, FormSchema } from '../types/forms.data.types'
import { validateForm } from '../utils/forms.utils'

export const addForm = (form: FormSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateForm(form)
    if (validationErrors) {
      dispatch(formsFailure(FORM_CREATE_FAILURE, validationErrors))
      return
    }

    dispatch(formsRequest(FORM_CREATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FORM_CREATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'POST',
        requestBody: getRequestBody(form),
      }

      const formResponse = (await Async.fetch(urlPath, options)) as FormResponse

      if (formResponse.detail) {
        dispatch(formsFailure(FORM_CREATE_FAILURE, getErrMsg(formResponse.detail)))
      } else {
        dispatch(formsSuccess(FORM_CREATE_SUCCESS, CREATE_SUCCESS('Form'), []))
      }
    } catch (error) {
      console.log('Add Form Error: ', error)
      dispatch(formsFailure(FORM_CREATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(formsComplete())
    }
  }
}

export const getForms = (isForceFetch: boolean = false) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(formsRequest(FORMS_RETRIEVE_REQUEST))

    try {
      let formsResponse: FormResponse
      const formsInStore: FormSchema[] = getStore().forms.forms

      if (isForceFetch || formsInStore.length === 0) {
        const urlPath = getEndpoint(process.env.FORMS_RETRIEVE_ENDPOINT as string)
        const options: Partial<FetchOptions> = {
          method: 'GET',
        }
        formsResponse = (await Async.fetch(urlPath, options)) as FormResponse

        if (formsResponse.detail) {
          dispatch(formsFailure(FORMS_RETRIEVE_FAILURE, getErrMsg(formsResponse.detail)))
        } else {
          dispatch(formsSuccess(FORMS_RETRIEVE_SUCCESS, '', formsResponse.forms))
        }
      } else {
        formsResponse = {
          forms: formsInStore,
        }
        dispatch(formsSuccess(FORMS_RETRIEVE_SUCCESS, '', formsResponse.forms))
      }
    } catch (error) {
      console.log('Get Forms Error: ', error)
      dispatch(formsFailure(FORMS_RETRIEVE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(formsComplete())
    }
  }
}

export const getOneForm = (formId: number) => {
  try {
    const urlPath = getEndpoint(process.env.FORM_RETRIEVE_ENDPOINT as string)
    const options: Partial<FetchOptions> = {
      method: 'GET',
      pathParams: { form_id: formId },
      extraParams: {
        isIncludeExtra: true,
        isIncludeHistory: true,
      },
    }

    return Async.fetch(urlPath, options)
  } catch (error) {
    console.log('Get OneForm Error: ', error)
    const errorResponse: FormResponse = { forms: [], detail: { error: error as string } }
    return Promise.resolve(errorResponse)
  }
}

export const getForm = (formId: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>, getStore: () => GlobalState): Promise<void> => {
    dispatch(formsRequest(FORMS_RETRIEVE_REQUEST))

    // call api, if it fails fallback to store
    try {
      const formResponse = (await getOneForm(formId)) as FormResponse
      if (formResponse.detail) {
        dispatch(formsFailure(FORMS_RETRIEVE_FAILURE, getErrMsg(formResponse.detail)))
        setSelectedFormFromStore(getStore(), dispatch, formId)
      } else {
        dispatch(formSelect(formResponse.forms[0]))
      }
    } finally {
      dispatch(formsComplete())
    }
  }
}

export const editForm = (id: number, form: FormSchema) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    const validationErrors = validateForm(form)
    if (validationErrors) {
      dispatch(formsFailure(FORM_UPDATE_FAILURE, validationErrors))
      return
    }

    dispatch(formsRequest(FORM_UPDATE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FORM_UPDATE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'PUT',
        pathParams: { form_id: id },
        requestBody: getRequestBody(form),
      }

      const formResponse = (await Async.fetch(urlPath, options)) as FormResponse

      if (formResponse.detail) {
        dispatch(formsFailure(FORM_UPDATE_FAILURE, getErrMsg(formResponse.detail)))
      } else {
        dispatch(formsSuccess(FORM_UPDATE_SUCCESS, UPDATE_SUCCESS('Form'), []))
      }
    } catch (error) {
      console.log('Edit Form Error: ', error)
      dispatch(formsFailure(FORM_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(formsComplete())
    }
  }
}

export const deleteForm = (id: number) => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    dispatch(formsRequest(FORM_DELETE_REQUEST))

    try {
      const urlPath = getEndpoint(process.env.FORM_DELETE_ENDPOINT as string)
      const options: Partial<FetchOptions> = {
        method: 'DELETE',
        pathParams: { form_id: id },
      }

      const formResponse = (await Async.fetch(urlPath, options)) as FormResponse

      if (formResponse.detail) {
        dispatch(formsFailure(FORM_DELETE_FAILURE, getErrMsg(formResponse.detail)))
      } else {
        dispatch(formsSuccess(FORM_DELETE_SUCCESS, DELETE_SUCCESS('Form'), []))
      }
    } catch (error) {
      console.log('Delete Form Error: ', error)
      dispatch(formsFailure(FORM_UPDATE_FAILURE, SOMETHING_WENT_WRONG))
    } finally {
      dispatch(formsComplete())
    }
  }
}

const formsRequest = (type: string) => ({
  type: type,
})

const formsSuccess = (type: string, success: string, forms: FormSchema[]) => {
  if (success) {
    return {
      type: type,
      success: success,
    }
  } else {
    return {
      type: type,
      forms: forms,
    }
  }
}

const formsFailure = (type: string, errMsg: string) => ({
  type: type,
  error: errMsg,
})

const formSelect = (selectedForm: FormSchema) => ({
  type: SET_SELECTED_FORM,
  selectedForm,
})

const formsComplete = () => ({
  type: FORMS_COMPLETE,
})

const getRequestBody = (form: FormSchema) => {
  return {
    form_type_id: form.formTypeId,
    court_case_id: form.courtCaseId,
    submit_date: form.submitDate,
    receipt_date: form.receiptDate,
    rfe_date: form.rfeDate,
    rfe_submit_date: form.rfeSubmitDate,
    decision_date: form.decisionDate,
    task_calendar_id: form.taskCalendarId === ID_DEFAULT ? undefined : form.taskCalendarId,
    status: form.status,
    comments: form.comments,
  }
}

const setSelectedFormFromStore = (store: GlobalState, dispatch: React.Dispatch<GlobalDispatch>, formId: number) => {
  const formsInStore: FormSchema[] = store.forms.forms
  const formInStore: FormSchema | undefined = formsInStore.find((form) => form.id === formId)
  if (formInStore) {
    dispatch(formSelect(formInStore))
  }
}
