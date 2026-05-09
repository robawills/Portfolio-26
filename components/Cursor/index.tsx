'use client'

import classNames from 'classnames/bind'
import {useEffect, useRef} from 'react'

import {Icon} from '@/components/Icon'
import {useCursor} from '@/context/Cursor'
import styles from './Cursor.module.scss'

const cx = classNames.bind(styles)

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t

export const Cursor = () => {
  const {icon, entered} = useCursor()
  const cursorElement = useRef<HTMLDivElement>(null)
  const target = useRef({x: 0, y: 0})
  const current = useRef({x: 0, y: 0})
  const frame = useRef<number>(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current = {x: e.clientX, y: e.clientY}
    }

    const animate = () => {
      current.current = {
        x: lerp(current.current.x, target.current.x, 0.2),
        y: lerp(current.current.y, target.current.y, 0.2),
      }
      if (cursorElement.current) {
        cursorElement.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
      }
      frame.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    frame.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div
      ref={cursorElement}
      className={cx('cursor', {'is-entered': entered})}
      data-testid="cursor-element"
    >
      <div className={cx('contentWrapper')}>
        {icon && <Icon name={icon} className={cx('icon')} />}
      </div>
    </div>
  )
}

export default Cursor
