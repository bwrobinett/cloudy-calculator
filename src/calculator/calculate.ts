import { CalculatedResult } from '.'
import { AsyncCalculatorFunction, CalculatorFunction } from '../calculators'
import { generateUuid } from '../utilities'

let names: string[] = []
let calculators: (CalculatorFunction | AsyncCalculatorFunction)[] = []

/**
 * Initializes the calculator
 * The calculators object should list the calculator functions in priority order
 *
 * NOTE: Yup, this works even though calculators is an object
 */
export const initCalculator = (calculatorsByName: {
  [name: string]: CalculatorFunction | AsyncCalculatorFunction
}) => {
  names = Object.getOwnPropertyNames(calculatorsByName)
  calculators = names.map((name) => calculatorsByName[name])
}

/**
 * Goes through all calculators in priority order until a result (if any) is found
 */
export const calculateResult = async (
  input: string
): Promise<CalculatedResult> => {
  const timestamp = Date.now()
  const uuid = generateUuid()
  const defaultResult = {
    input,
    timestamp,
    uuid,
  }

  // Try to find a result
  for (let i = 0; i < calculators.length; i++) {
    const name = names[i]
    const calculator = calculators[i]
    const output = await calculator(input)

    if (output !== '' && output != null) {
      // Result found (YAY)
      return {
        ...defaultResult,
        output: makeNumbersLookNicer(output),
        calculator: name,
      }
    }
  }

  // No result found (SAD)
  return defaultResult
}

/**
 * Try to fix it so we don't get goofy results when calculating things like 2.01 - 2.0
 */
function makeNumbersLookNicer(output: string) {
  const precision = 13
  const outputIsNumber = /^[+-]?\d+[.]?\d*e?[+-]?\d+$/.test(output)
  if (outputIsNumber) {
    // Convert output to number of given precision, then back to string
    return Number(parseFloat(output).toPrecision(precision)).toString()
  }

  return output
}
