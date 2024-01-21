import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { CSSObject, styled, Theme } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { protectedRoutes, refTypesRoutes } from './AppRoutes'
import { DRAWER_WIDTH } from '../../constants'

const drawerWidth = DRAWER_WIDTH
const refTypesRoutesPaths = refTypesRoutes.map((route) => route.path)

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: theme.shadows[4],
  border: 'none',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  boxShadow: theme.shadows[4],
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  border: 'none',
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  background: theme.palette.mode === 'light' ? '#1976d2' : '#121212',
  backgroundImage:
    theme.palette.mode === 'dark' ? `linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))` : '',
  color: '#fff',
  // boxShadow: theme.shadows[4],
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

interface SideNavProps {
  isOpenDrawer: boolean
  openDrawerCallback: () => void
}

const SideNav = (props: SideNavProps) => {
  const [isRefTypesOpen, setIsRefTypesOpen] = useState(false)
  const handleClick = () => {
    setIsRefTypesOpen(!isRefTypesOpen)
  }

  const navigate = useNavigate()
  const navigateToPage = (page: string) => {
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
    <div id="app-sidenav-id">
      <Drawer variant="permanent" open={props.isOpenDrawer}>
        <DrawerHeader>
          <IconButton onClick={props.openDrawerCallback} color="inherit">
            <MenuOpenIcon />
          </IconButton>
        </DrawerHeader>
        <List>
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
                      justifyContent: props.isOpenDrawer ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: props.isOpenDrawer ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {protectedRoute.icon}
                    </ListItemIcon>
                    <ListItemText primary={protectedRoute.display} sx={{ opacity: props.isOpenDrawer ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              ),
          )}
          <Divider />
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <AllInclusiveIcon />
            </ListItemIcon>
            <ListItemText primary="Ref Types" />
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
                        justifyContent: props.isOpenDrawer ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: props.isOpenDrawer ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {refTypesRoute.icon}
                      </ListItemIcon>
                      <ListItemText primary={refTypesRoute.display} sx={{ opacity: props.isOpenDrawer ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                ),
            )}
          </Collapse>
        </List>
      </Drawer>
    </div>
  )
}

export default SideNav
