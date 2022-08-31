// import { CalculatorFunction } from "./types";

declare module 'any-base' {
  const BIN = '01'
  const OCT = '01234567'
  const DEC = '0123456789'
  const HEX = '0123456789abcdef'

  export interface AnyBase {
    (srcAlphabet: string, dstAlphabet: string): (string) => string
    BIN: typeof BIN
    OCT: typeof OCT
    DEC: typeof DEC
    HEX: typeof HEX
    [base: string]: string
  }

  const anyBase: AnyBase
  export default anyBase
}
