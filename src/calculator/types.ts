/** ==== ACTION TYPES ==== */

export type CalculationActionType =
  | 'CALCULATE'
  | 'INIT'
  | 'CLEAR'
  | 'UPDATE_INPUT'
  | 'UPDATE_INPUT_SELECTION'
  | 'COPY_TO_INPUT'
  | 'NEXT_INPUT'
  | 'PREVIOUS_INPUT'
  | 'SYNC_HISTORY'
  | 'DEFAULT'
  | 'ZOOM'

/** ==== ACTION SHAPES ==== */

export interface InitCalculatorAction {
  type: 'INIT'
  payload?: CalculatorState
}

export interface ClearCalculatorAction {
  type: 'CLEAR'
}

export interface CalculateAction {
  type: 'CALCULATE'
  payload: CalculatedResult
}

export interface UpdateInputAction {
  type: 'UPDATE_INPUT'
  payload: {
    input: string
    inputSelectionStart: number | null
    inputSelectionEnd: number | null
  }
}

export interface UpdateInputSelectionAction {
  type: 'UPDATE_INPUT_SELECTION'
  payload: {
    inputSelectionStart: number | null
    inputSelectionEnd: number | null
  }
}

export interface CopyToInputAction {
  type: 'COPY_TO_INPUT'
  payload: {
    text: string
  }
}

export interface NextInputAction {
  type: 'NEXT_INPUT'
}

export interface PreviousInputAction {
  type: 'PREVIOUS_INPUT'
}

export interface SyncHistoryAction {
  type: 'SYNC_HISTORY'
  payload: CalculatorState
}

export interface ZoomAction {
  type: 'ZOOM'
  payload: number
}

export type CalculatorAction =
  | CalculateAction
  | InitCalculatorAction
  | ClearCalculatorAction
  | UpdateInputAction
  | UpdateInputSelectionAction
  | CopyToInputAction
  | NextInputAction
  | PreviousInputAction
  | SyncHistoryAction
  | ZoomAction

/** ==== STATE SHAPES ==== */

export interface CalculatorState {
  input: string
  inputSelectionStart: number | null
  inputSelectionEnd: number | null
  resultHistory: CalculatedResult[]
  historyIndex: number
  lastCleared?: number
  zoomLevel: number
}

export interface CalculatedResult {
  input: string
  output?: string
  calculator?: string
  timestamp: number
  uuid: string
}
