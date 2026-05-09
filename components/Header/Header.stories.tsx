import type {Meta, StoryObj} from '@storybook/nextjs'

import {Header} from './index'

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{minHeight: '200vh', background: 'var(--color-bg-primary)'}}>
        <Story />
        <div style={{padding: '20vh 4rem', color: 'var(--color-fg-secondary)'}}>
          Scroll down to see the header transition into its scrolled state (background fills,
          tagline description collapses).
        </div>
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Header>

export const Default: Story = {}
