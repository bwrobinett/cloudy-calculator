import romans from 'romans'
import { CalculatorFunction } from './types'

/**
 * Splits input into parts
 * [inputNumber, fromBase, to, toBase]
 */
function splitInput(input: string) {
  return input.replace(/\s+/g, ' ').split(/\s/g)
}

/**
 * Converts between bases
 * Can do roman numerals too :)
 */
export const convertBaseCalculator: CalculatorFunction = (input) => {
  const err = new Error(`getInputParts("${input}): Can't parse input"`)

  try {
    const inputParts = splitInput(input)
    let inputNumber: string
    let fromBase: string
    let to: string
    let toBase: string
    let toRadix: number | 'roman'
    let fromRadix: number | 'roman'

    if (inputParts.length === 4) {
      // Input looks like "<inputNumber> <toBase> <to|from> <fromBase>"
      ;[inputNumber, fromBase, to, toBase] = inputParts
      fromRadix = baseToRadix(fromBase)
      toRadix = baseToRadix(toBase)
      inputNumber = addPrefix(inputNumber, fromRadix)
    } else if (inputParts.length === 3) {
      // Input looks like "<inputNumber> <to|from> <fromBase>"
      ;[inputNumber, to, toBase] = inputParts
      fromRadix = numberToRadix(inputNumber)
      toRadix = baseToRadix(toBase)
    } else {
      throw err
    }

    // Throw if we can't handle input
    if (!/(in|to)/.test(to)) {
      throw err
    }

    // Convert input to decimal if possible
    let decimalInputNumber: number
    if (fromRadix === 'roman' && canDeromanize(inputNumber)) {
      // Convert roman to decimal number
      decimalInputNumber = romans.deromanize(inputNumber)
    } else {
      // Convert any other base to decimal
      decimalInputNumber = parseInt(inputNumber, fromRadix as number)
    }

    // If we can convert to roman, do it now and return :)
    if (toRadix === 'roman' && canRomanize(decimalInputNumber)) {
      return romans.romanize(decimalInputNumber)
    }

    // Make sure can covert to a number
    if (isNaN(decimalInputNumber) || typeof toRadix !== 'number') {
      throw err
    }

    // Convert to new base
    const result = decimalInputNumber.toString(toRadix)

    // Append base to output unless
    const output = toRadix !== 10 ? `${result} ${toBase}` : result

    return output
  } catch {
    return ''
  }
}

/**
 *
 */
function canDeromanize(input: string) {
  try {
    romans.deromanize(input)
    return true
  } catch (err) {
    return false
  }
}

/**
 *
 */
function canRomanize(input: number) {
  try {
    romans.romanize(input)
    return true
  } catch (err) {
    return false
  }
}

/**
 *
 */
function baseToRadix(baseName: string) {
  switch (baseName.toLowerCase()) {
    // Base 2
    case 'binary':
    case 'bin':
      return 2

    // Base 8
    case 'octal':
    case 'oct':
      return 8

    // Base 10
    case 'decimal':
    case 'dec':
      return 10

    // Base 16
    case 'hexadecimal':
    case 'hex':
      return 16

    // Roman
    case 'roman':
    case 'rom':
      return 'roman'
  }

  // If we get to here, check that the base looks like "base<N>"
  if (!/^base([0-9]+|Roman)$/.test(baseName)) {
    throw new Error(`baseToRadix("${baseName}") failed`)
  }

  const radix = +baseName.replace('base', '').toLowerCase()
  return radix
}

/**
 *
 */
function numberToRadix(inputNumber: string) {
  if (inputNumber) {
    // Base 16 (hex)
    if (/^0x/.test(inputNumber)) {
      return 16
    }

    // Base 8 (octal)
    if (/^0/.test(inputNumber)) {
      return 8
    }

    // Roman
    if (canDeromanize(inputNumber)) {
      return 'roman'
    }
  }

  // Default to base 10 (decimal)
  return 10
}

/**
 *
 */
function addPrefix(inputNumber: string, radix: number | 'roman') {
  switch (radix) {
    case 8:
      return `${'0'}${inputNumber}`
    case 16:
      return `${'0x'}${inputNumber}`
    default:
      return inputNumber
  }
}
