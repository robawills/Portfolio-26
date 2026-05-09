import type {Meta, StoryObj} from '@storybook/nextjs'

import {Button, ButtonType} from './index'
import {IconName} from '@/components/Icon'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    label: 'View project',
    onClick: () => {},
  },
  argTypes: {
    type: {control: 'select', options: Object.values(ButtonType)},
    leadingIcon: {control: 'select', options: [undefined, ...Object.values(IconName)]},
    trailingIcon: {control: 'select', options: [undefined, ...Object.values(IconName)]},
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {args: {type: ButtonType.PRIMARY}}
export const Secondary: Story = {args: {type: ButtonType.SECONDARY}}
export const Tertiary: Story = {args: {type: ButtonType.TERTIARY}}
export const Outline: Story = {args: {type: ButtonType.OUTLINE}}
export const Text: Story = {args: {type: ButtonType.TEXT}}

export const Small: Story = {args: {type: ButtonType.PRIMARY, small: true}}
export const Large: Story = {args: {type: ButtonType.PRIMARY, large: true}}
export const Disabled: Story = {args: {type: ButtonType.PRIMARY, isDisabled: true}}
export const FullWidth: Story = {args: {type: ButtonType.PRIMARY, fullWidth: true}}

export const WithLeadingIcon: Story = {
  args: {type: ButtonType.PRIMARY, leadingIcon: IconName.ARROW_UP},
}
export const WithTrailingIcon: Story = {
  args: {type: ButtonType.PRIMARY, trailingIcon: IconName.ARROW_UP},
}

export const AsLink: Story = {
  args: {type: ButtonType.PRIMARY, href: '#', onClick: undefined},
}
