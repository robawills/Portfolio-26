'use client'

import classNames from 'classnames/bind'
import {Image} from '@/components/Image'
import {useInViewAnimation} from '@/hooks/useInViewAnimation'
import breakpoints from '@/constants/breakpoints'
import styles from './ExpertiseDetailHero.module.scss'

const cx = classNames.bind(styles)

export interface ExpertiseDetailHeroProps {
  signpost: string
  title: string
  intro: string
  image: {
    src: string
    alt: string
  }
}

export const ExpertiseDetailHero = ({
  signpost,
  title,
  intro,
  image,
}: ExpertiseDetailHeroProps) => {
  const animationRef = useInViewAnimation<HTMLDivElement>()

  return (
    <div className={cx('expertiseDetailHero')} ref={animationRef}>
      <div className={cx('inner')}>
        <div className={cx('metaWrap')}>
          <span className={cx('signpost', 'u-signpost')}>Expertise</span>
          <span className={cx('u-body', 'metaLabel')}>{signpost}</span>
        </div>

        <div className={cx('titleWrap')}>
          <h1 className={cx('title')}>{title}</h1>
          <p className={cx('intro', 'u-body')}>{intro}</p>
        </div>
      </div>
      <div className={cx('imageWrap')}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={`(max-width: ${breakpoints.oversize}px) 90vw, 1680px`}
          priority
        />
      </div>
    </div>
  )
}

export default ExpertiseDetailHero
