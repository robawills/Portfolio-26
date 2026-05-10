'use client'

import classNames from 'classnames/bind'

import {Grid} from '@/components/Grid'
import {useInViewAnimation} from '@/hooks/useInViewAnimation'

import styles from './AboutBuild.module.scss'

const cx = classNames.bind(styles)

const DEFAULT_SIGNPOST = 'About'
const DEFAULT_DESCRIPTION =
  'Built with Next.js 16 + React 19 (React Compiler enabled), TypeScript end to end. Content lives in Sanity, queried with GROQ; smooth scrolling via Lenis, page motion via GSAP, 3D balloon hand via Three.js + React Three Fiber. Styling is SCSS modules layered on a single design-token system designed in Figma. The component library is documented in Storybook and covered by Jest + React Testing Library — every component ships with stories and tests, so the design system stays trustworthy as it grows.'

export interface AboutBuildProps {
  signpost?: string
  description?: string
  className?: string
}

export const AboutBuild = ({
  signpost = DEFAULT_SIGNPOST,
  description = DEFAULT_DESCRIPTION,
  className,
}: AboutBuildProps) => {
  const animationRef = useInViewAnimation<HTMLElement>()

  return (
    <section className={cx('aboutBuild', className)} ref={animationRef}>
      <Grid>
        <span className={cx('signpost', 'u-signpost')}>{signpost}</span>
        <p className={cx('description', 'u-body')}>{description}</p>
      </Grid>
    </section>
  )
}

export default AboutBuild
