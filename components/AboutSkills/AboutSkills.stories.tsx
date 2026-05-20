import type {Meta, StoryObj} from '@storybook/nextjs'

import {AboutSkills} from './index'

const meta: Meta<typeof AboutSkills> = {
  title: 'Components/AboutSkills',
  component: AboutSkills,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof AboutSkills>

export const Default: Story = {
  args: {
    skills: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'GraphQL',
      'GSAP',
      'Three.js',
      'Sanity',
    ],
  },
}

export const Short: Story = {
  args: {
    skills: ['TypeScript', 'React', 'Next.js'],
  },
}
