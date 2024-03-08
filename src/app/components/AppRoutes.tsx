import { CurrencyBitcoinRounded } from '@mui/icons-material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CasesRoundedIcon from '@mui/icons-material/CasesRounded'
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded'
import ChecklistRtlRoundedIcon from '@mui/icons-material/ChecklistRtlRounded'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded'
import GroupsIcon from '@mui/icons-material/Groups'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import TodayIcon from '@mui/icons-material/Today'
import WorkIcon from '@mui/icons-material/Work'
import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import NotFound from './NotFound'
import { Calendars } from '../../calendars'
import { CourtCase, CourtCases } from '../../cases'
import { Client, Clients } from '../../clients'
import { Collections } from '../../collections'
import { Court, Courts } from '../../courts'
import { Form, Forms } from '../../forms'
import { Home } from '../../home'
import { Judge, Judges } from '../../judges'
import { CaseTypes, CollectionMethods, FormTypes, HearingTypes, TaskTypes } from '../../types'
import { UserSignInUp } from '../../users'
import { RoutesType } from '../types/app.data.types'
import { isLoggedIn } from '../utils/app.utils'

const publicRoutes: RoutesType[] = [
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/',
    element: <UserSignInUp />,
  },
]

export const protectedRoutes: RoutesType[] = [
  {
    path: '/home',
    // display: 'Home',
    element: <Home />,
  },
  {
    path: '/collections',
    display: 'Collections',
    element: <Collections />,
    icon: <CurrencyExchangeIcon />,
  },
  // {
  //   path: '/collection',
  //   element: <Collection />,
  //   subroutes: [
  //     {
  //       path: ':type/:id',
  //       element: <Collection />,
  //     },
  //   ],
  // },
  {
    path: '/calendars',
    display: 'Calendars',
    element: <Calendars />,
    icon: <TodayIcon />,
  },
  // {
  //   path: '/calendar',
  //   element: <Calendar />,
  //   subroutes: [
  //     {
  //       path: ':type/:id',
  //       element: <Calendar />,
  //     },
  //   ],
  // },
  {
    path: '/forms',
    display: 'Filings',
    element: <Forms />,
    icon: <FileOpenIcon />,
  },
  {
    path: '/form',
    element: <Form />,
    subroutes: [
      {
        path: ':id',
        element: <Form />,
      },
    ],
  },
  {
    path: '/court_cases',
    display: 'Cases',
    element: <CourtCases />,
    icon: <WorkIcon />,
  },
  {
    path: '/court_case',
    element: <CourtCase />,
    subroutes: [
      {
        path: ':id',
        element: <CourtCase />,
      },
    ],
  },
  {
    path: '/clients',
    display: 'Clients',
    element: <Clients />,
    icon: <GroupsIcon />,
  },
  {
    path: '/client',
    element: <Client />,
    subroutes: [
      {
        path: ':id',
        element: <Client />,
      },
    ],
  },
  {
    path: '/judges',
    display: 'Judges',
    element: <Judges />,
    icon: <RecentActorsIcon />,
  },
  {
    path: '/judge',
    element: <Judge />,
    subroutes: [
      {
        path: ':id',
        element: <Judge />,
      },
    ],
  },
  {
    path: '/courts',
    display: 'Courts',
    element: <Courts />,
    icon: <AccountBalanceIcon />,
  },
  {
    path: '/court',
    element: <Court />,
    subroutes: [
      {
        path: ':id',
        element: <Court />,
      },
    ],
  },
]

export const refTypesRoutes: RoutesType[] = [
  {
    path: '/case_types',
    display: 'Case Types',
    element: <CaseTypes />,
    icon: <CasesRoundedIcon />,
  },
  {
    path: '/collection_methods',
    display: 'Collection Methods',
    element: <CollectionMethods />,
    icon: <CurrencyBitcoinRounded />,
  },
  {
    path: '/form_types',
    display: 'Filing Types',
    element: <FormTypes />,
    icon: <FilePresentRoundedIcon />,
  },
  {
    path: '/hearing_types',
    display: 'Hearing Types',
    element: <HearingTypes />,
    icon: <ChecklistRtlRoundedIcon />,
  },
  {
    path: '/task_types',
    display: 'Task Types',
    element: <TaskTypes />,
    icon: <ChecklistRoundedIcon />,
  },
]

function RequireAuth({ children }: { children: React.ReactElement }) {
  const location = useLocation()
  const authState = isLoggedIn()
  return authState ? children : <Navigate to="/" replace state={{ redirect: location.pathname }} />
}

const getElement = (children: React.ReactElement | undefined) => children && <RequireAuth>{children}</RequireAuth>

const AppRoutes = (): React.ReactElement => {
  return (
    <Routes>
      {publicRoutes.map((publicRoute) => (
        <Route key={publicRoute.path} path={publicRoute.path} element={publicRoute.element} />
      ))}
      {protectedRoutes.map((protectedRoute) => (
        <Route key={protectedRoute.path} path={protectedRoute.path} element={getElement(protectedRoute.element)}>
          {protectedRoute.subroutes &&
            protectedRoute.subroutes.map((subroute) => (
              <Route key={subroute.path} path={subroute.path} element={getElement(subroute.element)} />
            ))}
        </Route>
      ))}
      {protectedRoutes.map(
        (protectedRoute) =>
          protectedRoute.submenus &&
          protectedRoute.submenus.map((submenu) => (
            <Route key={submenu.path} path={submenu.path} element={getElement(submenu.element)}>
              {submenu.subroutes &&
                submenu.subroutes.map((subroute) => (
                  <Route key={subroute.path} path={subroute.path} element={getElement(subroute.element)} />
                ))}
            </Route>
          )),
      )}
      {refTypesRoutes.map((refTypesRoute) => (
        <Route key={refTypesRoute.path} path={refTypesRoute.path} element={getElement(refTypesRoute.element)} />
      ))}
    </Routes>
  )
}

export default AppRoutes
