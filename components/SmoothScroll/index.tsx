'use client'

import {ReactLenis} from 'lenis/react'
import type {ReactNode} from 'react'

import 'lenis/dist/lenis.css'

interface SmoothScrollProps {
  /** App tree to enable Lenis smooth scrolling on. Mount this once near the root. */
  children: ReactNode
}

export const SmoothScroll = ({children}: SmoothScrollProps) => (
  <ReactLenis root options={{lerp: 0.1, smoothWheel: true}}>
    {children}
  </ReactLenis>
)

export default SmoothScroll
