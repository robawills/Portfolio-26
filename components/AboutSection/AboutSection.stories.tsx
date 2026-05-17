import type {Meta, StoryObj} from '@storybook/nextjs'

import {AboutSection} from './index'

const meta: Meta<typeof AboutSection> = {
  title: 'Components/AboutSection',
  component: AboutSection,
  parameters: {layout: 'fullscreen'},
  args: {signpost: 'Bio'},
}

export default meta

type Story = StoryObj<typeof AboutSection>

export const Paragraphs: Story = {
  args: {
    signpost: 'Bio',
    children: (
      <>
        <p className="u-body">
          I work at the seam between design and engineering — design systems that
          ship, animation that feels right, and front-end built to last a year of
          changes without rotting.
        </p>
        <p className="u-body">
          Past lives include agency, in-house, and contract roles across retail,
          finance, healthcare and media.
        </p>
      </>
    ),
  },
}

export const PlainList: Story = {
  args: {
    signpost: 'Skills',
    children: (
      <ul className="u-body" style={{display: 'grid', gap: '0.5rem'}}>
        <li>TypeScript</li>
        <li>React</li>
        <li>Next.js</li>
      </ul>
    ),
  },
}

export const InlineList: Story = {
  args: {
    signpost: "People I've worked with",
    children: (
      <p className="u-body">
        Costa Coffee · Logitech · Zurich · Simmons &amp; Simmons · Yeo Valley
      </p>
    ),
  },
}
