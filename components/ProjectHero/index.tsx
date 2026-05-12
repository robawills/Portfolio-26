'use client'

import classNames from 'classnames/bind'
import gsap from 'gsap'
import {SplitText} from 'gsap/SplitText'
import {useEffect, useLayoutEffect, useRef} from 'react'

import {Grid} from '@/components/Grid'

import styles from './ProjectHero.module.scss'

const cx = classNames.bind(styles)

gsap.registerPlugin(SplitText)

// useLayoutEffect on the client (so GSAP can hide the text before paint),
// useEffect during SSR (so React doesn't log the layout-effect warning).
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface ProjectHeroLink {
  key?: string
  title: string
  url: string
}

export interface ProjectHeroProps {
  title: string
  description: string
  links?: ProjectHeroLink[]
  className?: string
}

export const ProjectHero = ({
  title,
  description,
  links,
  className,
}: ProjectHeroProps) => {
  const safeLinks = links ?? []
  const titleRef = useRef<HTMLHeadingElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const titleEl = titleRef.current
    const metaEl = metaRef.current
    if (!titleEl || !metaEl) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const splitTitle = new SplitText(titleEl, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'projectHeroLine',
    })

    // Hide synchronously so nothing flashes at the natural position.
    gsap.set(splitTitle.lines, {yPercent: 100})
    gsap.set(metaEl, {opacity: 0, y: 24})

    const tl = gsap.timeline({defaults: {ease: 'power3.out'}})
    tl.to(splitTitle.lines, {yPercent: 0, stagger: 0.08, duration: 0.9}).to(
      metaEl,
      {opacity: 1, y: 0, duration: 0.8},
      // Begin the meta fade ~0.4s before the title finishes so it lands
      // just as the last title line settles.
      '-=0.4',
    )

    return () => {
      tl.kill()
      splitTitle.revert()
    }
  }, [title])

  return (
    <section className={cx('projectHero', className)}>
      <Grid as="div" className={cx('grid')}>
        <h1 ref={titleRef} className={cx('title', 'u-h1')}>
          {title}
        </h1>
        <div ref={metaRef} className={cx('meta')}>
          <p className={cx('description', 'u-body')}>{description}</p>
          {safeLinks.length > 0 && (
            <div className={cx('links')}>
              <span className={cx('linksLabel', 'u-signpostSmall')}>Links</span>
              <ul className={cx('linksList')}>
                {safeLinks.map((link) => (
                  <li key={link.key ?? link.url} className={cx('linksItem')}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cx('u-textLink')}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Grid>
    </section>
  )
}

export default ProjectHero
