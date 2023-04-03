import { FC } from 'react'
import { CalculatedResult } from '../calculator'
import { useCalculatorDispatch } from './useCalculatorDispatch'

/**
 * Render the result of a calculation
 */
export const CloudyCalculatorResult: FC<CalculatedResult> = (result) => {
  const dispatch = useCalculatorDispatch()

  if (typeof result === 'undefined') {
    return null
  }

  const { input, output } = result

  // ========================================
  // RENDER

  return (
    <>
      <div className="input">
        <span
          onClick={() =>
            // Inserts result input text into calculator input area
            input &&
            dispatch({
              type: 'COPY_TO_INPUT',
              payload: { text: input },
            })
          }
          className="inputText"
        >
          {input} =
        </span>
      </div>
      <div className="output">
        <span
          onClick={() =>
            // Inserts result output text into calculator input area
            output &&
            dispatch({
              type: 'COPY_TO_INPUT',
              payload: { text: output },
            })
          }
          className="outputText"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {output ? output : <i>unknown</i>}
        </span>
      </div>
    </>
  )
}
