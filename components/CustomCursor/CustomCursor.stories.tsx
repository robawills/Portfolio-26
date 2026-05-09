import type {Meta, StoryObj} from '@storybook/nextjs'

import {IconName} from '@/components/Icon'

import {CustomCursor} from './index'

const meta: Meta<typeof CustomCursor> = {
  title: 'Components/CustomCursor',
  component: CustomCursor,
  argTypes: {
    icon: {control: 'select', options: Object.values(IconName)},
  },
}

export default meta

type Story = StoryObj<typeof CustomCursor>

export const Default: Story = {
  args: {icon: IconName.ARROW_UP},
  render: (args) => (
    <div style={{padding: 48}}>
      <CustomCursor {...args}>
        <div
          style={{
            width: 400,
            height: 240,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-fg-primary)',
            borderRadius: 16,
            cursor: 'none',
          }}
        >
          Hover me
        </div>
      </CustomCursor>
    </div>
  ),
}

export const NoIcon: Story = {
  args: {},
  render: Default.render,
}
