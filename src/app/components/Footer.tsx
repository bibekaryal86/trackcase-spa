import Typography from '@mui/material/Typography'
import React from 'react'

import Link from './Link'

const BUILD_NUMBER = process.env.BUILD_NUMBER
const CURRENT_YEAR = new Date().getFullYear()

const Footer = (): React.ReactElement => {
  return (
    <div>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 23, mb: 2 }}>
        {'Copyright © '}
        <Link text={' Bibek Aryal '} href="https://www.bibekaryal.com/" target="_blank" />
        <br />
        {'build '} {BUILD_NUMBER} {CURRENT_YEAR}
      </Typography>
    </div>
  )
}

export default Footer
