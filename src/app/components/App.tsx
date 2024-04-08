import { createTheme, ThemeProvider } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { ALERT_TYPES, IS_DARK_MODE, SIGNIN_FIRST } from '@constants/index'
import { logout } from '@users/action/users.action'
import { isLoggedIn } from '@users/utils/users.utils'

import Alerts from './Alerts'
import Body from './Body'
import SessionTimeout from './SessionTimeout'
import Spinner from './Spinner'
import { setAlert } from '../utils/alerts.utils'
import { SessionStorage } from '../utils/storage.utils'

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

type AppProps = {
  logout: () => void
  setAlert: (type: string, messageText: string) => void
}

const mapDispatchToProps = {
  logout: () => logout(),
  setAlert: (type: string, messageText: string) => setAlert(type, messageText),
}

function App(props: AppProps): React.ReactElement {
  const { logout, setAlert } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const darkModeCallback = () => {
    setIsDarkMode((prevState) => !prevState)
    SessionStorage.setItem(IS_DARK_MODE, String(!isDarkMode))
  }

  // redirect to sign in page when log out
  const navigate = useNavigate()
  const logoutCallback = () => {
    logout()
    navigate('/', {
      replace: true,
    })
  }

  // when page is reloaded, set drawer and dark mode
  useEffect(() => {
    setIsDarkMode((SessionStorage.getItem(IS_DARK_MODE) as string) === 'true')
  }, [])

  // handle state messages on the top most component
  const { state } = useLocation() as { state: { redirect: string; message: string; alertType: string } }
  useEffect(() => {
    if (state?.message) {
      if (state.alertType) {
        setAlert(state.alertType, state.message)
      } else {
        setAlert(ALERT_TYPES.INFO, state.message)
      }
    }
    if (state?.redirect && !isLoggedIn()) {
      setAlert(ALERT_TYPES.WARNING, SIGNIN_FIRST)
    }
  }, [navigate, setAlert, state])

  const theApp = () => (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <SessionTimeout />
      <Spinner />
      <Alerts />
      <Body
        isDarkMode={isDarkMode}
        darkModeCallback={darkModeCallback}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        logoutCallback={logoutCallback}
      />
    </ThemeProvider>
  )

  return <>{theApp()}</>
}

export default connect(null, mapDispatchToProps)(App)
