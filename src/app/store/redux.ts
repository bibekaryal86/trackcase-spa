/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { composeWithDevTools } from '@redux-devtools/extension'
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import thunk from 'redux-thunk'

import { courtCases, CourtCasesState } from '../../cases'
import { clients, ClientsState } from '../../clients'
import { courts, CourtsState } from '../../courts'
import { judges, JudgesState } from '../../judges'
import {
  caseTypes,
  CaseTypeState,
  collectionMethods,
  CollectionMethodState,
  formTypes,
  FormTypeState,
  hearingTypes,
  HearingTypeState,
  refTypes,
  RefTypesState,
  taskTypes,
  TaskTypeState,
} from '../../types'
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
  caseTypes: CaseTypeState
  collectionMethods: CollectionMethodState
  formTypes: FormTypeState
  hearingTypes: HearingTypeState
  taskTypes: TaskTypeState
  courts: CourtsState
  judges: JudgesState
  clients: ClientsState
  courtCases: CourtCasesState
}

export interface GlobalDispatch {
  type: string
}

const appReducers = combineReducers({
  alert,
  spinner,
  statuses,
  refTypes,
  caseTypes,
  collectionMethods,
  formTypes,
  hearingTypes,
  taskTypes,
  courts,
  judges,
  clients,
  courtCases,
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
