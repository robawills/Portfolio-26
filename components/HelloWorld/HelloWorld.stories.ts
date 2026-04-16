import type { Meta, StoryObj } from '@storybook/nextjs';
import HelloWorld from './index';

const meta = {
  title: 'Components/HelloWorld',
  component: HelloWorld,
  tags: ['autodocs'],
} satisfies Meta<typeof HelloWorld>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomTitle: Story = {
  args: {
    title: 'Welcome to the Project',
  },
};
