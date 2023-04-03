export interface CalculatorActionMap {
  InitCalculatorAction: {
    type: 'INIT'
    payload?: CalculatorState
  }
  ClearCalculatorAction: {
    type: 'CLEAR'
  }
  CalculateAction: {
    type: 'CALCULATE'
    payload: CalculatedResult
  }
  UpdateInputAction: {
    type: 'UPDATE_INPUT'
    payload: {
      input: string
      inputSelectionStart: number | null
      inputSelectionEnd: number | null
    }
  }
  UpdateInputSelectionAction: {
    type: 'UPDATE_INPUT_SELECTION'
    payload: {
      inputSelectionStart: number | null
      inputSelectionEnd: number | null
    }
  }
  CopyToInputAction: {
    type: 'COPY_TO_INPUT'
    payload: {
      text: string
    }
  }
  NextInputAction: {
    type: 'NEXT_INPUT'
  }
  PreviousInputAction: {
    type: 'PREVIOUS_INPUT'
  }
  SyncHistoryAction: {
    type: 'SYNC_HISTORY'
    payload: CalculatorState
  }
  ZoomAction: {
    type: 'ZOOM'
    payload: number
  }
}

export type AnyCalculatorAction = CalculatorActionMap[keyof CalculatorActionMap]
export type AnyCalculationActionType = AnyCalculatorAction['type']

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
