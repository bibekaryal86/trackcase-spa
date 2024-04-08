import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import {
  ALERT_TYPES,
  INVALID_INPUT,
  INVALID_PASSWORD,
  LOGIN_SHOW_FORM_TYPE,
  LoginShowFormType,
  RESET_EXIT_SUCCESS,
  RESET_INIT_FAILURE,
  RESET_INIT_SUCCESS,
  SIGNUP_SUCCESS,
  SOMETHING_WENT_WRONG,
  VALIDATE_FAILURE,
  VALIDATE_SUCCESS,
} from '@constants/index'

import { getErrMsg, getString, resetAlert, resetSpinner, SessionStorage, setAlert, setSpinner } from '../../app'
import { login, resetExit, resetInit, signup, validateInit } from '../action/users.action'
import { AppUserLoginResponse } from '../types/users.data.types'
import { isLoggedIn, validatePassword, validateSignInUpInput } from '../utils/users.utils'

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
  const formRef = useRef(null)
  const [showFormType, setShowFormType] = useState(LOGIN_SHOW_FORM_TYPE.SIGNIN.toString())
  const [userToReset, setUserToReset] = useState('')

  const userLoginSuccessSessionStorageAction = (appUserLoginResponse: AppUserLoginResponse) => {
    SessionStorage.setItem('token', appUserLoginResponse.token)
    SessionStorage.setItem('tokenExpiration', new Date().setMinutes(new Date().getMinutes() + 15))
    SessionStorage.setItem('appUserDetails', appUserLoginResponse.appUserDetails)
  }

  // redirect to home or selected page upon successful sign in
  const { state } = useLocation() as { state: { redirect: string } }
  const navigate = useNavigate()
  const [searchQueryParams] = useSearchParams()
  const isValidatedQp = searchQueryParams.get('is_validated')
  const isResetExitQp = searchQueryParams.get('is_reset')
  const userToResetQp = searchQueryParams.get('to_reset')

  useEffect(() => {
    if (isValidatedQp) {
      if (isValidatedQp === 'true') {
        setAlert(ALERT_TYPES.SUCCESS, VALIDATE_SUCCESS)
      } else {
        setShowFormType(LOGIN_SHOW_FORM_TYPE.VALIDATE)
        setAlert(ALERT_TYPES.WARNING, VALIDATE_FAILURE)
      }
    }
  }, [isValidatedQp, setAlert])

  useEffect(() => {
    if (isResetExitQp) {
      if (isResetExitQp === 'true') {
        setShowFormType(LOGIN_SHOW_FORM_TYPE.RESET_EXIT)
        if (userToResetQp) {
          setUserToReset(getString(userToResetQp).toLowerCase())
        }
      } else if (isResetExitQp === 'false') {
        setShowFormType(LOGIN_SHOW_FORM_TYPE.RESET_EXIT)
        setAlert(ALERT_TYPES.WARNING, RESET_INIT_FAILURE)
      }
    }
  }, [isResetExitQp, setAlert, userToResetQp])

  const resetState = () => {
    setShowFormType(LOGIN_SHOW_FORM_TYPE.SIGNIN)
    setUserToReset('')
    formRef && formRef.current && (formRef.current as HTMLFormElement).reset()
  }

  const handleRevalidateSubmit = async (username: string) => {
    const revalidateResponse = await validateInit(username)
    if (revalidateResponse.detail) {
      setAlert(ALERT_TYPES.ERROR, getErrMsg(revalidateResponse.detail))
    } else {
      resetState()
      setAlert(ALERT_TYPES.SUCCESS, SIGNUP_SUCCESS)
    }
  }

  const handleResetInitSubmit = async (username: string) => {
    const resetInitResponse = await resetInit(username)
    if (resetInitResponse.detail) {
      setAlert(ALERT_TYPES.ERROR, getErrMsg(resetInitResponse.detail))
    } else {
      resetState()
      setAlert(ALERT_TYPES.SUCCESS, RESET_INIT_SUCCESS)
    }
  }

  const handleResetExitSubmit = async (password: string) => {
    const resetExitResponse = await resetExit(userToReset, password)
    if (resetExitResponse.detail) {
      setAlert(ALERT_TYPES.ERROR, getErrMsg(resetExitResponse.detail))
    } else {
      resetState()
      setAlert(ALERT_TYPES.SUCCESS, RESET_EXIT_SUCCESS)
    }
  }

  const handleSigninSubmit = async (username: string, password: string) => {
    const loginResponse = await login(username, password)
    if (loginResponse.detail) {
      setAlert(ALERT_TYPES.ERROR, getErrMsg(loginResponse.detail))
    } else {
      resetState()
      resetAlert()
      userLoginSuccessSessionStorageAction(loginResponse)
      navigate(state?.redirect || '/home', {
        replace: true,
        state: { redirect: '' },
      })
    }
  }

  const handleSignupSubmit = async (username: string, password: string, fullName: string) => {
    const signupResponse = await signup(username, password, fullName)
    if (signupResponse.detail) {
      setAlert(ALERT_TYPES.ERROR, getErrMsg(signupResponse.detail))
    } else {
      resetState()
      setAlert(ALERT_TYPES.SUCCESS, SIGNUP_SUCCESS)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setSpinner()
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const username = (data.get('username') as string) || userToReset
    const password = data.get('password') as string
    const confirmPassword = data.get('confirmPassword') as string
    const fullName = data.get('fullName') as string
    const isInputValid = validateSignInUpInput(username, password, fullName, showFormType as LoginShowFormType)

    if (isInputValid) {
      if (showFormType === LOGIN_SHOW_FORM_TYPE.VALIDATE) {
        await handleRevalidateSubmit(username)
      } else if (showFormType === LOGIN_SHOW_FORM_TYPE.RESET_INIT) {
        await handleResetInitSubmit(username)
      } else if (showFormType === LOGIN_SHOW_FORM_TYPE.RESET_EXIT) {
        if (validatePassword(password, confirmPassword)) {
          await handleResetExitSubmit(password)
        } else {
          setAlert(ALERT_TYPES.ERROR, INVALID_PASSWORD)
        }
      } else if (showFormType === LOGIN_SHOW_FORM_TYPE.SIGNUP) {
        if (validatePassword(password, confirmPassword)) {
          await handleSignupSubmit(username, password, fullName)
        } else {
          setAlert(ALERT_TYPES.ERROR, INVALID_PASSWORD)
        }
      } else if (showFormType === LOGIN_SHOW_FORM_TYPE.SIGNIN) {
        await handleSigninSubmit(username, password)
      } else {
        setAlert(ALERT_TYPES.ERROR, `Oops! ${SOMETHING_WENT_WRONG}`)
      }
    } else {
      setAlert(ALERT_TYPES.ERROR, INVALID_INPUT)
    }
    resetSpinner()
  }

  const formHeader = () => {
    if (showFormType === LOGIN_SHOW_FORM_TYPE.VALIDATE) {
      return 'Resend validation'
    } else if (showFormType === LOGIN_SHOW_FORM_TYPE.RESET_INIT || showFormType === LOGIN_SHOW_FORM_TYPE.RESET_EXIT) {
      return 'Reset password'
    } else if (showFormType === LOGIN_SHOW_FORM_TYPE.SIGNUP) {
      return 'Sign up'
    } else if (showFormType === LOGIN_SHOW_FORM_TYPE.SIGNIN) {
      return 'Sign in'
    } else {
      return 'Form Header'
    }
  }

  const formBody = () => {
    if (showFormType === LOGIN_SHOW_FORM_TYPE.VALIDATE || showFormType === LOGIN_SHOW_FORM_TYPE.RESET_INIT) {
      return (
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
      )
    } else if (showFormType === LOGIN_SHOW_FORM_TYPE.SIGNUP) {
      return (
        <>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
          />
          <TextField margin="normal" required fullWidth id="fullName" label="Full Name" name="fullName" />
        </>
      )
    } else if (showFormType === LOGIN_SHOW_FORM_TYPE.RESET_EXIT) {
      return (
        <>
          <Typography variant="body1">Email: {userToReset}</Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
          />
        </>
      )
    } else {
      return (
        <>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
        </>
      )
    }
  }

  const formFooter = () => {
    if (
      showFormType === LOGIN_SHOW_FORM_TYPE.VALIDATE ||
      showFormType === LOGIN_SHOW_FORM_TYPE.RESET_INIT ||
      showFormType === LOGIN_SHOW_FORM_TYPE.RESET_EXIT ||
      showFormType === LOGIN_SHOW_FORM_TYPE.SIGNUP
    ) {
      return (
        <Button fullWidth variant="text" sx={{ mt: 3 }} onClick={() => setShowFormType(LOGIN_SHOW_FORM_TYPE.SIGNIN)}>
          Have account? Click here to sign in
        </Button>
      )
    } else if (showFormType === LOGIN_SHOW_FORM_TYPE.SIGNIN) {
      return (
        <>
          <Button fullWidth variant="text" sx={{ mt: 3 }} onClick={() => setShowFormType(LOGIN_SHOW_FORM_TYPE.SIGNUP)}>
            No account? Click here to sign up
          </Button>
          <Button fullWidth variant="text" onClick={() => setShowFormType(LOGIN_SHOW_FORM_TYPE.RESET_INIT)}>
            Forgot password? Click here to reset
          </Button>
        </>
      )
    } else {
      return (
        <Button fullWidth variant="text" sx={{ mt: 3 }}>
          Form Footer
        </Button>
      )
    }
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
          {formHeader()}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          ref={formRef}
        >
          {formBody()}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Submit
          </Button>
          {formFooter()}
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
