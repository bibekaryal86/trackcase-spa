import { Grid } from '@mui/material'
import Box from '@mui/material/Box'

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
  return (
    <div>
      <Header {...props} />
      <Box sx={{ display: 'flex' }}>
        {isLoggedIn() && <SideNav {...props} />}
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ m: 2, p: 2 }}>
            <AppRoutes />
          </Grid>
          <Grid item xs={12} sx={{ m: 2, p: 2 }}>
            <Footer />
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Body
