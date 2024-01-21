import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import Link from './Link'
import { ALERT_TYPE_FAILURE, ALERT_TYPE_INFO, ALERT_TYPE_WARNING, INVALID_SIGNIN, SIGNIN_FIRST } from '../../constants'
import { userLogin } from '../actions/login.action'
import { LoginResponse } from '../types/app.data.types'
import { resetAlert, setAlert } from '../utils/alerts.utils'
import { isLoggedIn, validateLoginInput } from '../utils/app.utils'
import { resetSpinner, setSpinner } from '../utils/spinner.utils'
import { LocalStorage } from '../utils/storage.utils'

interface LoginProps {
  setAlert: (type: string, messageText: string) => void
  resetAlert: () => void
  setSpinner: () => void
  resetSpinner: () => void
}

const Login = (props: LoginProps): React.ReactElement => {
  const { setAlert, resetAlert, setSpinner, resetSpinner } = props

  const userLoginSuccessLocalStorageActions = (loginResponse: LoginResponse) => {
    LocalStorage.setItem('token', loginResponse.token)
    LocalStorage.setItem('tokenExpiration', new Date().setMinutes(new Date().getMinutes() + 15))
    LocalStorage.setItem('userDetails', loginResponse.user_details)
  }

  // redirect to home or selected page upon successful sign in
  const { state } = useLocation() as { state: { redirect: string; message: string } }
  const navigate = useNavigate()

  const redirect = useCallback(() => {
    const pageToRedirectTo = state?.redirect
    if (pageToRedirectTo) {
      return <Navigate to={pageToRedirectTo} />
    } else {
      return <Navigate to="/home" />
    }
  }, [state])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setSpinner()
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = data.get('username') as string
    const password = data.get('password') as string
    const isInputValid = validateLoginInput(username, password)

    if (isInputValid) {
      const loginResponse = await userLogin(username, password)

      if (loginResponse.errMsg) {
        setAlert(ALERT_TYPE_FAILURE, loginResponse.errMsg)
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

  const loginForm = () => {
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="username" label="User Name" name="username" autoFocus />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link text="Forgot Password?" navigateToPage="/forgot-password" />
            </Grid>
              <Grid item xs>
                <Link text="Don't Have an Account? Sign Up!" navigateToPage="/sign-up" />
            </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }

  useEffect(() => {
    if (state?.message?.length) {
      setAlert(ALERT_TYPE_INFO, state.message)
    }
    if (state?.redirect && !isLoggedIn()) {
      setAlert(ALERT_TYPE_WARNING, SIGNIN_FIRST)
    }
    // state.message = ''
  }, [setAlert, state])

  return <>{isLoggedIn() ? redirect() : loginForm()}</>
}

const mapDispatchToProps = {
  setAlert: (type: string, messageText: string) => setAlert(type, messageText),
  resetAlert: () => resetAlert(),
  setSpinner: () => setSpinner(),
  resetSpinner: () => resetSpinner(),
}

export default connect(null, mapDispatchToProps)(Login)
