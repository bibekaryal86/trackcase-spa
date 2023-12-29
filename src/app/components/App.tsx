import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Alerts from './Alerts'
import Body from './Body'
import SessionTimeout from './SessionTimeout'
import Spinner from './Spinner'
import { IS_DARK_MODE, IS_OPEN_DRAWER } from '../../constants'
import { userLogout } from '../actions/logout.action'
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
  userLogout: () => void
}

function App(props: AppProps): React.ReactElement {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const openDrawerCallback = () => {
    setIsOpenDrawer((prevState) => !prevState)
    SessionStorage.setItem(IS_OPEN_DRAWER, String(!isOpenDrawer))
  }
  const darkModeCallback = () => {
    setIsDarkMode((prevState) => !prevState)
    SessionStorage.setItem(IS_DARK_MODE, String(!isDarkMode))
  }

  // redirect to sign in page when log out
  const navigate = useNavigate()
  const userLogoutCallback = () => {
    props.userLogout()
    navigate('/', {
      replace: true,
    })
  }

  // when page is reloaded, set drawer and dark mode
  useEffect(() => {
    const isOpenDrawerSession = SessionStorage.getItem(IS_OPEN_DRAWER) as string
    const isDarkModeSession = SessionStorage.getItem(IS_DARK_MODE) as string

    if (isOpenDrawerSession) {
      setIsOpenDrawer(isOpenDrawerSession === 'true')
    }

    if (isDarkModeSession) {
      setIsDarkMode(isDarkModeSession === 'true')
    }
  }, [])

  const theApp = () => (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <SessionTimeout />
      <Spinner />
      <Alerts />
      <Body
        isDarkMode={isDarkMode}
        darkModeCallback={darkModeCallback}
        isOpenDrawer={isOpenDrawer}
        openDrawerCallback={openDrawerCallback}
        userLogoutCallback={userLogoutCallback}
      />
    </ThemeProvider>
  )

  return <>{theApp()}</>
}

const mapDispatchToProps = {
  userLogout: () => userLogout(),
}

export default connect(null, mapDispatchToProps)(App)
