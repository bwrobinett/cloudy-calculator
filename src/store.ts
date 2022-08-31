import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { calculatorReducer } from './calculator/reducers'

export const store = configureStore({
  reducer: calculatorReducer,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
