import { getNumber } from '../../app'
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
) => {
  let updatedJudge = selectedJudge
  if (name === 'name') {
    updatedJudge = {
      ...selectedJudge,
      name: value.toString(),
    }
  }
  if (name === 'webex') {
    updatedJudge = {
      ...selectedJudge,
      webex: value.toString(),
    }
  }
  if (name === 'courtId') {
    updatedJudge = {
      ...selectedJudge,
      courtId: getNumber(value),
    }
  }
  if (name === 'status') {
    updatedJudge = {
      ...selectedJudge,
      status: value.toString(),
    }
  }
  if (name === 'comments') {
    updatedJudge = {
      ...selectedJudge,
      comments: value.toString(),
    }
  }
  setSelectedJudge(updatedJudge)
}
