import type {Meta, StoryObj} from '@storybook/nextjs'

import {HomeHero} from './index'

const meta: Meta<typeof HomeHero> = {
  title: 'Components/HomeHero',
  component: HomeHero,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof HomeHero>

export const Default: Story = {
  args: {
    title: "Hello, I'm Rob.",
    description: 'Design Engineer building considered, expressive interfaces.',
  },
}

export const ShortCopy: Story = {
  args: {
    title: 'Hi.',
    description: 'Front-end with feeling.',
  },
}
