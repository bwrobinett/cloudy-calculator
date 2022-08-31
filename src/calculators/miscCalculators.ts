import { mathJsParser } from './calculatorsCommon'
import { CalculatorFunction } from './types'

/**
 * Always outputs 42
 */
export const meaningOfEverythingCalculator: CalculatorFunction = (input) => '42'

/**
 * Echos input
 */
export const identityCalculator: CalculatorFunction = (input) => input

/**
 * Outputs an empty string
 */
export const emptyCalculator: CalculatorFunction = (input) => ''

/**
 * Passes through special commands
 */
export const specialCommands: CalculatorFunction = (input) => {
  input = input.replaceAll(/\s\s+/g, ' ').trim()
  if (input.match(/^(clear|reset)/)) {
    return input
  }

  // All variables
  if (input === 'variables') {
    const allVars = mathJsParser.getAll()
    const entries = Object.entries(allVars)

    if (!entries.length) {
      return '\n======================\nNO VARIABLE ASSIGNMENTS\n======================\n'
    }

    let prettyVars =
      '\n======================\nVARIABLE ASSIGNMENTS\n======================\n'
    entries.forEach((entry) => {
      const variable = entry[0]
      prettyVars = `${prettyVars}\n${entry[0]} = ${
        entry[1].toString().startsWith('function') ? 'function' : entry[1]
      }`
    })

    return prettyVars
  }

  return ''
}
