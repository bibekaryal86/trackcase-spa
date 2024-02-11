import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
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
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { protectedRoutes, refTypesRoutes } from './AppRoutes'

const refTypesRoutesPaths = refTypesRoutes.map((route) => route.path)

interface SideNavProps {
  anchorEl: HTMLElement | null
  setAnchorEl: (anchorEl: HTMLElement | null) => void
}

const SideNav = (props: SideNavProps) => {
  const [isRefTypesOpen, setIsRefTypesOpen] = useState(false)
  const handleRefTypesOpen = () => {
    setIsRefTypesOpen(!isRefTypesOpen)
  }
  const open = Boolean(props.anchorEl)
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

  useEffect(() => {
    if (refTypesRoutesPaths.includes(pathname)) {
      setIsRefTypesOpen(true)
    } else {
      setIsRefTypesOpen(false)
    }
  }, [pathname])

  return (
    <Menu anchorEl={props.anchorEl} open={open} onClose={handleClose}>
      <List sx={{ backgroundColor: 'inherit' }}>
        {protectedRoutes.map(
          (protectedRoute) =>
            protectedRoute.display && (
              <ListItem
                key={protectedRoute.path}
                disablePadding
                sx={{ display: 'block' }}
                onClick={() => navigateToPage(protectedRoute.path)}
              >
                <ListItemButton
                  selected={isSelected(protectedRoute.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <Tooltip title={protectedRoute.display} placement="right">
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
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
        <Divider />
        <ListItemButton onClick={handleRefTypesOpen}>
          <Tooltip title="Ref Types" placement="right">
            <ListItemIcon>
              <AllInclusiveIcon />
            </ListItemIcon>
          </Tooltip>
          {isRefTypesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isRefTypesOpen} timeout="auto" unmountOnExit>
          {refTypesRoutes.map(
            (refTypesRoute) =>
              refTypesRoute.display && (
                <ListItem
                  key={refTypesRoute.path}
                  disablePadding
                  sx={{ display: 'block' }}
                  onClick={() => navigateToPage(refTypesRoute.path)}
                >
                  <ListItemButton
                    selected={isSelected(refTypesRoute.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: 'center',
                      px: 2.5,
                    }}
                  >
                    <Tooltip title={refTypesRoute.display} placement="right">
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
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
        </Collapse>
      </List>
    </Menu>
  )
}

export default SideNav
