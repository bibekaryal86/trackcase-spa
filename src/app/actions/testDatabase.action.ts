import { getEndpoint } from '../utils/app.utils'
import { Async, FetchOptions } from '../utils/fetch.utils'

export const testDatabase = () => {
  try {
    const testDatabaseEndpoint = getEndpoint(process.env.TEST_DB_ENDPOINT as string)
    const options: Partial<FetchOptions> = {
      method: 'GET',
    }

    Async.fetch(testDatabaseEndpoint, options).then((r) => console.log(r))
  } catch (error) {
    console.log('Test Database Action Error: ', error)
  }
}
