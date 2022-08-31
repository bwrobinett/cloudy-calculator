/**
 * A calculator created using mathjs
 */
import { createUnit } from 'mathjs'
import { math, mathJsParser, mathJsResultToString } from './calculatorsCommon'
import { CalculatorFunction } from './types'

// ========================================
// CALCULATOR

/**
 * Create the parser. This should be the one parser object used by the app.
 */

/**
 * Calculates a result from an input string
 */
export const mathJsCalculator: CalculatorFunction = (input) => {
  try {
    const rawResult = mathJsParser.evaluate(input)
    const result = mathJsResultToString(rawResult)

    // If a function was created, just echo the input
    if (typeof rawResult === 'function') {
      const lhSide = rawResult.syntax
      const rhSide = input.split('=')[1].trim()
      return `${lhSide} = ${rhSide}`
    }

    return result
  } catch (err) {
    return ''
  }
}

/**
 * Calculates a result from an input string
 */
export const mathJsCAS: CalculatorFunction = (input) => {
  try {
    const result = mathJsResultToString(math.simplify(math.parse(input)))
    if (
      result.replaceAll(' ', '').toUpperCase() !==
      input.replaceAll(' ', '').toUpperCase()
    ) {
      return result
    }
    return ''
  } catch (err) {
    return ''
  }
}

// ========================================
// CONFIGURATION

createUnit({
  // ========================================
  // LENGTH

  lightyear: {
    definition: '9.4605284e15 m',
    aliases: ['lightyears'],
  },
  parsec: {
    definition: '3.08568025e16 m',
    aliases: ['parsecs'],
  },

  // ========================================
  // VOLUME

  tbsp: {
    definition: '1 tablespoon',
    aliases: ['tbl'],
  },
  tsp: {
    definition: '1 teaspoon',
  },

  // ========================================
  // TIME

  yr: {
    definition: '1 year',
    aliases: ['yrs'],
  },
  score: {
    definition: '20 years',
  },

  // ========================================
  // MASS/WEIGHT

  pound: {
    definition: '1 lb',
    aliases: ['pounds'],
  },

  // ========================================
  // SPEED

  mph: {
    definition: '1 mi/hr',
  },
  kph: {
    definition: '1 km/hr',
  },
})
