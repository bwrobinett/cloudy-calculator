const chrome = typeof window !== 'undefined' ? window.chrome : undefined
const chromeStorage = typeof chrome !== 'undefined' ? chrome.storage : undefined

/** ==== TYPES ==== */

export type StorageChangeHandler<S> = (changes: {
  newValue?: S
  oldValue?: S
}) => void

/** ==== METHODS ==== */

/**
 * Gets storage state
 */
const get = <S>(): Promise<S | undefined> => {
  if (typeof chromeStorage !== 'undefined') {
    return new Promise((resolve) => {
      chromeStorage.local.get('state', ({ state }) => {
        // console.log(
        //   'get state chrome',
        //   JSON.stringify(JSON.parse(state), null, 2)
        // )
        resolve(JSON.parse(state || 'null') || undefined)
      })
    })
  } else if (typeof localStorage !== 'undefined') {
    const state = localStorage.getItem('state')
    console.log(
      'get state local',
      JSON.stringify(JSON.parse(state as any), null, 2)
    )
    return Promise.resolve(JSON.parse(state || 'null') || undefined)
  }

  return Promise.resolve(JSON.parse('null') || undefined)
}

/**
 * Sets storage state
 */
const set = <S>(state: S): Promise<undefined> => {
  if (typeof chromeStorage !== 'undefined') {
    return new Promise((resolve) => {
      chromeStorage.local.set({ state: JSON.stringify(state || null) }, () => {
        resolve(undefined)
      })
    })
  } else if (typeof localStorage !== 'undefined') {
    const newState = JSON.stringify(state || null)
    localStorage.setItem('state', newState)
  }

  return Promise.resolve(undefined)
}

/**
 * Clears storage state
 */
const clear = async () => await set(null)

/**
 * Adds handler for storage state changes
 */
const onChanged = <S>(changeHandler: StorageChangeHandler<S>) => {
  if (typeof chromeStorage !== 'undefined') {
    chromeStorage.onChanged.addListener((changes) => {
      changeHandler({ ...changes.state })
    })
  }
}

export const storage = { get, set, clear, onChanged }
