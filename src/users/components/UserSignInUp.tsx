import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { getErrMsg, isLoggedIn, LocalStorage, resetAlert, resetSpinner, setAlert, setSpinner } from '../../app'
import { ALERT_TYPE_FAILURE, ALERT_TYPE_INFO, ALERT_TYPE_WARNING, INVALID_SIGNIN, SIGNIN_FIRST } from '../../constants'
import { login } from '../action/users.action'
import { AppUserLoginResponse } from '../types/users.data.types'
import { validateLoginInput } from '../utils/users.utils'

interface LoginProps {
  setAlert: (type: string, messageText: string) => void
  resetAlert: () => void
  setSpinner: () => void
  resetSpinner: () => void
}

const mapDispatchToProps = {
  setAlert: (type: string, messageText: string) => setAlert(type, messageText),
  resetAlert: () => resetAlert(),
  setSpinner: () => setSpinner(),
  resetSpinner: () => resetSpinner(),
}

const UserSignInUp = (props: LoginProps): React.ReactElement => {
  const { setAlert, resetAlert, setSpinner, resetSpinner } = props

  const [isShowSignin, setIsShowSignin] = useState(true)
  const [isShowReset, setIsShowReset] = useState(false)

  const userLoginSuccessLocalStorageActions = (appUserLoginResponse: AppUserLoginResponse) => {
    LocalStorage.setItem('token', appUserLoginResponse.token)
    LocalStorage.setItem('tokenExpiration', new Date().setMinutes(new Date().getMinutes() + 15))
    LocalStorage.setItem('appUserDetails', appUserLoginResponse.appUserDetails)
  }

  // redirect to home or selected page upon successful sign in
  const { state } = useLocation() as { state: { redirect: string; message: string } }
  const navigate = useNavigate()

  useEffect(() => {
    if (state?.message?.length) {
      setAlert(ALERT_TYPE_INFO, state.message)
    }
    if (state?.redirect && !isLoggedIn()) {
      setAlert(ALERT_TYPE_WARNING, SIGNIN_FIRST)
    }
    // state.message = ''
  }, [setAlert, state])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setSpinner()
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = data.get('username') as string
    const password = data.get('password') as string
    const isInputValid = validateLoginInput(username, password)

    if (isInputValid) {
      const loginResponse = await login(username, password)

      if (loginResponse.detail) {
        setAlert(ALERT_TYPE_FAILURE, getErrMsg(loginResponse.detail))
      } else {
        resetAlert()
        userLoginSuccessLocalStorageActions(loginResponse)
        navigate(state?.redirect || '/home', {
          replace: true,
          state: { redirect: '' },
        })
      }
    } else {
      setAlert(ALERT_TYPE_FAILURE, INVALID_SIGNIN)
    }
    resetSpinner()
  }

  const signInUpForm = () => {
    return (
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isShowSignin ? `Sign in` : isShowReset ? `Reset Password` : `Sign up`}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '25%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Email"
            name="username"
            placeholder="Your Email is your username"
            autoFocus
          />
          {!isShowReset && <><TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          {!isShowSignin && (
            <TextField margin="normal" required fullWidth id="fullName" label="Full Name" name="fullName" />
          )}</>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {isShowSignin ? `Submit Sign in` : isShowReset ? `Submit Password Reset` : `Submit Sign up`}
          </Button>
          <Button fullWidth variant="text" sx={{ mt: 3 }} onClick={() => {
            setIsShowSignin(!isShowSignin)
            setIsShowReset(false)
          }}>
            {isShowSignin ? `Don't have account? Click here to Sign up` : `Have account? Click here to sign in`}
          </Button>
          {!isShowReset && <Button fullWidth variant="text" onClick={() => {
            setIsShowReset(!isShowReset)
            setIsShowSignin(false)
          }}>
            Forgot Password? Click here to reset
          </Button>}
        </Box>
      </Box>
    )
  }

  const redirect = useCallback(() => {
    const pageToRedirectTo = state?.redirect
    if (pageToRedirectTo) {
      return <Navigate to={pageToRedirectTo} />
    } else {
      return <Navigate to="/home" />
    }
  }, [state])

  return <>{isLoggedIn() ? redirect() : signInUpForm()}</>
}

export default connect(null, mapDispatchToProps)(UserSignInUp)
