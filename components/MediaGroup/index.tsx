'use client'

import classNames from 'classnames/bind'

import {Image} from '@/components/Image'
import breakpoints from '@/constants/breakpoints'
import {useInViewAnimation} from '@/hooks/useInViewAnimation'

import styles from './MediaGroup.module.scss'

const cx = classNames.bind(styles)

export interface MediaGroupItemProps {
  /**
   * Used as alt text for the image.
   */
  metaTitle: string
  /**
   * URL of the image.
   */
  src: string
  /**
   * Layout size for larger screens.
   * Responsibility for preventing gappy layouts (e.g. a single 'half' image on
   * its own line) lies with the children and the props passed into any given
   * instance of MediaGroup, not the MediaGroup component itself.
   */
  size: 'full' | 'half' | 'max' | 'mega'
  /**
   * Optional placeholder color settings. Defaults to 'default'.
   */
  placeholderColor?: 'default' | 'none' | 'dark'
}

const sizesFull = `(max-width: ${breakpoints.oversize}px) 90vw, 1680px`
const sizesHalf = `(max-width: ${breakpoints.xs}px) 90vw, (max-width: ${breakpoints.oversize}px) 43vw, 820px`

interface ItemWrapperProps {
  size: MediaGroupItemProps['size']
  children: React.ReactNode
}

const ItemWrapper = ({size, children}: ItemWrapperProps) => {
  const animationRef = useInViewAnimation<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px',
  })

  return (
    <div className={cx('item', `item--${size}`)} ref={animationRef}>
      <div className={cx('itemInner')}>{children}</div>
    </div>
  )
}

export const MediaGroupImage = ({
  src,
  metaTitle,
  size,
  placeholderColor,
}: MediaGroupItemProps) => (
  <ItemWrapper size={size}>
    <Image
      src={src}
      alt={metaTitle}
      fill
      sizes={
        size === 'full' || size === 'max' || size === 'mega'
          ? sizesFull
          : sizesHalf
      }
      placeholderColor={placeholderColor || 'default'}
    />
  </ItemWrapper>
)

export interface MediaGroupProps {
  /** One or more `<MediaGroupImage>` instances. */
  children: React.ReactNode
  /** Extra class merged onto the outer wrapper. */
  className?: string
}

export const MediaGroup = ({children, className}: MediaGroupProps) => (
  <div className={cx('mediaGroup', className)}>
    <div className={cx('inner')}>{children}</div>
  </div>
)

export default MediaGroup
