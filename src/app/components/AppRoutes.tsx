import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CasesRoundedIcon from '@mui/icons-material/CasesRounded'
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded'
import ChecklistRtlRoundedIcon from '@mui/icons-material/ChecklistRtlRounded'
import Contacts from '@mui/icons-material/Contacts'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded'
import FlareIcon from '@mui/icons-material/Flare'
import Groups from '@mui/icons-material/Groups'
import LocalAtm from '@mui/icons-material/LocalAtm'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import TodayIcon from '@mui/icons-material/Today'
import WorkIcon from '@mui/icons-material/Work'
import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Calendars from '@calendars/components/Calendars'
import CourtCase from '@cases/components/CourtCase'
import CourtCases from '@cases/components/CourtCases'
import Client from '@clients/components/Client'
import Clients from '@clients/components/Clients'
import Collections from '@collections/components/Collections'
import { ALERT_TYPES, INCOMPLETE_PERMISSION, REF_TYPES_REGISTRY } from '@constants/index'
import Court from '@courts/components/Court'
import Courts from '@courts/components/Courts'
import Filing from '@filings/components/Filing'
import Filings from '@filings/components/Filings'
import Home from '@home/components/Home'
import Judge from '@judges/components/Judge'
import Judges from '@judges/components/Judges'
import RefTypes from '@ref_types/components/RefTypes'
import UserAdmin from '@users/components/UserAdmin'
import UserSignInUp from '@users/components/UserSignInUp'
import { checkUserHasPermission, isLoggedIn } from '@users/utils/users.utils'

import NotFound from './NotFound'
import { RoutesType } from '../types/app.data.types'

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
    path: '/filings',
    display: 'Filings',
    element: <Filings />,
    icon: <FileOpenIcon />,
  },
  {
    path: '/filing',
    element: <Filing />,
    subroutes: [
      {
        path: ':id',
        element: <Filing />,
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
    icon: <Contacts />,
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
    path: '/component_status',
    display: 'Component Status',
    element: <RefTypes refType={REF_TYPES_REGISTRY.COMPONENT_STATUS} />,
    icon: <FlareIcon />,
  },
  {
    path: '/case_type',
    display: 'Case Types',
    element: <RefTypes refType={REF_TYPES_REGISTRY.CASE_TYPE} />,
    icon: <CasesRoundedIcon />,
  },
  {
    path: '/collection_method',
    display: 'Collection Methods',
    element: <RefTypes refType={REF_TYPES_REGISTRY.COLLECTION_METHOD} />,
    icon: <LocalAtm />,
  },
  {
    path: '/filing_type',
    display: 'Filing Types',
    element: <RefTypes refType={REF_TYPES_REGISTRY.FILING_TYPE} />,
    icon: <FilePresentRoundedIcon />,
  },
  {
    path: '/hearing_type',
    display: 'Hearing Types',
    element: <RefTypes refType={REF_TYPES_REGISTRY.HEARING_TYPE} />,
    icon: <ChecklistRtlRoundedIcon />,
  },
  {
    path: '/task_type',
    display: 'Task Types',
    element: <RefTypes refType={REF_TYPES_REGISTRY.TASK_TYPE} />,
    icon: <ChecklistRoundedIcon />,
  },
]
export const userManagementRoutes: RoutesType[] = [
  {
    path: '/user_management',
    display: 'User Management',
    element: <UserAdmin />,
    icon: <Groups />,
  },
]

function RequireAuth({ children, path }: { children: React.ReactElement; path: string }) {
  const location = useLocation()
  const appUserDetails = isLoggedIn()
  if (appUserDetails) {
    if (path === '/home') {
      return children
    } else if (checkUserHasPermission(path.toUpperCase(), 'READ', appUserDetails)) {
      return children
    } else {
      return <Navigate to="/home" replace state={{ message: INCOMPLETE_PERMISSION, alertType: ALERT_TYPES.WARNING }} />
    }
  } else {
    return <Navigate to="/" replace state={{ redirect: location.pathname }} />
  }
}

const getElement = (children: React.ReactElement, path: string) =>
  children && <RequireAuth path={path}>{children}</RequireAuth>

const AppRoutes = (): React.ReactElement => {
  return (
    <Routes>
      {publicRoutes.map((publicRoute) => (
        <Route key={publicRoute.path} path={publicRoute.path} element={publicRoute.element} />
      ))}
      {protectedRoutes.map((protectedRoute) => (
        <Route
          key={protectedRoute.path}
          path={protectedRoute.path}
          element={getElement(protectedRoute.element, protectedRoute.path)}
        >
          {protectedRoute.subroutes &&
            protectedRoute.subroutes.map((subroute) => (
              <Route key={subroute.path} path={subroute.path} element={getElement(subroute.element, subroute.path)} />
            ))}
        </Route>
      ))}
      {protectedRoutes.map(
        (protectedRoute) =>
          protectedRoute.submenus &&
          protectedRoute.submenus.map((submenu) => (
            <Route key={submenu.path} path={submenu.path} element={getElement(submenu.element, submenu.path)}>
              {submenu.subroutes &&
                submenu.subroutes.map((subroute) => (
                  <Route
                    key={subroute.path}
                    path={subroute.path}
                    element={getElement(subroute.element, subroute.path)}
                  />
                ))}
            </Route>
          )),
      )}
      {refTypesRoutes.map((refTypesRoute) => (
        <Route
          key={refTypesRoute.path}
          path={refTypesRoute.path}
          element={getElement(refTypesRoute.element, refTypesRoute.path)}
        />
      ))}
      {userManagementRoutes.map((userManagementRoute) => (
        <Route
          key={userManagementRoute.path}
          path={userManagementRoute.path}
          element={getElement(userManagementRoute.element, userManagementRoute.path)}
        />
      ))}
    </Routes>
  )
}

export default AppRoutes
