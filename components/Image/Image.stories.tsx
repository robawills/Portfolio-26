import type {Meta, StoryObj} from '@storybook/nextjs'

import {Image} from './index'

const SAMPLE_SRC =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'

const meta: Meta<typeof Image> = {
  title: 'Components/Image',
  component: Image,
  decorators: [
    (Story) => (
      <div style={{position: 'relative', width: 600, aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden'}}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Image>

export const Default: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: 'Mountain landscape at sunset',
    fill: true,
    sizes: '600px',
  },
}

export const FocalPointTop: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: 'Mountain landscape, top focal point',
    fill: true,
    sizes: '600px',
    focalPoint: 'top',
  },
}

export const FocalPointBottom: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: 'Mountain landscape, bottom focal point',
    fill: true,
    sizes: '600px',
    focalPoint: 'bottom',
  },
}
