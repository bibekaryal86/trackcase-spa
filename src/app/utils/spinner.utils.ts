import React from 'react'

import { GlobalState } from '../store/redux'
import { RESET_SPINNER, SET_SPINNER } from '../types/app.action.types'
import { SpinnerAction } from '../types/app.data.types'

export const setSpinner = () => {
  return (dispatch: React.Dispatch<SpinnerAction>, getStore: () => GlobalState): void => {
    dispatch({
      type: SET_SPINNER,
      spinner: {
        isLoading: true,
        spinRequests: getStore().spinner.spinRequests,
      },
    })
  }
}

export const resetSpinner = () => {
  return (dispatch: React.Dispatch<SpinnerAction>, getStore: () => GlobalState): void => {
    dispatch({
      type: RESET_SPINNER,
      spinner: {
        isLoading: false,
        spinRequests: getStore().spinner.spinRequests,
      },
    })
  }
}
