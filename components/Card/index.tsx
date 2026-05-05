import Link from 'next/link'
import classNames from 'classnames/bind'

import {Image} from '@/components/Image'
import breakpoints from '@/constants/breakpoints'
import type {ResponsiveFocalPoint} from '@/utils/focal-point'
import styles from './Card.module.scss'

const cx = classNames.bind(styles)

export interface CardProps {
  image: {
    src: string
    alt: string
    focalPoint?: ResponsiveFocalPoint
  }
  href: string
  signpost?: string
  title: string
  projectCategories?: string[]
}

export const Card = ({image, href, signpost, title, projectCategories}: CardProps) => {
  return (
    <article className={cx('card')}>
      <Link className={cx('link')} href={href}>
        <div className={cx('imageWrap')}>
          <Image
            className={cx('image')}
            src={image.src}
            alt={image.alt}
            fill
            sizes={`(max-width: ${breakpoints.xs}px) 90vw, (max-width: ${breakpoints.m}px) 42vw, (max-width: ${breakpoints.oversize}px) 28vw, 540px`}
            focalPoint={image.focalPoint}
          />
        </div>
        <div className={cx('detailsWrap')}>
          {signpost && <p className={cx('signpost', 'u-signpost')}>{signpost}</p>}
          <h3 className={`${cx('title')} u-h5`}>{title}</h3>
          {projectCategories && projectCategories.length > 0 && (
            <ul className={cx('categories')} aria-label="Project categories">
              {projectCategories.map((category, index) => (
                <li className={`${cx('category')} u-signpost`} key={index}>
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  )
}

export default Card
