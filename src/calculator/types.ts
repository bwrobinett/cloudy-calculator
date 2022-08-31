/** ==== ACTION TYPES ==== */

export const CALCULATE = 'Calculator:CALCULATE'
export const INIT = 'Calculator:INIT'
export const CLEAR = 'Calculator:CLEAR'
export const ZOOM = 'Calculator:ZOOM'
export const UPDATE_INPUT = 'Calculator:UPDATE_INPUT'
export const UPDATE_INPUT_SELECTION = 'Calculator:UPDATE_INPUT_SELECTION'
export const COPY_TO_INPUT = 'Calculator:COPY_TO_INPUT'
export const NEXT_INPUT = 'Calculator:NEXT_INPUT'
export const PREVIOUS_INPUT = 'Calculator:PREVIOUS_INPUT'
export const SYNC_HISTORY = 'Calculator:SYNC_HISTORY'
export const DEFAULT = 'Calculator:DEFAULT'

export type CalculationActionType =
  | typeof CALCULATE
  | typeof INIT
  | typeof CLEAR
  | typeof UPDATE_INPUT
  | typeof UPDATE_INPUT_SELECTION
  | typeof COPY_TO_INPUT
  | typeof NEXT_INPUT
  | typeof PREVIOUS_INPUT
  | typeof SYNC_HISTORY
  | typeof DEFAULT
  | typeof ZOOM

/** ==== ACTION SHAPES ==== */

export interface InitCalculatorAction {
  type: typeof INIT
  payload?: CalculatorState
}

export interface ClearCalculatorAction {
  type: typeof CLEAR
}

export interface CalculateAction {
  type: typeof CALCULATE
  payload: CalculatedResult
}

export interface UpdateInputAction {
  type: typeof UPDATE_INPUT
  payload: {
    input: string
    inputSelectionStart: number | null
    inputSelectionEnd: number | null
  }
}

export interface UpdateInputSelectionAction {
  type: typeof UPDATE_INPUT_SELECTION
  payload: {
    inputSelectionStart: number | null
    inputSelectionEnd: number | null
  }
}

export interface CopyToInputAction {
  type: typeof COPY_TO_INPUT
  payload: {
    text: string
  }
}

export interface NextInputAction {
  type: typeof NEXT_INPUT
}

export interface PreviousInputAction {
  type: typeof PREVIOUS_INPUT
}

export interface SyncHistoryAction {
  type: typeof SYNC_HISTORY
  payload: CalculatorState
}

export interface ZoomAction {
  type: typeof ZOOM
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
