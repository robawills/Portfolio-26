import type {Meta, StoryObj} from '@storybook/nextjs'

import {ProjectCard, type ProjectCardProps} from './index'

const SAMPLE_LANDSCAPE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
const SAMPLE_PORTRAIT =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&h=1600&q=80'

const baseArgs: ProjectCardProps = {
  href: '#',
  title: 'Mountain Atlas',
  description:
    'A long-form case study about cartography, hand-drawn topography, and the systems that emerge when you start mapping the land.',
  image: {src: SAMPLE_LANDSCAPE, alt: 'Mountain landscape'},
  tags: ['Cartography', 'Editorial', 'Maps', 'Print'],
  links: [
    {label: 'Visit site', href: 'https://example.com'},
    {label: 'Case study', href: 'https://example.com'},
  ],
}

const meta: Meta<typeof ProjectCard> = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  args: baseArgs,
  decorators: [
    (Story) => (
      <div style={{maxWidth: 1200, margin: '2rem auto'}}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof ProjectCard>

export const Default: Story = {}

export const WithMobileImage: Story = {
  args: {
    mobileImage: {src: SAMPLE_PORTRAIT, alt: 'Mountain landscape (portrait)'},
  },
}

export const NoTagsOrLinks: Story = {
  args: {
    tags: undefined,
    links: undefined,
  },
}

export const ManyTags: Story = {
  args: {
    tags: ['Cartography', 'Editorial', 'Maps', 'Print', 'Identity', 'Web', 'Motion', 'Sound'],
  },
}
