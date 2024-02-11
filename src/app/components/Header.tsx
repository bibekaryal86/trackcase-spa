import { AccountCircleRounded, LogoutRounded } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import Link from './Link'
import Switch from './Switch'
import { isLoggedIn } from '../utils/app.utils'

interface HeaderProps {
  isDarkMode: boolean
  darkModeCallback: () => void
  anchorEl: HTMLElement | null
  setAnchorEl: (anchorEl: HTMLElement | null) => void
  userLogoutCallback: () => void
}

const Header = (props: HeaderProps) => {
  // navigate to user account page
  const navigate = useNavigate()
  const navigateToPage = (path: string) => {
    navigate(path, {
      replace: true,
    })
  }

  const handleAnchorEl = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.setAnchorEl(event.currentTarget)
  }

  return (
    <AppBar position="absolute" sx={{ boxShadow: 'none' }}>
      <Toolbar>
        {isLoggedIn() && (
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={handleAnchorEl}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <Link text="TrackCase Service" color="inherit" navigateToPage="/home" />
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={props.isDarkMode ? 'Dark Mode ON' : 'Dark Mode [BETA]'}>
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
  )
}

export default Header
