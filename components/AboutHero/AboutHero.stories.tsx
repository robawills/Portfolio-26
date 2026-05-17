import type {Meta, StoryObj} from '@storybook/nextjs'

import {AboutHero} from './index'

const meta: Meta<typeof AboutHero> = {
  title: 'Components/AboutHero',
  component: AboutHero,
  parameters: {layout: 'fullscreen'},
  args: {
    title:
      'Design Engineer with 14+ years crafting component systems, motion and high-fidelity front-end across retail, finance, healthcare and media.',
  },
}

export default meta

type Story = StoryObj<typeof AboutHero>

export const Default: Story = {}

export const Short: Story = {
  args: {title: 'Design Engineer.'},
}
