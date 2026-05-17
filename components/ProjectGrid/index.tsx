'use client'

import classNames from 'classnames/bind'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useEffect, useLayoutEffect, useRef} from 'react'

import {ProjectCard, type ProjectCardProps} from '@/components/ProjectCard'
import {useInViewAnimation} from '@/hooks/useInViewAnimation'
import styles from './ProjectGrid.module.scss'

const cx = classNames.bind(styles)

gsap.registerPlugin(ScrollTrigger)

// useLayoutEffect on the client (so GSAP runs before paint),
// useEffect during SSR (so React doesn't log the layout-effect warning).
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

const FADE_MIN_OPACITY = 0.5

// Reads --layout-header-height (rem or px) and returns it in pixels — used as
// the ScrollTrigger end offset so the fade completes exactly when the new
// card reaches its sticky resting position.
function readHeaderOffsetPx(): number {
  const root = document.documentElement
  const raw = getComputedStyle(root)
    .getPropertyValue('--layout-header-height')
    .trim()
  if (!raw) return 72
  if (raw.endsWith('px')) return parseFloat(raw)
  if (raw.endsWith('rem')) {
    const rem = parseFloat(getComputedStyle(root).fontSize) || 16
    return parseFloat(raw) * rem
  }
  return parseFloat(raw) || 72
}

export interface ProjectGridProps {
  projects: ProjectCardProps[]
}

export const ProjectGrid = ({projects}: ProjectGridProps) => {
  const animationRef = useInViewAnimation<HTMLDivElement>()
  const gridRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const items = Array.from(
      grid.querySelectorAll<HTMLElement>('[data-testid="grid-item"]'),
    )
    if (items.length < 2) return

    const triggers: ScrollTrigger[] = []

    for (let i = 1; i < items.length; i++) {
      const currentItem = items[i]
      const previousImage = items[i - 1].querySelector<HTMLElement>(
        '[data-card-fade-target]',
      )
      if (!previousImage) continue

      // Scrubs opacity 1 → 0.5 as the new card's top travels from viewport
      // centre to its sticky resting position. Reversible on scroll-up.
      const tween = gsap.fromTo(
        previousImage,
        {opacity: 1},
        {
          opacity: FADE_MIN_OPACITY,
          ease: 'none',
          scrollTrigger: {
            trigger: currentItem,
            start: 'top 30%',
            end: () => `top top+=${readHeaderOffsetPx()}`,
            scrub: true,
          },
        },
      )

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    }

    return () => {
      triggers.forEach((trigger) => trigger.kill())
    }
  }, [projects.length])

  return (
    <div className={cx('projectGridWrap')} ref={animationRef}>
      <header className={cx('intro')}>
        <span className={cx('introLine', 'introLine--lead', 'u-signpost')}>
          Selected Work
        </span>
        <span className={cx('introLine', 'introLine--muted', 'u-signpost')}>
          Old &amp; New
        </span>
      </header>
      <div ref={gridRef} className={cx('projectGrid')} data-testid="project-grid">
        {projects.map((project, index) => (
          <div
            className={cx('gridItem')}
            key={index}
            data-testid="grid-item"
            style={{'--animation-index': index + 2} as React.CSSProperties}
          >
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectGrid
