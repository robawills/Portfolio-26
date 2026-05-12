import type {Meta, StoryObj} from '@storybook/nextjs'

import {MediaGroup, MediaGroupImage} from './index'

const meta: Meta<typeof MediaGroup> = {
  title: 'Components/MediaGroup',
  component: MediaGroup,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof MediaGroup>

const image = {
  src: 'https://picsum.photos/seed/folio-mg/1600/1000',
  metaTitle: 'Placeholder image',
}

export const TwoHalves: Story = {
  args: {
    children: (
      <>
        <MediaGroupImage {...image} size="half" />
        <MediaGroupImage {...image} size="half" />
      </>
    ),
  },
}

export const FullThenTwoHalves: Story = {
  args: {
    children: (
      <>
        <MediaGroupImage {...image} size="full" />
        <MediaGroupImage {...image} size="half" />
        <MediaGroupImage {...image} size="half" />
      </>
    ),
  },
}

export const OneMax: Story = {
  args: {
    children: <MediaGroupImage {...image} size="max" />,
  },
}
