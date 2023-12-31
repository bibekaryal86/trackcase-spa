import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { ClientSchema } from '../../clients'
import { ID_DEFAULT } from '../../constants'
import { CourtSchema } from '../../courts'

export interface JudgeSchema extends StatusBaseSchema, BaseModelSchema {
  name: string
  webex?: string
  court_id: number
  // orm_mode
  court?: CourtSchema
  clients?: ClientSchema[]
  // notes and history
  note_judges?: NoteJudgeSchema[]
  history_judges?: HistoryJudgeSchema[]
}

export interface JudgeResponse extends ResponseBase {
  judges: JudgeSchema[]
}

export interface NoteJudgeSchema extends NoteBaseSchema, BaseModelSchema {
  judge_id: number
  // orm_mode
  judge?: JudgeSchema
}

export interface HistoryJudgeSchema extends BaseModelSchema {
  user_name: string
  judge_id: number
  // from judge schema, need everything optional here so can't extend
  name?: string
  webex?: string
  court_id?: number
  status?: string
  comments?: string
  // orm_mode
  judge?: JudgeSchema
  court?: CourtSchema
}

export interface JudgesState {
  isCloseModal: boolean
  judges: JudgeSchema[]
  selectedJudge: JudgeSchema
}

export interface JudgesAction extends JudgesState {
  type: string
}

export const DefaultJudgeSchema: JudgeSchema = {
  name: '',
  webex: '',

  court_id: ID_DEFAULT,
  status: '',
  comments: '',
}

export const DefaultJudgeState: JudgesState = {
  isCloseModal: true,
  judges: [],
  selectedJudge: DefaultJudgeSchema,
}
