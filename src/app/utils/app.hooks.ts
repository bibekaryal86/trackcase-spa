import { useSelector } from 'react-redux'

import { GlobalState } from '../store/redux'

export const useStateData = <K extends keyof GlobalState>(key: K): GlobalState[K] => {
  return useSelector((state: GlobalState) => state[key])
}
