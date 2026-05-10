import type {Meta, StoryObj} from '@storybook/nextjs'

import {AboutBuild} from './index'

const meta: Meta<typeof AboutBuild> = {
  title: 'Components/AboutBuild',
  component: AboutBuild,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof AboutBuild>

export const Default: Story = {}

export const CustomCopy: Story = {
  args: {
    signpost: 'Stack',
    description:
      'Hand-crafted, reproducible, small. The kind of front-end that survives a year of changes without rotting.',
  },
}
