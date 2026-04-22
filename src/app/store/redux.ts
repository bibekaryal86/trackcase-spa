/* eslint-disable @typescript-eslint/no-explicit-any */
import { composeWithDevTools } from '@redux-devtools/extension'
import { useDispatch as useReduxDispatch } from 'react-redux'
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import { thunk, ThunkDispatch } from 'redux-thunk'

import alert from '@app/reducers/alert.reducer.ts'
import spinner from '@app/reducers/spinner.reducer.ts'
import { USER_LOGOUT } from '@app/types/app.action.types.ts'
import { AlertState, SpinnerState } from '@app/types/app.data.types.ts'
import calendars from '@calendars/reducers/calendars.reducer.ts'
import { CalendarsState } from '@calendars/types/calendars.data.types.ts'
import courtCases from '@cases/reducers/courtCases.reducer.ts'
import { CourtCasesState } from '@cases/types/courtCases.data.types.ts'
import clients from '@clients/reducers/clients.reducer.ts'
import { ClientsState } from '@clients/types/clients.data.types.ts'
import collections from '@collections/reducers/collections.reducer.ts'
import { CollectionsState } from '@collections/types/collections.data.types.ts'
import courts from '@courts/reducers/courts.reducer.ts'
import { CourtsState } from '@courts/types/courts.data.types.ts'
import filings from '@filings/reducers/filings.reducer.ts'
import { FilingsState } from '@filings/types/filings.data.types.ts'
import judges from '@judges/reducers/judges.reducer.ts'
import { JudgesState } from '@judges/types/judges.data.types.ts'
import refTypes from '@ref_types/reducers/refTypes.reducer.ts'
import { RefTypesState } from '@ref_types/types/refTypes.data.types.ts'


// ACTIONS (ESP: FETCH ACTIONS) SHOULD BE NAMED IN THE FOLLOWING PATTERN:
// xxx_REQUEST, xxx_SUCCESS, xxx_FAILURE, xxx_COMPLETE
// see spinner.reducer.ts for reason

export interface GlobalState {
  alert: AlertState
  spinner: SpinnerState
  refTypes: RefTypesState
  courts: CourtsState
  judges: JudgesState
  clients: ClientsState
  courtCases: CourtCasesState
  filings: FilingsState
  calendars: CalendarsState
  collections: CollectionsState
}

export interface GlobalDispatch {
  type: string
}

export const useGlobalDispatch = () => useReduxDispatch<ThunkDispatch<GlobalState, void, GlobalDispatch>>()

const appReducers = combineReducers({
  alert,
  spinner,
  refTypes,
  courts,
  judges,
  clients,
  courtCases,
  filings,
  calendars,
  collections,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === USER_LOGOUT) {
    state = undefined
  }
  return appReducers(state, action)
}

const store =
  process.env.NODE_ENV === 'production'
    ? createStore(rootReducer, applyMiddleware(thunk))
    : createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
