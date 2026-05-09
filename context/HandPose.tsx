'use client'

import {createContext, useContext, useState, type ReactNode} from 'react'

export const HAND_POSES = [
  'default',
  'peace',
  'phone',
  'horns',
  'middle',
] as const

export type HandPose = (typeof HAND_POSES)[number]

interface HandPoseContextValue {
  pose: HandPose
  setPose: (pose: HandPose) => void
}

const HandPoseContext = createContext<HandPoseContextValue | null>(null)

export function HandPoseProvider({children}: {children: ReactNode}) {
  const [pose, setPose] = useState<HandPose>('default')
  return (
    <HandPoseContext.Provider value={{pose, setPose}}>
      {children}
    </HandPoseContext.Provider>
  )
}

export function useHandPose(): HandPoseContextValue {
  const ctx = useContext(HandPoseContext)
  if (!ctx) {
    return {pose: 'default', setPose: () => {}}
  }
  return ctx
}
