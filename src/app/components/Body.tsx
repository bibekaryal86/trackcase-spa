import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import AppRoutes from './AppRoutes'
import Footer from './Footer'
import Header from './Header'
import SideNav from './SideNav'
import { isLoggedIn } from '../utils/app.utils'

interface BodyProps {
  isDarkMode: boolean
  darkModeCallback: () => void
  isOpenDrawer: boolean
  openDrawerCallback: () => void
  userLogoutCallback: () => void
}

const Body = (props: BodyProps) => {
  const isUserLoggedIn = isLoggedIn()?.isLoggedIn
  const [styleProps, setStyleProps] = useState({})

  useEffect(() => {
    let defaultStyleProps = {
      width: undefined as number | undefined,
      marginLeft: '0px' as string | undefined,
    }
    if (isUserLoggedIn) {
      const header = document.getElementById('app-header-id')
      const sidenav = document.getElementById('app-sidenav-id')
      if (header && sidenav) {
        defaultStyleProps = { ...defaultStyleProps, width: header.offsetWidth - sidenav.offsetWidth }
      }

      const footer = document.getElementById('app-footer-id')
      if (footer) {
        const computedStyle = window.getComputedStyle(footer)
        defaultStyleProps = { ...defaultStyleProps, marginLeft: '-' + computedStyle.marginLeft }
      }
    }
    setStyleProps(defaultStyleProps)
  }, [isUserLoggedIn])

  return (
    <div>
      <Header {...props} />
      <Box sx={{ display: 'flex' }}>
        {isLoggedIn() && <SideNav {...props} />}
        <Grid container spacing={2} {...styleProps}>
          <Grid item xs={12} sx={{ m: 2, p: 2 }}>
            <AppRoutes />
          </Grid>
          <Grid id="app-footer-id" item xs={12} sx={{ m: 2, p: 2 }}>
            <Footer />
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Body
