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
  /** Visual variant — primary, secondary, tertiary, outline or text. Defaults to PRIMARY. */
  type?: ButtonType
  /** Render the larger size variant. */
  large?: boolean
  /** Render the smaller size variant. */
  small?: boolean
  /** Disable the button. For `<a>` variants this adds `aria-disabled` and blocks navigation. */
  isDisabled?: boolean
  /** Stretch the button to fill its container's width. */
  fullWidth?: boolean
  /** Accessible label, used when the visible text isn't sufficient (e.g. icon-only). */
  ariaLabel?: string
  /** Toggle-style `aria-pressed` value for buttons that act like toggles. */
  ariaPressed?: boolean
  /** For href buttons: open the link in a new tab (adds `target="_blank"` and safe `rel`). */
  newWindow?: boolean
  /** Extra `data-*` attributes applied to the rendered element. */
  dataAttributes?: Record<string, string>
}

export interface ButtonWithHref extends BaseButtonProps {
  /** Destination URL — renders as an `<a>` instead of `<button>`. */
  href: string
  onClick?: never
  /** Override the auto-generated `rel` attribute (merged with safe defaults). */
  rel?: string
}

export interface ButtonWithOnClick extends BaseButtonProps {
  href?: never
  /** Click handler — renders as a `<button type="button">`. */
  onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}

interface ButtonPropsWithLabel extends BaseButtonProps {
  /** Visible text. Required when no leading or trailing icon is provided. */
  label: string
  /** Optional icon rendered before the label. */
  leadingIcon?: IconName
  /** Optional icon rendered after the label. */
  trailingIcon?: IconName
}

interface ButtonPropsWithLeadingIcon extends BaseButtonProps {
  /** Visible text. Optional when an icon is present. */
  label?: string
  /** Icon rendered before the label. */
  leadingIcon: IconName
  /** Optional icon rendered after the label. */
  trailingIcon?: IconName
}

interface ButtonPropsWithTrailingIcon extends BaseButtonProps {
  /** Visible text. Optional when an icon is present. */
  label?: string
  /** Optional icon rendered before the label. */
  leadingIcon?: IconName
  /** Icon rendered after the label. */
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
