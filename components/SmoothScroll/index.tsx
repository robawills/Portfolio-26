'use client'

import {ReactLenis} from 'lenis/react'
import type {ReactNode} from 'react'

import 'lenis/dist/lenis.css'

interface SmoothScrollProps {
  children: ReactNode
}

export const SmoothScroll = ({children}: SmoothScrollProps) => (
  <ReactLenis root options={{lerp: 0.1, smoothWheel: true}}>
    {children}
  </ReactLenis>
)

export default SmoothScroll
