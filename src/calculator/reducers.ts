// ========================================
// REDUCERS

import {
  AnyCalculatorAction,
  CalculatorActionMap,
  CalculatorState,
} from './types'

/**
 * Generates a new calculator state
 */
export function calculatorReducer(
  state: CalculatorState = initialState(),
  action: AnyCalculatorAction
): CalculatorState {
  switch (action.type) {
    // Initialize calculator
    case 'INIT':
      return action.payload || initialState()

    // Clear everything other than current input
    case 'CLEAR':
      return clearOutputHistory(state)

    // Clear everything other than current input
    case 'ZOOM':
      return {
        ...state,
        zoomLevel: action.payload,
      }

    // Update calculator with result of a calculation
    case 'CALCULATE':
      // Make sure result history doesn't get too big
      const newResultHistory = [
        ...state.resultHistory.slice(-1000),
        action.payload,
      ]

      return {
        ...state,
        input: '',
        historyIndex: state.resultHistory.length + 1,
        resultHistory: newResultHistory,
      }

    // Update current input value
    case 'UPDATE_INPUT':
      return {
        ...state,
        ...action.payload,
        historyIndex: state.resultHistory.length,
      }

    case 'COPY_TO_INPUT':
      return copyToInput(state, action)

    // Update current input selection
    case 'UPDATE_INPUT_SELECTION':
      return {
        ...state,
        ...action.payload,
      }

    // Arrow down
    case 'NEXT_INPUT':
      return nextInput(state)

    // Arrow up
    case 'PREVIOUS_INPUT':
      return previousInput(state)

    // Arrow up
    case 'SYNC_HISTORY':
      return syncHistory(state, action.payload)

    // Do nothing
    default:
      return state
  }
}

// ========================================
// REDUCER HELPERS

/**
 * Generates a default initial state for the calculator
 */
export function initialState(): CalculatorState {
  return {
    input: '',
    inputSelectionStart: null,
    inputSelectionEnd: null,
    resultHistory: [],
    historyIndex: 0,
    zoomLevel: 100,
  }
}

function clearOutputHistory(state: CalculatorState): CalculatorState {
  return {
    ...state,
    input: '',
    lastCleared: +new Date(),
    inputSelectionStart: null,
    inputSelectionEnd: null,
  }
}

/**
 *
 */
function copyToInput(
  state: CalculatorState,
  action: CalculatorActionMap['CopyToInputAction']
): CalculatorState {
  const { text } = action.payload
  let { inputSelectionStart, inputSelectionEnd, resultHistory } = state
  let start = inputSelectionStart || 0
  let end = inputSelectionEnd || 0

  const inputText = selectInputText(state)
  const inputBefore = inputText.slice(0, start)
  const inputAfter = inputText.slice(start, end + inputText.length)
  const endOfInsertion = start + text.length

  return {
    ...state,
    input: `${inputBefore}${text}${inputAfter}`,
    inputSelectionStart: endOfInsertion,
    inputSelectionEnd: endOfInsertion,
    historyIndex: resultHistory.length,
  }
}

/**
 * Handles 'NEXT_INPUT' action
 */
function nextInput(state: CalculatorState): CalculatorState {
  const { input, historyIndex, resultHistory } = state
  const minIndex = 0
  const maxIndex = resultHistory.length
  let nextIndex = historyIndex + 1

  // Make sure index is within range
  if (nextIndex < minIndex) {
    nextIndex = minIndex
  } else if (nextIndex > maxIndex) {
    nextIndex = maxIndex
  }

  const nextResult = resultHistory[nextIndex]
  const endOfInput = nextResult ? nextResult.input.length : input.length
  return {
    ...state,
    inputSelectionStart: endOfInput,
    inputSelectionEnd: endOfInput,
    historyIndex: nextIndex,
  }
}

/**
 * Handles 'PREVIOUS_INPUT' action
 */
function previousInput(state: CalculatorState): CalculatorState {
  const { input, historyIndex, resultHistory } = state
  const minIndex = 0
  const maxIndex = resultHistory.length
  let previousIndex = historyIndex - 1

  // Make sure index is within range
  if (previousIndex < minIndex) {
    previousIndex = minIndex
  } else if (previousIndex > maxIndex) {
    previousIndex = maxIndex
  }

  const previousResult = resultHistory[previousIndex]
  const endOfInput = previousResult ? previousResult.input.length : input.length
  return {
    ...state,
    inputSelectionStart: endOfInput,
    inputSelectionEnd: endOfInput,
    historyIndex: previousIndex,
  }
}

/**
 * Syncs history
 */
function syncHistory(
  state: CalculatorState,
  syncState: CalculatorState
): CalculatorState {
  const history = state.resultHistory
  const syncHistory = syncState.resultHistory
  const resultHistory = [...history, ...syncHistory].sort((a, b) => {
    if (a.timestamp < b.timestamp) {
      return -1
    }

    if (a.timestamp > b.timestamp) {
      return 1
    }

    return 0
  })

  return { ...state, resultHistory }
}

// ========================================
// SELECTORS

/**
 * Selects all calculator resultHistory
 */
export function selectResultHistory(state: CalculatorState) {
  return state.resultHistory
}

/**
 * Selects the current input
 */
export function selectInputFromHistory(state: CalculatorState) {
  const { input, resultHistory, historyIndex } = state
  const resultHistoryIndex = resultHistory[historyIndex]

  return resultHistoryIndex ? resultHistoryIndex.input : input
}

/**
 * Selects the the timestamp results were last cleared
 */
export function selectLastCleared(state: CalculatorState) {
  return state.lastCleared || 0
}

/**
 * Selects the current result index
 */
export function selectHistoryIndex(state: CalculatorState) {
  return state.historyIndex
}

/**
 * Selects the current input text
 */
export function selectInputText(state: CalculatorState) {
  const { input, resultHistory, historyIndex } = state
  const resultAtIndex = resultHistory[historyIndex]

  return resultAtIndex ? resultAtIndex.input : input
}

/**
 * Selects input selection (used when inserting input or output results)
 */
export function selectInputSelection(state: CalculatorState) {
  return {
    inputSelectionStart: state.inputSelectionStart || 0,
    inputSelectionEnd: state.inputSelectionEnd || 0,
  }
}

/**
 * Selects input selection (used when inserting input or output results)
 */
export function selectZoomLevel(state: CalculatorState) {
  return state.zoomLevel
}
