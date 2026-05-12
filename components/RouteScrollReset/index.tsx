'use client'

import {useLenis} from 'lenis/react'
import {usePathname} from 'next/navigation'
import {useEffect} from 'react'

export const RouteScrollReset = () => {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    // Always slam both the native and Lenis virtual scroll back to top so a
    // navigation can never paint a frame at a leftover scroll position.
    if (typeof window !== 'undefined') {
      window.scrollTo({top: 0, left: 0, behavior: 'auto'})
    }
    if (lenis) {
      lenis.scrollTo(0, {immediate: true, force: true})
    }
  }, [pathname, lenis])

  return null
}

export default RouteScrollReset
