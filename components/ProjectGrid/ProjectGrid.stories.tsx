import type {Meta, StoryObj} from '@storybook/nextjs'

import type {ProjectCardProps} from '@/components/ProjectCard'

import {ProjectGrid} from './index'

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80',
]

const stubProjects: ProjectCardProps[] = [
  {
    href: '#',
    title: 'Mountain Atlas',
    description: 'Cartography & topography editorial.',
    image: {src: SAMPLE_IMAGES[0], alt: 'Mountains'},
    tags: ['Maps', 'Editorial'],
    links: [{label: 'Visit', href: '#'}],
  },
  {
    href: '#',
    title: 'Forest Walk',
    description: 'A walking-pace narrative about woodland systems.',
    image: {src: SAMPLE_IMAGES[1], alt: 'Forest'},
    tags: ['Nature', 'Story'],
    links: [{label: 'Read', href: '#'}],
  },
  {
    href: '#',
    title: 'River Notes',
    description: 'Field recordings and watercolour studies along a single river.',
    image: {src: SAMPLE_IMAGES[2], alt: 'River'},
    tags: ['Field', 'Audio'],
    links: [{label: 'Listen', href: '#'}],
  },
]

const meta: Meta<typeof ProjectGrid> = {
  title: 'Components/ProjectGrid',
  component: ProjectGrid,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof ProjectGrid>

export const Default: Story = {
  args: {projects: stubProjects},
}

export const SingleProject: Story = {
  args: {projects: [stubProjects[0]]},
}
