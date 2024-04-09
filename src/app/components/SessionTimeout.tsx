import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { INVALID_SESSION } from '@constants/index'
import { logout } from '@users/action/users.action'

import { LocalStorage, SessionStorage } from '../utils/storage.utils'

interface SessionTimeoutProps {
  logout: () => void
}

const mapDispatchToProps = {
  logout: () => logout(),
}

const SessionTimeout = (props: SessionTimeoutProps) => {
  // log out when inactive
  const { logout } = props
  // redirect to home page when log out
  const navigate = useNavigate()

  const events = useMemo(() => ['keypress', 'mousemove', 'click'], [])
  const warningInactiveInterval = useRef(0)
  const startTimerInterval = useRef(0)

  const navigateToHome = useCallback(
    (msg: string) => {
      console.log('SessionTimeout: ', msg)
      clearInterval(warningInactiveInterval.current)
      clearTimeout(startTimerInterval.current)
      logout()

      navigate('/', {
        replace: true,
        state: { message: INVALID_SESSION },
      })
    },
    [navigate, logout],
  )

  const warningInactive = useCallback(() => {
    clearTimeout(startTimerInterval.current)
    warningInactiveInterval.current = window.setInterval(() => {
      const tokenExpiration = SessionStorage.getItem('tokenExpiration') as number
      const tokenExpDate = tokenExpiration ? new Date(tokenExpiration) : new Date()
      const currentDateTime = new Date()

      if (tokenExpiration && tokenExpDate <= currentDateTime) {
        navigateToHome('Token Expired, Redirecting to Home')
      }
    }, 1000)
  }, [navigateToHome])

  // start inactive check
  const timeChecker = useCallback(() => {
    startTimerInterval.current = window.setTimeout(() => {
      warningInactive()
    }, 60000)
  }, [warningInactive])

  // reset interval timer
  const resetTimer = useCallback(() => {
    clearTimeout(startTimerInterval.current)
    clearInterval(warningInactiveInterval.current)

    const isAuthenticated = SessionStorage.getItem('tokenExpiration') as number
    const isForceCheckout = LocalStorage.getItem('forceLogout') as boolean

    if (isForceCheckout && isAuthenticated) {
      navigateToHome('Token Invalid Redirecting to Home')
    } else if (isAuthenticated) {
      SessionStorage.setItem('tokenExpiration', new Date().setMinutes(new Date().getMinutes() + 15))
    } else {
      clearInterval(warningInactiveInterval.current)
    }

    timeChecker()
  }, [navigateToHome, timeChecker])

  useEffect(() => {
    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    timeChecker()

    return () => {
      clearTimeout(startTimerInterval.current)
      resetTimer()
    }
  }, [resetTimer, events, timeChecker])

  // change fragment to modal and handleClose func to close
  return <Fragment />
}

export default connect(null, mapDispatchToProps)(SessionTimeout)
