'use client'

import {useEffect, useRef, useCallback, useMemo, useLayoutEffect} from 'react'
import {useInViewAnimationConfig, type InViewAnimationConfig} from '@/context/InViewAnimation'

export function useInViewAnimation<T extends HTMLElement = HTMLElement>(
  options: InViewAnimationConfig & {immediateIfInView?: boolean} = {},
) {
  const globalConfig = useInViewAnimationConfig()
  const config = useMemo(
    () => ({
      ...globalConfig,
      ...options,
      immediateIfInView:
        options.immediateIfInView !== undefined ? options.immediateIfInView : true,
    }),
    [globalConfig, options],
  )
  const elementRef = useRef<T>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const animatedElementsRef = useRef<WeakSet<HTMLElement>>(new WeakSet())

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement
        const isIntersecting = entry.isIntersecting
        const hasAnimated = animatedElementsRef.current.has(element)

        if (isIntersecting && !hasAnimated) {
          element.setAttribute('data-inview', 'true')
          animatedElementsRef.current.add(element)
          config.onEnter?.(entry)
          if (config.triggerOnce && observerRef.current) {
            observerRef.current.unobserve(element)
          }
        } else if (!isIntersecting && !config.triggerOnce && hasAnimated) {
          element.removeAttribute('data-inview')
          animatedElementsRef.current.delete(element)
          config.onExit?.(entry)
        }
      })
    },
    [config],
  )

  useLayoutEffect(() => {
    const element = elementRef.current
    const shouldCheckImmediate = config.immediateIfInView
    if (!element || !shouldCheckImmediate) return

    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth

    const isInViewport =
      rect.top < windowHeight && rect.bottom > 0 && rect.left < windowWidth && rect.right > 0

    if (isInViewport) {
      element.setAttribute('data-inview', 'true')
      animatedElementsRef.current.add(element)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    if (config.triggerOnce && animatedElementsRef.current.has(element)) return

    const observerOptions: IntersectionObserverInit = {
      threshold: config.threshold,
      rootMargin: config.rootMargin,
    }

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions)
    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [handleIntersection, config.threshold, config.rootMargin, config.triggerOnce])

  return elementRef
}

export default useInViewAnimation
