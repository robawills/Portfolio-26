'use client'

import classNames from 'classnames/bind'
import {useLenis} from 'lenis/react'

import {Grid} from '@/components/Grid'
import {Icon, IconName} from '@/components/Icon'

import styles from './Footer.module.scss'

const cx = classNames.bind(styles)

const LINKEDIN_URL = 'https://www.linkedin.com/in/rob-wills-000839169/'

export interface FooterProps {
  className?: string
}

export const Footer = ({className}: FooterProps) => {
  const lenis = useLenis()
  const year = new Date().getFullYear()

  const handleBackToTop = () => {
    if (lenis) {
      lenis.scrollTo(0)
      return
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
  }

  return (
    <footer className={cx('footer', className)}>
      <Grid as="div" className={cx('grid')}>
        <span className={cx('copyright', 'u-bodySmall')}>
          &copy; {year} Rob Wills
        </span>
        <a
          className={cx('linkedin', 'u-bodySmall', 'u-textLink')}
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <button
          type="button"
          className={cx('backToTop', 'u-bodySmall')}
          onClick={handleBackToTop}
        >
          <span>Back to top</span>
          <Icon name={IconName.ARROW_UP} className={cx('backToTopIcon')} />
        </button>
      </Grid>
    </footer>
  )
}

export default Footer
