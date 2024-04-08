import { ID_DEFAULT } from '@constants/index'

import { BaseModelSchema, FetchRequestMetadata, ResponseBase } from '../../app'
import { ClientSchema } from '../../clients'
import { CourtSchema } from '../../courts'
import { ComponentStatusSchema } from '../../types'

export interface JudgeBase {
  name: string
  webex?: string
  courtId: number
  componentStatusId: number
  comments?: string
}

export interface JudgeSchema extends JudgeBase, BaseModelSchema {
  // orm_mode
  court?: CourtSchema
  componentStatus?: ComponentStatusSchema
  clients?: ClientSchema[]
  // history
  historyJudges?: HistoryJudgeSchema[]
}

export interface JudgeResponse extends ResponseBase {
  data: JudgeSchema[]
}

export interface HistoryJudgeSchema extends Partial<JudgeBase>, BaseModelSchema {
  appUserId: number
  judgeId: number
  // orm_mode
  judge?: JudgeSchema
  court?: CourtSchema
  componentStatus?: ComponentStatusSchema
}

export interface JudgesState {
  judges: JudgeSchema[]
  requestMetadata: Partial<FetchRequestMetadata>
}

export interface JudgesAction extends JudgesState {
  type: string
}

export interface JudgeFormData extends JudgeSchema {
  isHardDelete: boolean
  isShowSoftDeleted: boolean
}

export interface JudgeFormErrorData extends JudgeSchema {
  courtError: string
  componentStatusError: string
}

export const DefaultJudgeSchema: JudgeSchema = {
  name: '',
  webex: '',
  courtId: ID_DEFAULT,
  componentStatusId: ID_DEFAULT,
  comments: '',
}

export const DefaultJudgeState: JudgesState = {
  judges: [],
  requestMetadata: {},
}

export const DefaultJudgeFormData: JudgeFormData = {
  ...DefaultJudgeSchema,
  id: ID_DEFAULT,
  isHardDelete: false,
  isShowSoftDeleted: false,
  isDeleted: false,
}

export const DefaultJudgeFormErrorData: JudgeFormErrorData = {
  ...DefaultJudgeFormData,
  courtError: '',
  componentStatusError: '',
}
