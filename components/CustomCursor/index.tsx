'use client'

import {type ReactNode, useCallback, useEffect} from 'react'

import {type IconName} from '@/components/Icon'
import {useCursor} from '@/context/Cursor'

interface CustomCursorProps {
  /** Region the custom cursor activates over — wraps your interactive content. */
  children: ReactNode
  /** Optional icon shown inside the custom cursor while hovered. */
  icon?: IconName
  /** Hide the cursor on mousedown (so it doesn't sit over a click feedback). Defaults to true. */
  hideOnClick?: boolean
}

export const CustomCursor = ({children, icon, hideOnClick = true}: CustomCursorProps) => {
  const {setIcon, setEntered} = useCursor()

  const onMouseEnter = useCallback(() => {
    setEntered(true)
    if (icon) setIcon(icon)
  }, [icon, setEntered, setIcon])

  const onMouseLeave = useCallback(() => {
    setEntered(false)
    setIcon(null)
  }, [setEntered, setIcon])

  const onMouseDown = useCallback(() => {
    if (hideOnClick) setEntered(false)
  }, [hideOnClick, setEntered])

  useEffect(() => {
    return () => {
      setEntered(false)
      setIcon(null)
    }
  }, [setEntered, setIcon])

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      style={{display: 'contents'}}
    >
      {children}
    </div>
  )
}

export default CustomCursor
