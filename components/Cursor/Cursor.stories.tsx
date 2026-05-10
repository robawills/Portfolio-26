import type {Meta, StoryObj} from '@storybook/nextjs'

import {CustomCursor} from '@/components/CustomCursor'
import {IconName} from '@/components/Icon'

import {Cursor} from './index'

const meta: Meta<typeof Cursor> = {
  title: 'Components/Cursor',
  component: Cursor,
}

export default meta

type Story = StoryObj<typeof Cursor>

const Hotspot = ({
  icon,
  label,
}: {
  icon: IconName
  label: string
}) => (
  <CustomCursor icon={icon}>
    <div
      style={{
        width: 320,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-tertiary)',
        color: 'var(--color-fg-primary)',
        borderRadius: 16,
        cursor: 'none',
      }}
    >
      {label}
    </div>
  </CustomCursor>
)

export const HoverableHotspot: Story = {
  render: () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 24, padding: 48}}>
      <p style={{color: 'var(--color-fg-secondary)'}}>
        Hover the panel below — the custom cursor follows your pointer with a lerped trail.
      </p>
      <Hotspot icon={IconName.ARROW_OUT} label="Hover me" />
    </div>
  ),
}

export const MultipleHotspots: Story = {
  render: () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 24, padding: 48}}>
      <Hotspot icon={IconName.ARROW_OUT} label="Arrow out" />
      <Hotspot icon={IconName.PLUS} label="Plus" />
    </div>
  ),
}
