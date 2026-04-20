import type { Meta, StoryObj } from '@storybook/nextjs';

import Hand3D from './index';

const meta = {
  title: 'Components/Hand3D',
  component: Hand3D,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Hand3D>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
