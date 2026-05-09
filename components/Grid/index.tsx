import {createElement, type CSSProperties, type ElementType, type ReactNode} from 'react'
import classNames from 'classnames/bind'

import styles from './Grid.module.scss'

const cx = classNames.bind(styles)

interface GridProps {
  as?: ElementType
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export const Grid = ({as: Tag = 'div', children, className, style}: GridProps) =>
  createElement(Tag, {className: cx('grid', className), style}, children)

export default Grid
