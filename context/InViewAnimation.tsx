'use client'

import {createContext, useContext, type ReactNode} from 'react'

export interface InViewAnimationConfig {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  immediateIfInView?: boolean
  onEnter?: (entry: IntersectionObserverEntry) => void
  onExit?: (entry: IntersectionObserverEntry) => void
}

const defaultConfig: Required<Omit<InViewAnimationConfig, 'onEnter' | 'onExit'>> = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px',
  triggerOnce: true,
  immediateIfInView: true,
}

const InViewAnimationContext = createContext<InViewAnimationConfig>(defaultConfig)

export const useInViewAnimationConfig = () => useContext(InViewAnimationContext)

interface InViewAnimationProviderProps {
  children: ReactNode
  config?: InViewAnimationConfig
}

export const InViewAnimationProvider = ({
  children,
  config = {},
}: InViewAnimationProviderProps) => {
  const mergedConfig = {...defaultConfig, ...config}
  return (
    <InViewAnimationContext.Provider value={mergedConfig}>
      {children}
    </InViewAnimationContext.Provider>
  )
}

export default InViewAnimationProvider
