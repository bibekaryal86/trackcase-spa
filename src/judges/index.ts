// actions
import { getJudge, getJudges, getOneJudge } from './actions/judges.action'
// components
import Judge from './components/Judge'
import Judges from './components/Judges'
// reducers
import judges from './reducers/judges.reducer'
// types
import {
  DefaultJudgeState,
  HistoryJudgeSchema,
  JudgeResponse,
  JudgesAction,
  JudgeSchema,
  JudgesState,
  NoteJudgeSchema,
} from './types/judges.data.types'

export { getJudge, getJudges, getOneJudge }
export { Judge, Judges }
export { judges }
export type {
  DefaultJudgeState,
  JudgeSchema,
  JudgeResponse,
  JudgesState,
  JudgesAction,
  NoteJudgeSchema,
  HistoryJudgeSchema,
}
