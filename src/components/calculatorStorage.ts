import deepEqual from 'deep-equal'
import { CalculatorState } from '../calculator'
import { store } from '../store'
import { storage, StorageChangeHandler } from '../utilities'

export const calculatorStorage = {
  get: async () => storage.get<CalculatorState>(),
  set: async (state: CalculatorState) => storage.set<CalculatorState>(state),
  clear: async () => storage.clear(),
  onChanged: (changeHandler: StorageChangeHandler<CalculatorState>) =>
    storage.onChanged(changeHandler),
}

store.subscribe(() => {
  calculatorStorage.set(store.getState())
})

calculatorStorage.onChanged(({ newValue }) => {
  if (newValue && !deepEqual(newValue, store.getState())) {
    store.dispatch({
      type: 'SYNC_HISTORY',
      payload: newValue,
    })
  }
})
