import classNames from 'classnames/bind'
import {createElement, type CSSProperties, type ElementType, type ReactNode} from 'react'

import styles from './Grid.module.scss'

const cx = classNames.bind(styles)

export interface GridProps {
  as?: ElementType
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export const Grid = ({as: Tag = 'div', children, className, style}: GridProps) => (
  <div className={cx('gridWrap')}>
    {createElement(Tag, {className: cx('grid', className), style}, children)}
  </div>
)

export default Grid
