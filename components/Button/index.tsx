'use client'

import {type ButtonHTMLAttributes} from 'react'
import classNames from 'classnames/bind'
import NextLink from 'next/link'

import {Icon, IconName} from '@/components/Icon'
import styles from './Button.module.scss'

const cx = classNames.bind(styles)

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  OUTLINE = 'outline',
  TEXT = 'text',
}

export interface BaseButtonProps {
  type?: ButtonType
  large?: boolean
  small?: boolean
  isDisabled?: boolean
  fullWidth?: boolean
  ariaLabel?: string
  ariaPressed?: boolean
  newWindow?: boolean
  dataAttributes?: Record<string, string>
}

export interface ButtonWithHref extends BaseButtonProps {
  href: string
  onClick?: never
  rel?: string
}

export interface ButtonWithOnClick extends BaseButtonProps {
  href?: never
  onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}

interface ButtonPropsWithLabel extends BaseButtonProps {
  label: string
  leadingIcon?: IconName
  trailingIcon?: IconName
}

interface ButtonPropsWithLeadingIcon extends BaseButtonProps {
  label?: string
  leadingIcon: IconName
  trailingIcon?: IconName
}

interface ButtonPropsWithTrailingIcon extends BaseButtonProps {
  label?: string
  leadingIcon?: IconName
  trailingIcon: IconName
}

export type ButtonProps =
  | (ButtonPropsWithLabel & ButtonWithHref)
  | (ButtonPropsWithLeadingIcon & ButtonWithHref)
  | (ButtonPropsWithTrailingIcon & ButtonWithHref)
  | (ButtonPropsWithLabel & ButtonWithOnClick)
  | (ButtonPropsWithLeadingIcon & ButtonWithOnClick)
  | (ButtonPropsWithTrailingIcon & ButtonWithOnClick)

const mergeRel = (...rels: Array<string | undefined>) => {
  const set = new Set<string>()
  for (const r of rels) {
    if (!r) continue
    r.split(/\s+/)
      .filter(Boolean)
      .forEach((t) => set.add(t.toLowerCase()))
  }
  const value = Array.from(set).join(' ')
  return value || undefined
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    type = ButtonType.PRIMARY,
    large = false,
    small = false,
    isDisabled = false,
    leadingIcon,
    trailingIcon,
    label,
    fullWidth = false,
    ariaLabel,
    ariaPressed,
    newWindow = false,
    dataAttributes,
  } = props

  const buttonClasses = cx(
    'button',
    type,
    large && 'large',
    small && 'small',
    isDisabled && 'isDisabled',
    fullWidth && 'fullWidth',
    leadingIcon && 'hasLeadingIcon',
    trailingIcon && 'hasTrailingIcon',
  )

  const renderContent = () => (
    <>
      {leadingIcon && <Icon name={leadingIcon} className={cx('leadingIcon')} />}
      {label && (
        <span
          className={cx('label', type === ButtonType.TEXT ? 'u-button--textLink' : 'u-button')}
        >
          {label}
        </span>
      )}
      {trailingIcon && <Icon name={trailingIcon} className={cx('trailingIcon')} />}
    </>
  )

  if (typeof props.href === 'string') {
    const rel = newWindow
      ? mergeRel('noopener', 'noreferrer', props.rel)
      : mergeRel(props.rel)

    return (
      <NextLink
        href={props.href}
        className={buttonClasses}
        {...(isDisabled ? {'aria-disabled': 'true'} : {})}
        {...(ariaLabel ? {'aria-label': ariaLabel} : {})}
        target={newWindow ? '_blank' : '_self'}
        {...(rel ? {rel} : {})}
        {...dataAttributes}
      >
        {renderContent()}
      </NextLink>
    )
  }

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={buttonClasses}
      disabled={isDisabled}
      {...(ariaLabel ? {'aria-label': ariaLabel} : {})}
      {...(ariaPressed
        ? {'aria-pressed': 'true'}
        : {'aria-pressed': 'false'})}
      {...dataAttributes}
    >
      {renderContent()}
    </button>
  )
}

export default Button
