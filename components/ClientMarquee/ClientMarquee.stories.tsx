import type {Meta, StoryObj} from '@storybook/nextjs'

import {ClientMarquee} from './index'

const meta: Meta<typeof ClientMarquee> = {
  title: 'Components/ClientMarquee',
  component: ClientMarquee,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof ClientMarquee>

export const Default: Story = {
  args: {
    clients: [
      'Acme',
      'Globex',
      'Initech',
      'Soylent',
      'Umbrella',
      'Stark',
      'Wayne',
      'Wonka',
      'Cyberdyne',
      'Tyrell',
    ],
  },
}

export const ShortList: Story = {
  args: {
    clients: ['Acme', 'Globex'],
  },
}
