import React from 'react'

import { FormSchema } from '../types/forms.data.types'

interface FormFormProps {
  selectedForm: FormSchema
  setSelectedForm: (selectedForm: FormSchema) => void
  formStatusList: string[]
  isShowOneForm: boolean
}

const FormForm = (props: FormFormProps): React.ReactElement => {
  console.log(props)
  const pageText = () => (
    <>
      <h5>This is the FormForm!</h5>
    </>
  )

  return <>{pageText()}</>
}

export default FormForm
