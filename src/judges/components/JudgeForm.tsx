import { SelectChangeEvent, useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid'
import React from 'react'

import { courtsListForSelect, handleFormChange } from '@app/components/CommonComponents.tsx'
import {
  FormCommentsField,
  FormSelectField,
  FormSelectStatusField,
  FormTextField,
  GridFormWrapper,
} from '@app/components/FormFields.tsx'
import { USE_MEDIA_QUERY_INPUT } from '@constants/index.ts'
import { CourtSchema } from '@courts/types/courts.data.types.ts'
import { JudgeFormData, JudgeFormErrorData } from '@judges/types/judges.data.types.ts'
import { ComponentStatusSchema } from '@ref_types/types/refTypes.data.types.ts'

interface JudgeFormProps {
  formData: JudgeFormData
  setFormData: (formData: JudgeFormData) => void
  formErrors: JudgeFormErrorData
  setFormErrors: (formErrors: JudgeFormErrorData) => void
  judgeStatusList: ComponentStatusSchema[]
  isShowOneJudge: boolean
  courtId?: number
  courtsList: CourtSchema[]
}

const JudgeForm = (props: JudgeFormProps): React.ReactElement => {
  const isSmallScreen = useMediaQuery(USE_MEDIA_QUERY_INPUT)
  const { formData, formErrors, setFormData, setFormErrors, judgeStatusList, isShowOneJudge } = props
  const { courtId, courtsList } = props

  const judgeName = () => (
    <FormTextField
      componentLabel="JUDGE--NAME"
      autoFocus={!isShowOneJudge}
      name="name"
      value={formData.name}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        handleFormChange(event, formData, formErrors, setFormData, setFormErrors)
      }
      error={!!formErrors.name}
      helperText={formErrors.name}
      required
      fullWidth
    />
  )

  const judgeWebex = () => (
    <FormTextField
      componentLabel="JUDGE--WEBEX"
      name="webex"
      value={formData.webex}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        handleFormChange(event, formData, formErrors, setFormData, setFormErrors)
      }
      helperText={formErrors.webex}
      fullWidth
    />
  )

  const judgeCourtsList = () => (
    <FormSelectField
      componentLabel="JUDGE--COURT"
      name="courtId"
      value={formData.courtId}
      onChange={(event: SelectChangeEvent) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      menuItems={courtsListForSelect(courtsList, courtId, formData.courtId)}
      error={!!formErrors.courtError}
      helperText={formErrors.courtError}
      required
    />
  )

  const judgeStatus = () => (
    <FormSelectStatusField
      componentLabel="JUDGE--STATUS"
      value={formData.componentStatusId}
      onChange={(event: SelectChangeEvent) => handleFormChange(event, formData, formErrors, setFormData, setFormErrors)}
      error={!!formErrors.componentStatusError}
      helperText={formErrors.componentStatusError}
      statusList={judgeStatusList}
    />
  )

  const judgeComments = () => (
    <FormCommentsField
      componentLabel="JUDGE--COMMENTS"
      value={formData.comments}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        handleFormChange(event, formData, formErrors, setFormData, setFormErrors)
      }
    />
  )

  return (
    <GridFormWrapper
      isSmallScreen={isSmallScreen}
      isShowOne={isShowOneJudge}
      justifyContent={isShowOneJudge ? 'flex-start' : 'flex-end'}
    >
      <Grid size={12}>{judgeName()}</Grid>
      <Grid size={12}>{judgeWebex()}</Grid>
      <Grid size={8}>{judgeCourtsList()}</Grid>
      <Grid size={4}>{judgeStatus()}</Grid>
      {isShowOneJudge && <Grid size={12}>{judgeComments()}</Grid>}
    </GridFormWrapper>
  )
}

export default JudgeForm
