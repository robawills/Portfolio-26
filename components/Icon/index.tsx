import classNames from 'classnames/bind'

import ArrowUp from '@/public/images/icons/arrow-up.svg'
import Plus from '@/public/images/icons/plus.svg'
import styles from './Icon.module.scss'

const cx = classNames.bind(styles)

export enum IconName {
  ARROW_UP = 'ArrowUp',
  PLUS = 'Plus',
}

const ICONS_MAP = {
  [IconName.ARROW_UP]: ArrowUp,
  [IconName.PLUS]: Plus,
}

export interface IconProps {
  name: IconName
  className?: string
  color?: 'default' | 'inverse'
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
