import React from 'react';
import type { Preview } from '@storybook/nextjs';
import {
  INITIAL_VIEWPORTS,
  MINIMAL_VIEWPORTS,
} from 'storybook/viewport';
import '../styles/global.scss';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
    viewport: {
      options: {
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <main>
          <Story />
        </main>
      );
    },
  ],
};

export default preview;
