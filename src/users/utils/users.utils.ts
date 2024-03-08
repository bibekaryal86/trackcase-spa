import { REGEX_LOGIN_INPUT_PATTERN } from '../../constants'

export const validateLoginInput = (username: string, password: string): boolean =>
  !!(
    username &&
    password &&
    username.length > 6 &&
    password.length > 6 &&
    username.length < 21 &&
    password.length < 21 &&
    REGEX_LOGIN_INPUT_PATTERN.test(username) &&
    REGEX_LOGIN_INPUT_PATTERN.test(password)
  )
