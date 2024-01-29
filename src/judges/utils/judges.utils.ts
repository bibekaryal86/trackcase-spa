import { getComments } from '../../app'
import { JudgeSchema } from '../types/judges.data.types'

export const validateJudge = (judge: JudgeSchema) => judge.name.trim() && judge.courtId > 0 && judge.status.trim()

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
  if (name === 'comments' && typeof value === 'string') {
    value = getComments(value)
  }
  const updatedForm = {
    ...selectedJudge,
    [name]: getValue(value),
  }
  setSelectedJudge(updatedForm)
}
