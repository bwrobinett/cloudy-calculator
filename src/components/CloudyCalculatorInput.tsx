import { FC, KeyboardEvent, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useCalculatorDispatch } from '.'
import {
  calculateAction,
  calculateResult,
  clearCalculatorAction,
  NEXT_INPUT,
  PREVIOUS_INPUT,
  selectInputFromHistory as selectInputText,
  selectInputSelection,
  UPDATE_INPUT,
  UPDATE_INPUT_SELECTION,
} from '../calculator'

/**
 * Renders the calculator input
 */
export const CloudyCalculatorInput: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useCalculatorDispatch()
  const inputText = useSelector(selectInputText)
  const { inputSelectionStart, inputSelectionEnd } =
    useSelector(selectInputSelection)

  // ========================================
  // EFFECTS
  // ========================================

  // -------------------
  // Ensure that focus is returned to input when clicking on an item in the output pane
  useEffect(() => {
    const inputElem = inputRef.current
    if (inputElem instanceof HTMLInputElement) {
      inputElem.focus()
    }
  })

  // -------------------
  // Update input selection
  useEffect(() => {
    const inputElem = inputRef.current
    if (inputElem instanceof HTMLInputElement) {
      inputElem.value = inputText
      inputElem.selectionStart = inputSelectionStart
      inputElem.selectionEnd = inputSelectionEnd
    }
  }, [inputText, inputSelectionStart, inputSelectionEnd])

  // ========================================
  // HANDLERS
  // ========================================

  // Handles keyboard events
  // - Enter (calculate result)
  // - ArrowUp (previous input)
  // - ArrowDown (next input)
  //
  // TODO Why is this async?
  const handleInputKeys = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return
    }

    switch (e.key) {
      case 'k': {
        if (e.metaKey || e.ctrlKey) {
          // Clear for ctrl+k or cmd+k
          dispatch(clearCalculatorAction())
        }

        return
      }
      case 'Enter': {
        // Do nothing if input is blank
        if (inputText === '') {
          return
        }

        // Calculate result
        const output = await calculateResult(inputText)
        dispatch(calculateAction(output))
        return
      }
      case 'ArrowUp': {
        // Update input text to previous input from history
        dispatch({ type: PREVIOUS_INPUT })
        e.preventDefault()
        return
      }
      case 'ArrowDown': {
        // Update input text to next input from history
        dispatch({ type: NEXT_INPUT })
        e.preventDefault()
        return
      }
      default: {
        return
      }
    }
  }

  const updateInput = () => {
    if (!(inputRef.current instanceof HTMLInputElement)) {
      return
    }

    const inputElem = inputRef.current
    dispatch({
      type: UPDATE_INPUT,
      payload: {
        input: inputElem.value,
        inputSelectionStart: inputElem.selectionStart,
        inputSelectionEnd: inputElem.selectionEnd,
      },
    })
  }

  const updateSelection = () => {
    if (!(inputRef.current instanceof HTMLInputElement)) {
      return
    }

    const inputElem = inputRef.current
    dispatch({
      type: UPDATE_INPUT_SELECTION,
      payload: {
        inputSelectionStart: inputElem.selectionStart,
        inputSelectionEnd: inputElem.selectionEnd,
      },
    })
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div id="calcInputWrapper" className="boxFlex0">
      <input
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        type="text"
        id="calcInput"
        onChange={() => updateInput()}
        onMouseLeave={updateSelection}
        onMouseEnter={updateSelection}
        onMouseUp={updateSelection}
        onClick={updateSelection}
        onKeyUp={updateSelection}
        onKeyDown={handleInputKeys}
        ref={inputRef}
      />
      <div id="inputMarker">{'>'}</div>
    </div>
  )
}
