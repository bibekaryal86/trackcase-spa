import { FAIL_SIGNIN, SOMETHING_WENT_WRONG } from '../../constants'
import { DefaultLoginResponse, LoginResponse } from '../types/app.data.types'
import { getEndpoint, getErrMsg } from '../utils/app.utils'
import { Async, FetchOptions } from '../utils/fetch.utils'

export const userLogin = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const loginEndpoint = getEndpoint(process.env.LOGIN_ENDPOINT as string, false)
    const options: Partial<FetchOptions> = {
      method: 'POST',
      noAuth: true,
      requestBody: {
        username,
        password,
      },
    }

    const loginResponse = (await Async.fetch(loginEndpoint, options)) as LoginResponse

    if (loginResponse?.token?.length) {
      return loginResponse
    } else {
      console.log('Login Action Failed: ', loginResponse)
      if (loginResponse?.detail) {
        return { ...DefaultLoginResponse, errMsg: getErrMsg(loginResponse.detail) }
      } else {
        return { ...DefaultLoginResponse, errMsg: FAIL_SIGNIN }
      }
    }
  } catch (error) {
    console.log('Login Action Error: ', error)
    return { ...DefaultLoginResponse, errMsg: SOMETHING_WENT_WRONG }
  }
}
