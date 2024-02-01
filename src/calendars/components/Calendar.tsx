import React from 'react'
import { useParams } from 'react-router-dom'

const Calendar = (): React.ReactElement => {
  const { id, type } = useParams()
  console.log(id, type)
  const pageText = () => (
    <>
      <h5>This is the Calendar!</h5>
    </>
  )

  return <>{pageText()}</>
}

export default Calendar
