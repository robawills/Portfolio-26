import type {Preview} from '@storybook/nextjs'
import {Geist, Geist_Mono} from 'next/font/google'
import React from 'react'

import {CursorProvider} from '../context/Cursor'
import {HandPoseProvider} from '../context/HandPose'
import {InViewAnimationProvider} from '../context/InViewAnimation'

import '../app/globals.scss'

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']})
const geistMono = Geist_Mono({variable: '--font-geist-mono', subsets: ['latin']})

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
      <div
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{minHeight: '100dvh', fontFamily: 'var(--font-geist-sans)'}}
      >
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
