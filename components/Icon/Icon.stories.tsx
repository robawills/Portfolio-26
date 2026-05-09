import type {Meta, StoryObj} from '@storybook/nextjs'

import {Icon, IconName} from './index'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    name: IconName.PLUS,
    color: 'default',
  },
  argTypes: {
    name: {control: 'select', options: Object.values(IconName)},
    color: {control: 'inline-radio', options: ['default', 'inverse']},
  },
}

export default meta

type Story = StoryObj<typeof Icon>

export const Plus: Story = {args: {name: IconName.PLUS}}
export const ArrowUp: Story = {args: {name: IconName.ARROW_UP}}

export const AllIcons: Story = {
  render: () => (
    <div style={{display: 'flex', gap: 24, alignItems: 'center', fontSize: 32}}>
      {Object.values(IconName).map((name) => (
        <div
          key={name}
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}
        >
          <Icon name={name} />
          <span style={{fontSize: 12}}>{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const Inverse: Story = {
  args: {color: 'inverse'},
  parameters: {backgrounds: {default: 'light'}},
}
