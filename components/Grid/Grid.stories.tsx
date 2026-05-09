import type {Meta, StoryObj} from '@storybook/nextjs'

import {Grid} from './index'

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
}

export default meta

type Story = StoryObj<typeof Grid>

const Cell = ({label, span = 1}: {label: string; span?: number}) => (
  <div
    style={{
      gridColumn: `span ${span}`,
      padding: '1rem',
      background: 'var(--color-bg-secondary)',
      color: 'var(--color-fg-primary)',
      borderRadius: '0.5rem',
      textAlign: 'center',
    }}
  >
    {label}
  </div>
)

export const Default: Story = {
  render: () => (
    <Grid>
      {Array.from({length: 12}).map((_, i) => (
        <Cell key={i} label={`${i + 1}`} />
      ))}
    </Grid>
  ),
}

export const SpanningCells: Story = {
  render: () => (
    <Grid>
      <Cell label="span 4" span={4} />
      <Cell label="span 4" span={4} />
      <Cell label="span 4" span={4} />
      <Cell label="span 6" span={6} />
      <Cell label="span 6" span={6} />
      <Cell label="span 12" span={12} />
    </Grid>
  ),
}

export const AsSection: Story = {
  render: () => (
    <Grid as="section">
      <Cell label="<section> rendered" span={12} />
    </Grid>
  ),
}
