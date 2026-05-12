import type {Meta, StoryObj} from '@storybook/nextjs'

import {ProjectHero} from './index'

const meta: Meta<typeof ProjectHero> = {
  title: 'Components/ProjectHero',
  component: ProjectHero,
  parameters: {layout: 'fullscreen'},
}

export default meta

type Story = StoryObj<typeof ProjectHero>

export const Default: Story = {
  args: {
    title: 'Wella Company',
    description:
      'Design Engineer with 14+ years crafting component systems, motion and high-fidelity front-end across retail, finance, healthcare and media.',
    links: [
      {title: 'Sebastian Professional', url: 'https://sebastian.example'},
      {title: 'Wella Pro', url: 'https://wellapro.example'},
      {title: 'Nioxin', url: 'https://nioxin.example'},
      {title: 'Clairol', url: 'https://clairol.example'},
    ],
  },
}

export const NoLinks: Story = {
  args: {
    title: 'Minimal Project',
    description:
      'A short hero with only title and description — no links section rendered.',
  },
}
