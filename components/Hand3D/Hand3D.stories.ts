import type { Meta, StoryObj } from '@storybook/nextjs';

import BustViewer from './index';

const meta = {
  title: 'Components/BustViewer',
  component: BustViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BustViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
