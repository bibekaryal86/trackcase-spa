import React from 'react'

import { IS_DARK_MODE } from '../../constants'
import { GlobalDispatch } from '../store/redux'
import { USER_LOGOUT } from '../types/app.action.types'
import { isGetDarkMode } from '../utils/app.utils'
import { LocalStorage, SessionStorage } from '../utils/storage.utils'

export const userLogout = () => {
  return async (dispatch: React.Dispatch<GlobalDispatch>): Promise<void> => {
    clearLocalData(dispatch)
  }
}

const clearLocalData = (dispatch: React.Dispatch<GlobalDispatch>) => {
  const isDarkMode = getDarkMode()
  LocalStorage.removeAllItems()
  SessionStorage.removeAllItems()
  setDarkMode(isDarkMode)
  dispatch({
    type: USER_LOGOUT,
  })
}

const getDarkMode = () => isGetDarkMode()

const setDarkMode = (isDarkMode: boolean) => SessionStorage.setItem(IS_DARK_MODE, String(isDarkMode))
