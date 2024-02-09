import { AccountCircleRounded, LogoutRounded } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { useMediaQuery } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import Link from './Link'
import Switch from './Switch'
import { DRAWER_WIDTH, USE_MEDIA_QUERY_INPUT } from '../../constants'
import { isLoggedIn } from '../utils/app.utils'

const drawerWidth = DRAWER_WIDTH

interface HeaderProps {
  isDarkMode: boolean
  darkModeCallback: () => void
  isOpenDrawer: boolean
  openDrawerCallback: () => void
  userLogoutCallback: () => void
}

interface AppBarProps extends MuiAppBarProps {
  open: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: isLoggedIn() ? drawerWidth : 0,
    width: `calc(100% - ${isLoggedIn() ? drawerWidth : 0}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Header = (props: HeaderProps) => {
  // navigate to user account page
  const navigate = useNavigate()
  const navigateToPage = (path: string) => {
    navigate(path, {
      replace: true,
    })
  }

  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  return (
    <div id="app-header-id" style={{ marginBottom: '4rem' }}>
      <AppBar position="fixed" open={props.isOpenDrawer} sx={{ boxShadow: 'none' }}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          {isLoggedIn() && (
            <IconButton
              color="inherit"
              onClick={props.openDrawerCallback}
              edge="start"
              sx={{
                marginRight: 5,
                ...(props.isOpenDrawer && { display: 'none' }),
              }}
              disabled={isSmallScreen}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <Link text="TrackCase Service" color="inherit" navigateToPage="/home" />
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={props.isDarkMode ? 'Dark Mode ON' : 'Dark Mode'}>
              <FormGroup>
                <Switch isChecked={!props.isDarkMode} onChangeCallback={props.darkModeCallback} />
              </FormGroup>
            </Tooltip>
            {isLoggedIn() && (
              <div>
                <Tooltip title="Account Settings">
                  <IconButton color="inherit" onClick={() => navigateToPage('/account')}>
                    <AccountCircleRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sign Out">
                  <IconButton color="inherit" onClick={props.userLogoutCallback}>
                    <LogoutRounded />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
