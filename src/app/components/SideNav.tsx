import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ACTION_TYPES } from '@constants/index'
import { checkUserHasPermission, isSuperuser } from '@users/utils/users.utils'

import { protectedRoutes, refTypesRoutes, userManagementRoutes } from './AppRoutes'

interface SideNavProps {
  anchorEl: HTMLElement | null
  setAnchorEl: (anchorEl: HTMLElement | null) => void
}

const SideNav = (props: SideNavProps) => {
  const [isRefTypesOpen, setIsRefTypesOpen] = useState(false)
  const handleRefTypesOpen = () => {
    setIsRefTypesOpen(!isRefTypesOpen)
  }
  const handleClose = () => {
    props.setAnchorEl(null)
  }

  const navigate = useNavigate()
  const navigateToPage = (page: string) => {
    handleClose()
    navigate(page, {
      replace: true,
    })
  }

  const pathname = useLocation().pathname
  const isSelected = useCallback(
    (path: string) => {
      return path === pathname
    },
    [pathname],
  )

  // useEffect(() => {
  //   if (refTypesRoutesPaths.includes(pathname)) {
  //     setIsRefTypesOpen(true)
  //   } else {
  //     setIsRefTypesOpen(false)
  //   }
  // }, [pathname])

  const hasPermissionForRoute = (routePath: string) =>
    checkUserHasPermission(routePath.toUpperCase(), ACTION_TYPES.READ)

  return (
    <Menu anchorEl={props.anchorEl} open={Boolean(props.anchorEl)} onClose={handleClose}>
      <List sx={{ backgroundColor: 'inherit' }}>
        {protectedRoutes.map(
          (protectedRoute) =>
            protectedRoute.display &&
            hasPermissionForRoute(protectedRoute.path) && (
              <ListItem
                key={protectedRoute.path}
                disablePadding
                sx={{ display: 'block' }}
                onClick={() => navigateToPage(protectedRoute.path)}
              >
                <ListItemButton
                  selected={isSelected(protectedRoute.path)}
                  sx={{
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip title={protectedRoute.display} placement="right">
                    <ListItemIcon
                      sx={{
                        justifyContent: 'center',
                      }}
                    >
                      {protectedRoute.icon}
                    </ListItemIcon>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
            ),
        )}
        {
          <>
            {hasPermissionForRoute('ref_types') && (
              <>
                <Divider />
                <ListItemButton onClick={handleRefTypesOpen}>
                  <Tooltip title="Ref Types" placement="right">
                    <ListItemIcon>{isRefTypesOpen ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
                  </Tooltip>
                </ListItemButton>
              </>
            )}
            <Collapse in={isRefTypesOpen} timeout="auto" unmountOnExit>
              {refTypesRoutes.map(
                (refTypesRoute) =>
                  refTypesRoute.display &&
                  hasPermissionForRoute(refTypesRoute.path) && (
                    <ListItem
                      key={refTypesRoute.path}
                      disablePadding
                      sx={{ display: 'block' }}
                      onClick={() => navigateToPage(refTypesRoute.path)}
                    >
                      <ListItemButton
                        selected={isSelected(refTypesRoute.path)}
                        sx={{
                          justifyContent: 'center',
                        }}
                      >
                        <Tooltip title={refTypesRoute.display} placement="right">
                          <ListItemIcon
                            sx={{
                              justifyContent: 'center',
                            }}
                          >
                            {refTypesRoute.icon}
                          </ListItemIcon>
                        </Tooltip>
                      </ListItemButton>
                    </ListItem>
                  ),
              )}
              {isSuperuser() &&
                userManagementRoutes.map(
                  (userManagementRoute) =>
                    userManagementRoute.display && (
                      <ListItem
                        key={userManagementRoute.path}
                        disablePadding
                        sx={{ display: 'block' }}
                        onClick={() => navigateToPage(userManagementRoute.path)}
                      >
                        <ListItemButton
                          selected={isSelected(userManagementRoute.path)}
                          sx={{
                            justifyContent: 'center',
                          }}
                        >
                          <Tooltip title={userManagementRoute.display} placement="right">
                            <ListItemIcon
                              sx={{
                                justifyContent: 'center',
                              }}
                            >
                              {userManagementRoute.icon}
                            </ListItemIcon>
                          </Tooltip>
                        </ListItemButton>
                      </ListItem>
                    ),
                )}
            </Collapse>
          </>
        }
      </List>
    </Menu>
  )
}

export default SideNav
