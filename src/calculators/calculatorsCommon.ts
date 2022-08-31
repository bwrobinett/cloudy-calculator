import { all, create, parser } from 'mathjs'

export const math = create(all, {})
export const mathJsParser = parser()

/**
 * Converts any result to a string
 */
export const mathJsResultToString = (result: any): string => {
  const canUseResult = result != null && typeof result.toString === 'function'
  return canUseResult ? result.toString() : ''
}

/**
 * Clears MathJS variables and functions
 */
export function resetVariables(input?: string) {
  input = input?.trim()

  // Clear all variables
  if (input === 'reset --all' || !input) {
    mathJsParser.clear()
    return
  }

  // Clear specific variables
  if (input.startsWith('reset ')) {
    const resetVars = input.replace(/^reset /, '').split(/(,| )/)
    resetVars.forEach((resetVar) => (mathJsParser as any).remove(resetVar))
    return
  }
}
