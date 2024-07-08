/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { composeWithDevTools } from '@redux-devtools/extension'
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import { thunk } from 'redux-thunk'

import calendars from '@calendars/reducers/calendars.reducer'
import { CalendarsState } from '@calendars/types/calendars.data.types'
import courtCases from '@cases/reducers/courtCases.reducer'
import { CourtCasesState } from '@cases/types/courtCases.data.types'
import clients from '@clients/reducers/clients.reducer'
import { ClientsState } from '@clients/types/clients.data.types'
import collections from '@collections/reducers/collections.reducer'
import { CollectionsState } from '@collections/types/collections.data.types'
import courts from '@courts/reducers/courts.reducer'
import { CourtsState } from '@courts/types/courts.data.types'
import filings from '@filings/reducers/filings.reducer'
import { FilingsState } from '@filings/types/filings.data.types'
import judges from '@judges/reducers/judges.reducer'
import { JudgesState } from '@judges/types/judges.data.types'
import refTypes from '@ref_types/reducers/refTypes.reducer'
import { RefTypesState } from '@ref_types/types/refTypes.data.types'

import alert from '../reducers/alert.reducer'
import spinner from '../reducers/spinner.reducer'
import { USER_LOGOUT } from '../types/app.action.types'
import { AlertState, SpinnerState } from '../types/app.data.types'

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
    : createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, reduxImmutableStateInvariant())))

export default store
