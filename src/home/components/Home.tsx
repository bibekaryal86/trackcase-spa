import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getStatusesList, testDatabase } from '../../app'

const mapDispatchToProps = {
  getStatuses: () => getStatusesList(),
}

interface HomeProps {
  getStatuses: () => void
}

const Home = (props: HomeProps): React.ReactElement => {
  const { getStatuses } = props
  useEffect(() => {
    // This code will run when the component mounts (page loads)
    testDatabase()
    getStatuses()
    // Provide an empty dependency array to run the effect only on mount
  }, [getStatuses])

  const homePageText = () => (
    <>
      <h5>This is the Home Page!</h5>
    </>
  )

  return <>{homePageText()}</>
}

export default connect(null, mapDispatchToProps)(Home)
