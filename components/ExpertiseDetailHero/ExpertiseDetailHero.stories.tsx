import type {Meta, StoryObj} from '@storybook/nextjs'

import {ExpertiseDetailHero} from './index'

const SAMPLE_SRC =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80'

const meta: Meta<typeof ExpertiseDetailHero> = {
  title: 'Components/ExpertiseDetailHero',
  component: ExpertiseDetailHero,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof ExpertiseDetailHero>

export const Default: Story = {
  args: {
    signpost: 'Portfolio',
    title: 'Design Engineer building considered, expressive interfaces',
    intro:
      'Specialising in design systems, motion, and high-fidelity front-end work with an eye for craft and detail.',
    image: {src: SAMPLE_SRC, alt: 'Mountain landscape'},
  },
}

export const ShortCopy: Story = {
  args: {
    signpost: 'Studio',
    title: 'Hello.',
    intro: 'Front-end with feeling.',
    image: {src: SAMPLE_SRC, alt: 'Mountain landscape'},
  },
}
