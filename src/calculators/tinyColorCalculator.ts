/**
 * A color calculator created from TinyColor
 * https://npmjs.com/package/tinycolor2
 */
import tinyColor from 'tinycolor2'
import { CalculatorFunction } from './types'

/**
 * Converts a color to another color type
 */
export const tinyColorCalculator: CalculatorFunction = (input) => {
  try {
    const [colorInput, , colorType] = input.split(/\s(to|in)\s/)
    const color = tinyColor(colorInput)
    let colorOutput

    switch (colorType) {
      case 'hsv':
      case 'hsva':
      case 'HSV':
      case 'HSVA':
        colorOutput = color.toHsvString()
        break
      case 'hsl':
      case 'hsla':
      case 'HSL':
      case 'HSLA':
        colorOutput = color.toHslString()
        break
      case 'hex':
      case 'hexa':
      case 'HEX':
      case 'HEXA':
        colorOutput = color.toHexString()
        break
      case 'hex8':
      case 'HEX8':
        colorOutput = color.toHex8String()
        break
      case 'rgb':
      case 'rgba':
      case 'RGB':
      case 'RGBA':
        colorOutput = color.toRgbString()
        break
      case 'percentageRgb':
      case 'percentageRgba':
      case 'percentageRGB':
      case 'percentageRGBA':
        colorOutput = color.toPercentageRgbString()
        break
      case 'name':
        colorOutput = color.toName()
        break
      default:
        return ''
    }

    return typeof colorOutput === 'string' ? colorOutput : ''
  } catch (err) {
    return ''
  }
}
