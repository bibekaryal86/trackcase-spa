import React from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { userLogout } from '../actions/logout.action'

interface LogoutProps {
  userLogout: () => void
}

const Logout = (props: LogoutProps): React.ReactElement => {
  props.userLogout()

  return <Navigate to="/" />
}

const mapDispatchToProps = {
  userLogout: () => userLogout(),
}

export default connect(null, mapDispatchToProps)(Logout)
