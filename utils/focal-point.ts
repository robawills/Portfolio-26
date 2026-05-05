export type FocalPoint =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | (string & {})

export type ResponsiveFocalPoint =
  | FocalPoint
  | {
      mobile?: FocalPoint
      tablet?: FocalPoint
      desktop?: FocalPoint
    }

export const focalPointToCss = (focalPoint: FocalPoint = 'center'): string => {
  if (focalPoint.includes('%')) return focalPoint

  const cssValues: Record<string, string> = {
    center: '50% 50%',
    top: '50% 25%',
    bottom: '50% 75%',
    left: '25% 50%',
    right: '75% 50%',
    'top-left': '25% 25%',
    'top-right': '75% 25%',
    'bottom-left': '25% 75%',
    'bottom-right': '75% 75%',
  }

  return cssValues[focalPoint] || '50% 50%'
}
