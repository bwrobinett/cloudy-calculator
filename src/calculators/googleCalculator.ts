import axios, { AxiosResponse } from 'axios'
import { AsyncCalculatorFunction, CalculatorFunction } from './types'
// import { googlePage } from "../googleSample";

/**
 * Uses Google to calculate stuff
 * TODO: Test this more!
 */
export const googleCalculator: AsyncCalculatorFunction = async (input) => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `https://www.google.com/search?q=${input}`
    )
    const resultHtml = googleResponseToHtmlOutput(response.data.toString())
    const resultText = htmlOutputToTextOutput(resultHtml)

    return resultText
  } catch {
    return ''
  }
}

/**
 *
 */
export const getResponse = (response: string, ms: number): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response)
    }, ms)
  })
}

/**
 *
 */
export const getGoogleSearchResponse: AsyncCalculatorFunction = async (
  input
) => {
  const response: AxiosResponse<any> = await axios.get(
    `https://www.google.com/search?q=${input}`
  )
  return response.data.toString()
}

/**
 * Converts a google search response page to simple html output (if possible)
 */
export const googleResponseToHtmlOutput: CalculatorFunction = (html) => {
  try {
    // Extract result nodes
    const domParser = new DOMParser()
    const dom = domParser.parseFromString(html, 'text/html')
    const [firstResultNode, secondResultNode] = Array.from(
      // NOTE: Scraping stuff like this is always fragile. Could break tomorrow.
      //       But this query does seem to work for now for quite a few cases :)
      dom.querySelectorAll('[aria-level="3"]')
    )

    // Extract result html
    const firstResultHtml = firstResultNode ? firstResultNode.innerHTML : ''
    const secondResultHtml = secondResultNode ? secondResultNode.innerHTML : ''

    // Use html from second node (google's guess) if first node contains any variation of "did you mean... ?"
    const didYouMeanRx = /showing results for|search instead for|did you mean/gi
    let resultHtml = didYouMeanRx.test(firstResultHtml)
      ? secondResultHtml
      : firstResultHtml

    if (!resultHtml) {
      return ''
    }

    // Clean up html result
    return (resultHtml || '')
      .replace(/<script.*script>/gs, '') // Remove inline scripts
      .replace(/\s*(\w|-)*="[^"]*"\s*/gs, '') // Remove attributes
      .replace(/<font[^>]*>|<\/font>/g, '') // Remove weird font tags in long numbers (NOTE: May not needed anymore)
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces with normal spaces
      .replace(/([0-9])(\s+)([0-9])/g, '$1$3') // Remove spaces between numbers
  } catch (err) {
    return ''
  }
}

/**
 * Converts html string from a google response to text
 * NOTE: This converts <sup> tags to exponents so copy/paste works better
 *       EXAMPLE: "2<sup>10</sup>" becomes "2^10"
 */
export const htmlOutputToTextOutput: CalculatorFunction = (html) => {
  const preppedHtml = (html || '')
    .replace(/<sup>(-?[0-9]+)<\/sup>/g, '^$1')
    .replace(/<br>/g, '\n')
    .replace(/(<\/div>|<\/p>)/g, '\n$1')
    .replace(/\n+/g, '\n')
  const text = htmlToText(preppedHtml).trim()

  return text
}

/**
 * Converts html string to text
 */
export const htmlToText: CalculatorFunction = (html) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html
  return wrapper.innerText
}
