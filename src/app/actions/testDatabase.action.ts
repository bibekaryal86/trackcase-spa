import { getEndpoint } from '@app/utils/app.utils.ts'
import { Async, FetchOptions } from '@app/utils/fetch.utils.ts'

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
