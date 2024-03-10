import React from 'react'

const Client = (): React.ReactElement => {
  const pageText = () => (
    <>
      <h5>This is the CashCollection!</h5>
    </>
  )

  return <>{pageText()}</>
}

export default Client