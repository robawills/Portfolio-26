import classNames from 'classnames/bind'

import ArrowOut from '@/public/images/icons/arrow-out.svg'
import ArrowUp from '@/public/images/icons/arrow-up.svg'
import Plus from '@/public/images/icons/plus.svg'
import styles from './Icon.module.scss'

const cx = classNames.bind(styles)

export enum IconName {
  ARROW_OUT = 'ArrowOut',
  ARROW_UP = 'ArrowUp',
  PLUS = 'Plus',
}

const ICONS_MAP = {
  [IconName.ARROW_OUT]: ArrowOut,
  [IconName.ARROW_UP]: ArrowUp,
  [IconName.PLUS]: Plus,
}

export interface IconProps {
  /** Icon identifier — picks which SVG to render from the registered set. */
  name: IconName
  /** Extra class merged onto the icon wrapper. */
  className?: string
  /** Foreground colour mode — `default` uses primary fg, `inverse` flips for dark-on-light surfaces. */
  color?: 'default' | 'inverse'
  /** Accessible label for the SVG. Defaults to `"<name> icon"`. */
  ariaLabel?: string
}

export const Icon = ({color, name, className, ariaLabel = `${name} icon`}: IconProps) => {
  const Svg = ICONS_MAP[name]

  return (
    <span className={cx('icon', className, color)} data-testid="icon-wrap">
      <Svg aria-label={ariaLabel} data-testid={name} />
    </span>
  )
}

export default Icon
