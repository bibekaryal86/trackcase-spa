import { JudgeSchema } from '../types/judges.data.types'
import { getNumber } from '../../app'

export const validateJudge = (judge: JudgeSchema) => {
  const errors: string[] = []

  if (!judge.name.trim()) {
    errors.push('Name is required!')
  }
  if (getNumber(judge.courtId) <= 0) {
    errors.push('Court is required!')
  }
  if (!judge.status.trim()) {
    errors.push('Status is required!')
  }

  return errors.length ? errors.join(', ') : ''
}

export const isAreTwoJudgesSame = (one: JudgeSchema, two: JudgeSchema) =>
  one &&
  two &&
  one.name === two.name &&
  one.webex === two.webex &&
  one.status === two.status &&
  one.comments === two.comments &&
  one.courtId === two.courtId

export const handleJudgeFormOnChange = (
  name: string,
  value: string | number,
  selectedJudge: JudgeSchema,
  setSelectedJudge: (updatedJudge: JudgeSchema) => void,
  getValue: (value: string | number) => string | number,
) => {
  const updatedForm = {
    ...selectedJudge,
    [name]: getValue(value),
  }
  setSelectedJudge(updatedForm)
}
