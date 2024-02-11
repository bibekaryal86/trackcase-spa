import { Container, Grid } from '@mui/material'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'

import AppRoutes from './AppRoutes'
import Footer from './Footer'
import Header from './Header'
import SideNav from './SideNav'
import { isLoggedIn } from '../utils/app.utils'

interface BodyProps {
  isDarkMode: boolean
  darkModeCallback: () => void
  anchorEl: HTMLElement | null
  setAnchorEl: (anchorEl: HTMLElement | null) => void
  userLogoutCallback: () => void
}

const Body = (props: BodyProps) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header {...props} />
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        {isLoggedIn() && <SideNav {...props} />}
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppRoutes />
              <Footer />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default Body
