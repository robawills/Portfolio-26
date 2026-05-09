'use client'

import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

import {Cursor} from '@/components/Cursor'
import {type IconName} from '@/components/Icon'

interface CursorContextValue {
  icon: IconName | null
  setIcon: Dispatch<SetStateAction<IconName | null>>
  entered: boolean
  setEntered: Dispatch<SetStateAction<boolean>>
}

const CursorContext = createContext<CursorContextValue>({
  icon: null,
  setIcon: () => {},
  entered: false,
  setEntered: () => {},
})

export function CursorProvider({children}: {children: ReactNode}) {
  const [icon, setIcon] = useState<IconName | null>(null)
  const [entered, setEntered] = useState(false)

  return (
    <CursorContext.Provider value={{icon, setIcon, entered, setEntered}}>
      <Cursor />
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  return useContext(CursorContext)
}
