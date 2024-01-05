import { BaseModelSchema, NoteBaseSchema, ResponseBase, StatusBaseSchema } from '../../app'
import { ClientSchema } from '../../clients'
import { ID_DEFAULT } from '../../constants'
import { CourtSchema } from '../../courts'

export interface JudgeSchema extends StatusBaseSchema, BaseModelSchema {
  name: string
  webex?: string
  courtId: number
  // orm_mode
  court?: CourtSchema
  clients?: ClientSchema[]
  // notes and history
  noteJudges?: NoteJudgeSchema[]
  historyJudges?: HistoryJudgeSchema[]
}

export interface JudgeResponse extends ResponseBase {
  judges: JudgeSchema[]
}

export interface NoteJudgeSchema extends NoteBaseSchema, BaseModelSchema {
  judgeId: number
  // orm_mode
  judge?: JudgeSchema
}

export interface HistoryJudgeSchema extends BaseModelSchema {
  userName: string
  judgeId: number
  // from judge schema, need everything optional here so can't extend
  name?: string
  webex?: string
  courtId?: number
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

  courtId: ID_DEFAULT,
  status: '',
  comments: '',
}

export const DefaultJudgeState: JudgesState = {
  isCloseModal: true,
  judges: [],
  selectedJudge: DefaultJudgeSchema,
}
