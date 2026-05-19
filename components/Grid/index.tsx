import classNames from 'classnames/bind'
import {createElement, type CSSProperties, type ElementType, type ReactNode} from 'react'

import styles from './Grid.module.scss'

const cx = classNames.bind(styles)

export interface GridProps {
  /** Tag the inner grid element renders as (e.g. `"section"`). Defaults to `"div"`. */
  as?: ElementType
  /** Grid items. Position via `grid-column` on each child's own class. */
  children: ReactNode
  /** Extra class merged onto the inner grid element. */
  className?: string
  /** Inline styles applied to the inner grid element. */
  style?: CSSProperties
}

export const Grid = ({as: Tag = 'div', children, className, style}: GridProps) => (
  <div className={cx('gridWrap')}>
    {createElement(Tag, {className: cx('grid', className), style}, children)}
  </div>
)

export default Grid
