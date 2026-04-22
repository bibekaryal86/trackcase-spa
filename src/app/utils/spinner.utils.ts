import React from 'react'

import { GlobalState } from '@app/store/redux.ts'
import { RESET_SPINNER, SET_SPINNER } from '@app/types/app.action.types.ts'
import { SpinnerAction } from '@app/types/app.data.types.ts'

export const setSpinner = () => {
  return (dispatch: React.Dispatch<SpinnerAction>, getStore: () => GlobalState): void => {
    dispatch({
      type: SET_SPINNER,
      spinner: {
        isLoading: true,
        requestCount: getStore().spinner.requestCount,
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
        requestCount: getStore().spinner.requestCount,
      },
    })
  }
}
