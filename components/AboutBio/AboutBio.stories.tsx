import type {Meta, StoryObj} from '@storybook/nextjs'

import {AboutBio} from './index'

const meta: Meta<typeof AboutBio> = {
  title: 'Components/AboutBio',
  component: AboutBio,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof AboutBio>

export const SingleParagraph: Story = {
  args: {
    bio: 'I work at the seam between design and engineering — design systems that ship, animation that feels right, and front-end built to last a year of changes without rotting.',
  },
}

export const MultipleParagraphs: Story = {
  args: {
    bio: `I work at the seam between design and engineering — design systems that ship, animation that feels right, and front-end built to last a year of changes without rotting.

Past lives include agency, in-house, and contract roles across retail, finance, healthcare and media.

Currently focused on motion-rich marketing surfaces and reusable component libraries.`,
  },
}
