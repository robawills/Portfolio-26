import type {Meta, StoryObj} from '@storybook/nextjs'

import {SmoothScroll} from './index'

const meta: Meta<typeof SmoothScroll> = {
  title: 'Components/SmoothScroll',
  component: SmoothScroll,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof SmoothScroll>

const Filler = ({label, color}: {label: string; color: string}) => (
  <div
    style={{
      height: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: color,
      color: 'var(--color-fg-primary)',
      fontFamily: 'var(--font-geist-sans)',
      fontSize: '2rem',
    }}
  >
    {label}
  </div>
)

export const Default: Story = {
  render: () => (
    <SmoothScroll>
      <Filler label="Scroll me — Lenis interpolates the wheel" color="var(--color-bg-primary)" />
      <Filler label="…through to here" color="var(--color-bg-secondary)" />
      <Filler label="…and on" color="var(--color-bg-tertiary)" />
    </SmoothScroll>
  ),
}
