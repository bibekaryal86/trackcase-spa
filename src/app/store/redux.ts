/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { composeWithDevTools } from '@redux-devtools/extension'
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import thunk from 'redux-thunk'

import { calendars, CalendarsState } from '../../calendars'
import { courtCases, CourtCasesState } from '../../cases'
import { clients, ClientsState } from '../../clients'
import { collections, CollectionsState } from '../../collections'
import { courts, CourtsState } from '../../courts'
import { forms, FormsState } from '../../filings'
import { judges, JudgesState } from '../../judges'
import { refTypes, RefTypesState } from '../../types'
import alert from '../reducers/alert.reducer'
import spinner from '../reducers/spinner.reducer'
import statuses from '../reducers/statuses.reducer'
import { USER_LOGOUT } from '../types/app.action.types'
import { AlertState, SpinnerState, StatusState } from '../types/app.data.types'

// ACTIONS (ESP: FETCH ACTIONS) SHOULD BE NAMED IN THE FOLLOWING PATTERN:
// xxx_REQUEST, xxx_SUCCESS, xxx_FAILURE, xxx_COMPLETE
// see spinner.reducer.ts for reason

export interface GlobalState {
  alert: AlertState
  spinner: SpinnerState
  statuses: StatusState
  refTypes: RefTypesState
  courts: CourtsState
  judges: JudgesState
  clients: ClientsState
  courtCases: CourtCasesState
  forms: FormsState
  calendars: CalendarsState
  collections: CollectionsState
}

export interface GlobalDispatch {
  type: string
}

const appReducers = combineReducers({
  alert,
  spinner,
  statuses,
  refTypes,
  courts,
  judges,
  clients,
  courtCases,
  forms,
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
