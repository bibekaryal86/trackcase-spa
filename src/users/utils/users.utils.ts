import { REGEX_LOGIN_INPUT_PATTERN, REGEX_LOGIN_PASSWORD_PATTERN } from '../../constants'

export const SHOW_FORM_TYPE = Object.freeze({
  SIGNIN: 'SIGNIN',
  SIGNUP: 'SIGNUP',
  RESET_INIT: 'RESET_INIT',
  RESET_EXIT: 'RESET_EXIT',
  VALIDATE: 'VALIDATE',
})

export const validatePassword = (password: string, confirmPassword: string) => password === confirmPassword

export const validateSignInUpInput = (
  username: string,
  password: string,
  fullName: string,
  showFormType: string,
): boolean => {
  if (showFormType === SHOW_FORM_TYPE.VALIDATE || showFormType === SHOW_FORM_TYPE.RESET_INIT) {
    return !!(username && username.length > 6 && username.length < 49 && REGEX_LOGIN_INPUT_PATTERN.test(username))
  } else if (showFormType === SHOW_FORM_TYPE.SIGNIN || showFormType === SHOW_FORM_TYPE.RESET_EXIT) {
    return !!(
      username &&
      password &&
      username.length > 6 &&
      password.length > 6 &&
      username.length < 49 &&
      password.length < 21 &&
      REGEX_LOGIN_INPUT_PATTERN.test(username) &&
      REGEX_LOGIN_PASSWORD_PATTERN.test(password)
    )
  } else {
    return !!(
      username &&
      password &&
      fullName &&
      username.length > 6 &&
      password.length > 6 &&
      fullName.length > 6 &&
      username.length < 49 &&
      password.length < 21 &&
      fullName.length < 49 &&
      REGEX_LOGIN_INPUT_PATTERN.test(username) &&
      REGEX_LOGIN_PASSWORD_PATTERN.test(password)
    )
  }
}
