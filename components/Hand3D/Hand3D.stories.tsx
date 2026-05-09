import type {Meta, StoryObj} from '@storybook/nextjs'

import {HAND_POSES, useHandPose} from '@/context/HandPose'

import {Hand3D} from './index'

const meta: Meta<typeof Hand3D> = {
  title: 'Components/Hand3D',
  component: Hand3D,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof Hand3D>

const PoseSwitcher = () => {
  const {pose, setPose} = useHandPose()
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        zIndex: 10,
      }}
    >
      {HAND_POSES.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPose(p)}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 999,
            background:
              pose === p ? 'var(--color-bg-interactive-hover)' : 'var(--color-bg-secondary)',
            color: pose === p ? 'var(--color-fg-onInteractive-hover)' : 'var(--color-fg-primary)',
            cursor: 'pointer',
          }}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div style={{height: '100dvh', position: 'relative'}}>
      <Hand3D />
    </div>
  ),
}

export const WithPoseSwitcher: Story = {
  render: () => (
    <div style={{height: '100dvh', position: 'relative'}}>
      <Hand3D />
      <PoseSwitcher />
    </div>
  ),
}
