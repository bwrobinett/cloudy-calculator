import { Dispatch, configureStore } from '@reduxjs/toolkit'
import { AnyCalculatorAction } from './calculator'
import { calculatorReducer } from './calculator/reducers'

export const store = configureStore({
  reducer: calculatorReducer,
})

export type AppDispatch = Dispatch<AnyCalculatorAction>
export type RootState = ReturnType<typeof store.getState>
