import {
  CALCULATE,
  CalculateAction,
  CalculatedResult,
  CLEAR,
  ClearCalculatorAction,
} from './types'

/**
 * Creates an action with the result of a calculation
 */
export function calculateAction(result: CalculatedResult): CalculateAction {
  return {
    type: CALCULATE,
    payload: result,
  }
}

/**
 * Creates an action for clearing the calculator history
 */
export function clearCalculatorAction(): ClearCalculatorAction {
  return {
    type: CLEAR,
  }
}
