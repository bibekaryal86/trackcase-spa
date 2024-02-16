import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { getAllRefTypes } from '../../app'

const mapDispatchToProps = {
  getAllRefTypes: () => getAllRefTypes(),
}

interface HomeProps {
  getAllRefTypes: () => void
}

const Home = (props: HomeProps): React.ReactElement => {
  // to avoid multiple api calls, avoid infinite loop if empty list returned
  const isForceFetch = useRef(true)

  const { getAllRefTypes } = props
  useEffect(() => {
    // This code will run when the component mounts (page loads)
    if (isForceFetch.current) {
      getAllRefTypes()
    }
    isForceFetch.current = false
    // Provide an empty dependency array to run the effect only on mount
  }, [getAllRefTypes])

  useEffect(() => {
    return () => {
      isForceFetch.current = true
    }
  }, [])

  const homePageText = () => (
    <>
      <h5>This is the Home Page!</h5>
    </>
  )

  return <>{homePageText()}</>
}

export default connect(null, mapDispatchToProps)(Home)
