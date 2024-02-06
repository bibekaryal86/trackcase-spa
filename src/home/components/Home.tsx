import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { getAllRefTypes } from '../../app'

const mapDispatchToProps = {
  getAllRefTypes: () => getAllRefTypes(),
}

interface HomeProps {
  getAllRefTypes: () => void
}

const Home = (props: HomeProps): React.ReactElement => {
  const { getAllRefTypes } = props
  useEffect(() => {
    // This code will run when the component mounts (page loads)
    getAllRefTypes()
    // Provide an empty dependency array to run the effect only on mount
  }, [getAllRefTypes])

  const homePageText = () => (
    <>
      <h5>This is the Home Page!</h5>
    </>
  )

  return <>{homePageText()}</>
}

export default connect(null, mapDispatchToProps)(Home)
