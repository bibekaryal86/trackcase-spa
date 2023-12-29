import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { INVALID_SESSION } from '../../constants'
import { userLogout } from '../actions/logout.action'
import { LocalStorage } from '../utils/storage.utils'

interface SessionTimeoutProps {
  userLogout: () => void
}

const SessionTimeout = (props: SessionTimeoutProps) => {
  // log out when inactive
  const { userLogout } = props
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
      userLogout()

      navigate('/', {
        replace: true,
        state: { message: INVALID_SESSION },
      })
    },
    [navigate, userLogout],
  )

  const warningInactive = useCallback(() => {
    clearTimeout(startTimerInterval.current)
    warningInactiveInterval.current = window.setInterval(() => {
      const tokenExpiration = LocalStorage.getItem('tokenExpiration') as number
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

    const isAuthenticated = LocalStorage.getItem('tokenExpiration') as number
    const isForceCheckout = LocalStorage.getItem('forceLogout') as boolean

    if (isForceCheckout && isAuthenticated) {
      navigateToHome('Token Invalid Redirecting to Home')
    } else if (isAuthenticated) {
      LocalStorage.setItem('tokenExpiration', new Date().setMinutes(new Date().getMinutes() + 15))
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

const mapDispatchToProps = {
  userLogout: () => userLogout(),
}

export default connect(null, mapDispatchToProps)(SessionTimeout)
