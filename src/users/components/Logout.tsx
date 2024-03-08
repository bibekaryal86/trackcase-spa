import React from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { logout } from '../action/users.action'

interface LogoutProps {
  logout: () => void
}

const Logout = (props: LogoutProps): React.ReactElement => {
  props.logout()

  return <Navigate to="/" />
}

const mapDispatchToProps = {
  logout: () => logout(),
}

export default connect(null, mapDispatchToProps)(Logout)
