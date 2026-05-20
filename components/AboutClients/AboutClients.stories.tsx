import type {Meta, StoryObj} from '@storybook/nextjs'

import {AboutClients} from './index'

const meta: Meta<typeof AboutClients> = {
  title: 'Components/AboutClients',
  component: AboutClients,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof AboutClients>

export const Default: Story = {
  args: {
    clients: [
      'Costa Coffee',
      'Logitech',
      'Zurich',
      'Simmons & Simmons',
      'Yeo Valley',
      'NHS',
    ],
  },
}

export const Short: Story = {
  args: {
    clients: ['Costa Coffee', 'Logitech', 'Zurich'],
  },
}

export const CustomSignpost: Story = {
  args: {
    signpost: 'Clients',
    clients: ['Costa Coffee', 'Logitech', 'Zurich'],
  },
}
