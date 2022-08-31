import { FC, memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CloudyCalculatorInput,
  CloudyCalculatorResult,
  useCalculatorDispatch,
} from '.'
import {
  CalculatedResult,
  clearCalculatorAction,
  INIT,
  initCalculator,
  selectLastCleared,
  selectResultHistory,
} from '../calculator'
import {
  convertBaseCalculator,
  mathJsCalculator,
  mathJsCAS,
  specialCommands,
  tinyColorCalculator,
} from '../calculators'
import { mathJsParser, resetVariables } from '../calculators/calculatorsCommon'
import { calculatorStorage } from './calculatorStorage'

/**
 * Initialize the main calculator with calculators in priority order
 */
initCalculator({
  specialCommands,
  mathJsCalculator,
  convertBaseCalculator,
  tinyColorCalculator,
  mathJsCAS,
})

const ResultItem: FC<CalculatedResult> = (result: CalculatedResult) => {
  return (
    <li className="result" data-uuid={`${result.uuid}`} key={`${result.uuid}`}>
      <CloudyCalculatorResult {...result} />
    </li>
  )
}

/**
 * Renders the calculator
 */
export const CloudyCalculator: FC = () => {
  const dispatch = useCalculatorDispatch()
  const resultHistory = useSelector(selectResultHistory)
  const lastCleared = useSelector(selectLastCleared)
  const resultsWrapperRef = useRef<HTMLDivElement>(null)
  const ResultItemMemo = memo(ResultItem)
  const [wasCleared, setWasCleared] = useState(false)

  // ========================================
  // EFFECTS
  // ========================================

  // -------------------
  // Init calculator from storage
  useLayoutEffect(() => {
    calculatorStorage.get().then((state) => {
      if (state) {
        state.resultHistory.forEach((result) => {
          const { input, output } = result

          // Recreate variables and functions by revaluating inputs with equals signs in them
          if (input?.includes('=')) {
            mathJsParser.evaluate(input)
            return
          }

          // Clear variables and functions just recreated if needed (I know, but it's easier this way)
          if (input?.startsWith('reset')) {
            resetVariables(input)
            return
          }
        })
        dispatch({ type: INIT, payload: state })
      }
    })
  }, [])

  // -------------------
  // Scroll down results to keep the most recent ones
  useLayoutEffect(() => {
    const resultsWrapper = resultsWrapperRef.current
    if (resultsWrapper instanceof HTMLDivElement) {
      resultsWrapper.scrollTop = resultsWrapper.scrollHeight
    }
  }, [resultHistory])

  // -------------------
  // Handle clear, reset
  useEffect(() => {
    const lastResult: CalculatedResult =
      resultHistory && resultHistory[resultHistory.length - 1]

    if (!lastResult) {
      return
    }

    const { input } = lastResult
    if (input === 'clear' && lastResult.timestamp > lastCleared) {
      dispatch(clearCalculatorAction())
      setWasCleared(true)
      return
    }

    if (input?.startsWith('reset')) {
      resetVariables(input)
      return
    }
  }, [resultHistory])

  // -------------------
  // Focus input after clear button clicked
  useEffect(() => {
    if (wasCleared) {
      document.getElementById('clearAll')?.focus()
      setWasCleared(false)
    }
  }, [wasCleared])

  // ========================================
  // HANDLERS

  // Clears all calculations
  const handleClear = () => {
    dispatch(clearCalculatorAction())
    setWasCleared(true)
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div id="calc">
      <div style={{ height: 0 }}>
        {/* This div is a goofy fix for problem where popup is size wrong until user starts typing */}
        <div id="calcWrapper" className="vbox">
          <table id="calcWrapperTable">
            <tbody>
              {/* Header	*/}
              <tr>
                <td>
                  <div id="headerWrapper" className="boxFlex0">
                    <div id="headerLinks">
                      <a
                        href="http://code.google.com/p/chromey-calculator/wiki/Help"
                        target="_tab"
                        id="googleCalcHelp"
                        className="headerLink"
                      >
                        Help
                      </a>
                      <span className="headerSeparator">|</span>
                      <a
                        href="#calcResults"
                        id="clearAll"
                        className="headerLink"
                        onClick={handleClear}
                      >
                        Clear
                      </a>
                    </div>
                    <a
                      href="https://chrome.google.com/webstore/detail/acgimceffoceigocablmjdpebeodphgc"
                      target="_tab"
                      id="chromeyCalcPageLink"
                    >
                      <pre id="chromeyCalcName">Cloudy Calculator</pre>
                    </a>
                  </div>
                </td>
              </tr>
              {/* Results */}
              <tr>
                <td id="calcResultsWrapperCell">
                  <div
                    id="calcResultsWrapper"
                    className="boxFlex1"
                    ref={resultsWrapperRef}
                  >
                    <ul id="calcResults">
                      {!resultHistory
                        ? null
                        : resultHistory.map((result, index) => {
                            if (result.timestamp < lastCleared) {
                              return null
                            }
                            return (
                              <ResultItemMemo
                                key={`result-${result.uuid}`}
                                {...result}
                              />
                            )
                          })}
                    </ul>
                  </div>
                </td>
              </tr>
              {/* Input */}
              <tr>
                <td>
                  <CloudyCalculatorInput />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}