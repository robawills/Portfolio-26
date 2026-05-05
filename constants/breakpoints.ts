export const breakpoints = {
  xxs: 375,
  xs: 640,
  s: 768,
  m: 1024,
  l: 1280,
  xl: 1366,
  xxl: 1660,
  xxxl: 1800,
  oversize: 1920,
} as const

export type BreakpointKey = keyof typeof breakpoints

export const BREAKPOINTS_ASC = [
  'xxs',
  'xs',
  's',
  'm',
  'l',
  'xl',
  'xxl',
  'xxxl',
  'oversize',
] as const satisfies BreakpointKey[]

export default breakpoints
