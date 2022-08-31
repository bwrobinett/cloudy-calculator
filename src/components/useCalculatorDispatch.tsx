import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useCalculatorDispatch = () => useDispatch<AppDispatch>()
export const useCalculatorSelector: TypedUseSelectorHook<RootState> =
  useSelector
