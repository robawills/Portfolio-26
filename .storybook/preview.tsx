import type {Preview} from '@storybook/nextjs'
import {Geist_Mono, Inter} from 'next/font/google'
import React from 'react'

import {CursorProvider} from '../context/Cursor'
import {HandPoseProvider} from '../context/HandPose'
import {InViewAnimationProvider} from '../context/InViewAnimation'

import '../app/globals.scss'

const inter = Inter({variable: '--font-inter', subsets: ['latin']})
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin']})

// Hoist next/font's variable classes onto <html> so the `--font-stack` token
// (which expands to `var(--font-inter), Arial, ...`) resolves at :root —
// matching the real app where `app/layout.tsx` puts these classes on <html>.
// Without this, `body { font-family: var(--font-stack) }` resolves to invalid
// at computed-value time and everything falls back to the browser default.
if (typeof document !== 'undefined') {
  document.documentElement.classList.add(inter.variable, geistMono.variable)
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'app',
      values: [
        {name: 'app', value: '#151514'},
        {name: 'light', value: '#e5e1d6'},
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{minHeight: '100dvh'}}>
        <InViewAnimationProvider>
          <CursorProvider>
            <HandPoseProvider>
              <Story />
            </HandPoseProvider>
          </CursorProvider>
        </InViewAnimationProvider>
      </div>
    ),
  ],
}

export default preview
