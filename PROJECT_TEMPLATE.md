# Project Template — CLAUDE.md

> **Usage:** Copy this file into a new empty project directory as `CLAUDE.md`, then ask Claude Code to "bootstrap this project using CLAUDE.md". After setup is complete, delete Part 1 and keep Part 2 as ongoing agent guidelines.

---

# Part 1 — Project Bootstrap

> Delete this entire section once the project is set up and verified.

## 1.1 Prerequisites

- **Node.js**: 24.13.0
- **Task runner**: [just](https://github.com/casey/just) (`brew install just` on macOS)
- **Package manager**: npm

## 1.2 Initialise

```sh
npm init -y
```

Set the `name`, `version`, and `private` fields in `package.json`, then add the `engines` field:

```json
{
  "private": true,
  "engines": {
    "node": "24.13.0"
  }
}
```

## 1.3 Install Dependencies

### Production

```sh
npm install classnames motion next react react-dom sass sanitize.css @svgr/webpack @emotion/is-prop-valid
```

### Development

```sh
npm install -D typescript @types/node @types/react @types/react-dom \
  eslint eslint-config-next eslint-plugin-storybook \
  prettier stylelint stylelint-config-standard stylelint-config-standard-scss stylelint-order postcss-scss \
  jest jest-environment-jsdom @types/jest @testing-library/jest-dom @testing-library/react identity-obj-proxy \
  storybook @storybook/nextjs @storybook/addon-a11y @storybook/addon-docs @storybook/addon-links @storybook/addon-onboarding @storybook/testing-library
```

## 1.4 NPM Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "typecheck": "tsc",
    "lint": "npm run eslint && npm run format && npm run style",
    "lint:fix": "npm run eslint:fix && npm run format:fix && npm run style:fix",
    "format": "prettier --check '**/*.{css,scss,js,ts,html,json,md,yml,yaml}'",
    "format:fix": "prettier --write '**/*.{css,scss,js,ts,html,json,md,yml,yaml}'",
    "style": "stylelint '**/*.{css,scss}'",
    "style:fix": "stylelint --fix '**/*.{css,scss}'",
    "eslint": "eslint .",
    "eslint:fix": "eslint --fix .",
    "check-file-sizes": "sh scripts/check-file-sizes.sh",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build -o ./public/storybook"
  }
}
```

## 1.5 Directory Structure

Create these directories:

```
components/
hooks/
interfaces/
lib/
utils/
data/
constants/
context/
styles/
  tokens/
  mixins/
  base/
  semantics/
  utils/
pages/
public/
  images/
scripts/
templates/
__mocks__/
.storybook/
```

## 1.6 Config Files

### `.nvmrc`

```
24.13.0
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "types": ["@testing-library/jest-dom"],
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `eslint.config.mjs`

```js
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import storybook from 'eslint-plugin-storybook';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...storybook.configs['flat/recommended'],
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/storybook/**',
  ]),
]);

export default eslintConfig;
```

### `.prettierrc`

```json
{
  "trailingComma": "es5",
  "singleQuote": true
}
```

### `.stylelintrc.json`

```json
{
  "extends": ["stylelint-config-standard-scss"],
  "plugins": ["stylelint-order"],
  "customSyntax": "postcss-scss",
  "rules": {
    "order/order": ["custom-properties", "declarations"],
    "order/properties-alphabetical-order": null,
    "import-notation": "string",
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ],
    "scss/operator-no-newline-after": null,
    "no-descending-specificity": null,
    "property-no-vendor-prefix": null
  }
}
```

### `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[Makefile]
indent_style = tab
```

### `next.config.ts`

```ts
import { type NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules')],
    quietDeps: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
          {
            key: 'Referer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
```

### `jest.config.js`

```js
module.exports = {
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.svg': '<rootDir>/__mocks__/svgrMock.js',
    '\\.png': '<rootDir>/__mocks__/pngMock.js',
    '\\.jpg': '<rootDir>/__mocks__/jpgMock.js',
    'next/image': '<rootDir>/__mocks__/NextImage.js',
    '^framer-motion$': '<rootDir>/__mocks__/framer-motion.js',
    '^motion/react$': '<rootDir>/__mocks__/framer-motion.js',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/constants/(.*)$': '<rootDir>/constants/$1',
    '^@/context/(.*)$': '<rootDir>/context/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/interfaces/(.*)$': '<rootDir>/interfaces/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@/data/(.*)$': '<rootDir>/data/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          [
            'next/babel',
            {
              'preset-react': {
                runtime: 'automatic',
              },
            },
          ],
        ],
      },
    ],
  },
  roots: [
    'components',
    'pages',
    'constants',
    'context',
    'hooks',
    'utils',
    'lib',
    'interfaces',
  ],
  moduleDirectories: ['node_modules', __dirname],
  testEnvironment: 'jsdom',
  clearMocks: true,
};
```

### `jest.setup.js`

```js
import '@testing-library/jest-dom';

// Mock window.matchMedia for components using media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for components using scroll animations
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
```

### `justfile`

```just
# Default recipe: list all available commands
default:
  @just --list

# ==============================================================================
# Development
# ==============================================================================

# Start development server with webpack
dev:
  npm run dev

# Start production server
start:
  npm start

# ==============================================================================
# Building
# ==============================================================================

# Build for production
build:
  npm run build

# ==============================================================================
# Type Checking
# ==============================================================================

# Run TypeScript compiler check
typecheck:
  npm run typecheck

# ==============================================================================
# Linting & Formatting
# ==============================================================================

# Run all linters (ESLint, Prettier, Stylelint)
lint:
  npm run lint

# Auto-fix all linting issues
lint-fix:
  npm run lint:fix

# Run ESLint only
eslint:
  npm run eslint

# Auto-fix ESLint issues
eslint-fix:
  npm run eslint:fix

# Check Prettier formatting
format:
  npm run format

# Fix Prettier formatting
format-fix:
  npm run format:fix

# Run Stylelint
style:
  npm run style

# Fix Stylelint issues
style-fix:
  npm run style:fix

# ==============================================================================
# Testing
# ==============================================================================

# Run full test suite
test:
  npm test

# Run tests in watch mode
test-watch:
  npm run test:watch

# Run tests with coverage report
test-coverage:
  npm run test:coverage

# Run specific test file (usage: just test-file path/to/test.test.tsx)
test-file FILE:
  npx jest {{FILE}}

# Run tests matching pattern (usage: just test-pattern "test name pattern")
test-pattern PATTERN:
  npx jest --testNamePattern="{{PATTERN}}"

# Run tests matching component name (usage: just test-component ComponentName)
test-component NAME:
  npx jest {{NAME}}

# ==============================================================================
# Other Quality Checks
# ==============================================================================

# Check no files exceed the maximum size
check-file-sizes:
  npm run check-file-sizes

# ==============================================================================
# Storybook
# ==============================================================================

# Start Storybook dev server on port 6006
storybook:
  npm run storybook

# Build static Storybook to public/storybook
build-storybook:
  npm run build-storybook

# ==============================================================================
# Combined Workflows
# ==============================================================================

# Run full quality check (typecheck, lint, test, file sizes)
check:
  @echo "Running TypeScript check..."
  @just typecheck
  @echo "\nRunning linters..."
  @just lint
  @echo "\nRunning tests..."
  @just test
  @echo "\nChecking file sizes..."
  @just check-file-sizes
  @echo "\n✅ All quality checks passed!"

# Fix all auto-fixable issues and run quality check
fix:
  @echo "Fixing linting issues..."
  @just lint-fix
  @echo "\nRunning quality check..."
  @just check
```

## 1.7 Mock Files

### `__mocks__/svgrMock.js`

```js
import * as React from 'react';

// eslint-disable-next-line react/display-name
const SvgrMock = React.forwardRef((props, ref) => (
  <svg ref={ref} {...props} snapshotnote="SVG" />
));

export const ReactComponent = SvgrMock;
export default SvgrMock;
```

### `__mocks__/pngMock.js`

```js
module.exports = 'test-png-stub';
```

### `__mocks__/jpgMock.js`

```js
module.exports = 'test-jpg-stub';
```

### `__mocks__/NextImage.js`

```js
const NextImage = jest
  .fn()
  .mockImplementation(({ alt, objectPosition, layout }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      data-objectposition={objectPosition}
      data-layout={layout}
      snapshotnote="NextImage"
    />
  ));

export default NextImage;
```

### `__mocks__/framer-motion.js`

```js
const React = require('react');

const filterMotionProps = (props) => {
  const {
    initial,
    animate,
    exit,
    variants,
    transition,
    whileHover,
    whileTap,
    whileFocus,
    whileDrag,
    whileInView,
    viewport,
    onViewportEnter,
    onViewportLeave,
    ...domProps
  } = props;
  return domProps;
};

const MotionDiv = React.forwardRef((props, ref) => (
  <div ref={ref} {...filterMotionProps(props)} />
));
MotionDiv.displayName = 'motion.div';

const MotionButton = React.forwardRef((props, ref) => (
  <button ref={ref} {...filterMotionProps(props)} />
));
MotionButton.displayName = 'motion.button';

module.exports = {
  motion: {
    div: MotionDiv,
    button: MotionButton,
  },
  useScroll: () => ({
    scrollYProgress: {
      on: jest.fn(),
      set: jest.fn(),
      get: () => 0,
    },
  }),
  useTransform: (input, _inputRange, _outputRange) => input,
  useMotionValueEvent: jest.fn(),
};
```

## 1.8 Storybook Config

### `.storybook/main.ts`

```ts
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs';
import path, { dirname } from 'path';
import type { Configuration } from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../components/**/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: [
    { from: path.resolve(__dirname, '../public/images'), to: '/images' },
  ],
  webpackFinal: async (config): Promise<Configuration> => {
    const imageRule = config.module?.rules?.find((rule) => {
      const test = (rule as { test: RegExp }).test;
      if (!test) return false;
      return test.test('.svg');
    }) as { [key: string]: any };

    imageRule.exclude = /\.svg$/;

    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': path.resolve(__dirname, '../'),
        },
      },
    };
  },
};

export default config;
```

### `.storybook/preview.tsx`

```tsx
import React from 'react';
import type { Preview } from '@storybook/nextjs';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport';
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
```

## 1.9 SCSS Foundation

### `styles/global.scss`

```scss
@use '@/styles' as *;
```

### `styles/_index.scss`

```scss
@forward './base';
@forward './semantics';
@forward './tokens';
@forward './utils';
@forward './mixins';
```

### `styles/tokens/_index.scss`

```scss
:root {
  /* Brand Colors — replace these with your project's palette */
  --color-brand: #3b82f6;

  /* Neutral Colors */
  --color-neutral-100: #fff;
  --color-neutral-200: #f5f5f3;
  --color-neutral-300: #e7e8e6;
  --color-neutral-400: #bec1bc;
  --color-neutral-500: #8e908d;
  --color-neutral-600: #585857;
  --color-neutral-700: #282828;
  --color-neutral-800: #1e1e1e;
  --color-neutral-900: #141414;
  --color-neutral-1000: #0e0e0e;

  /* Alpha Neutral Colors */
  --alpha-dark-1: rgb(20 20 20 / var(--alpha-1));
  --alpha-dark-2: rgb(20 20 20 / var(--alpha-3));
  --alpha-dark-3: rgb(20 20 20 / var(--alpha-5));
  --alpha-dark-4: rgb(20 20 20 / var(--alpha-8));
  --alpha-light-1: rgb(255 255 255 / var(--alpha-2));
  --alpha-light-2: rgb(255 255 255 / var(--alpha-4));
  --alpha-light-3: rgb(255 255 255 / var(--alpha-6));
  --alpha-light-4: rgb(255 255 255 / var(--alpha-7));

  /* Global Opacity */
  --alpha-0: 0;
  --alpha-1: 0.05;
  --alpha-2: 0.08;
  --alpha-3: 0.1;
  --alpha-4: 0.14;
  --alpha-5: 0.2;
  --alpha-6: 0.3;
  --alpha-7: 0.6;
  --alpha-8: 0.7;

  /* Functional Colors */
  --color-positive-100: #a6ffd6;
  --color-positive-400: #67ffb6;
  --color-positive-700: #04763d;
  --color-positive-1000: #002f1c;
  --color-warning-100: #fdeb80;
  --color-warning-400: #ffea6c;
  --color-warning-700: #a75000;
  --color-warning-1000: #392500;
  --color-negative-100: #ffcdcd;
  --color-negative-400: #ff7171;
  --color-negative-700: #c00b0b;
  --color-negative-1000: #450404;

  /* Global Spacing */
  --space-0: 0rem;
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 1.75rem;
  --space-8: 2rem;
  --space-9: 2.5rem;
  --space-10: 4rem;
  --space-11: 5.5rem;
  --space-12: 7.5rem;
  --space-13: 9.25rem;
  --space-14: 12.5rem;
  --space-15: 17rem;
  --space-16: 26.125rem;

  /* Global Radius */
  --radius-0: 0rem;
  --radius-1: 0.5rem;
  --radius-2: 0.75rem;
  --radius-3: 1.5rem;
  --radius-4: 62.5rem;
  --radius-full: 9999rem;

  /* Global Animation */
  --animation-speed-slow: 0.6s;
  --animation-speed-medium: 0.4s;
  --animation-speed-fast: 0.2s;
  --animation-easing-1: cubic-bezier(0.22, 1, 0.36, 1);
  --animation-easing-2: cubic-bezier(0.11, 0, 0.5, 0);
  --animation-easing-3: cubic-bezier(0.62, 0, 0.37, 1);
  --animation-easing-4: cubic-bezier(0.45, 1.45, 0.8, 1);
  --animation-easing-5: cubic-bezier(0.16, 1, 0.3, 1);
  --animation-easing-6: cubic-bezier(0.19, 1, 0.22, 1);

  /* Z-indexes */
  --zindex-layer-0: 0;
  --zindex-layer-1: 10;
  --zindex-layer-2: 20;
  --zindex-layer-3: 30;
  --zindex-layer-4: 40;
  --zindex-layer-5: 50;
  --zindex-layer-6: 60;
  --zindex-layer-7: 70;
  --zindex-layer-8: 80;
  --zindex-top: 9999;
}
```

### `styles/mixins/_index.scss`

```scss
@forward 'a11y';
@forward 'breakpoints';
```

### `styles/mixins/_breakpoints.scss`

```scss
$bp-xxsmall: 375px;
$bp-xsmall: 640px;
$bp-small: 768px;
$bp-medium: 1024px;
$bp-large: 1280px;
$bp-xlarge: 1366px;
$bp-xxlarge: 1660px;
$bp-xxxlarge: 1800px;
$bp-oversize: 1920px;
$breakpoints: (
  xxs: $bp-xxsmall,
  xs: $bp-xsmall,
  s: $bp-small,
  m: $bp-medium,
  l: $bp-large,
  xl: $bp-xlarge,
  xxl: $bp-xxlarge,
  xxxl: $bp-xxxlarge,
  oversize: $bp-oversize,
);

@mixin breakpoint($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media only screen and (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "No value could be retrieved from `#{$breakpoint}`. "
      + "Available breakpoints are: #{map-keys($breakpoints)}.";
  }
}
```

### `styles/mixins/_a11y.scss`

```scss
@mixin a11y-focus-box-shadow($inverse: false, $inset: false) {
  @if $inset {
    @if $inverse {
      box-shadow:
        var(--color-bg-primary-inverse) 0 0 0 2px inset,
        var(--color-fg-primary-inverse) 0 0 0 4px inset;
    } @else {
      box-shadow:
        var(--color-fg-primary-inverse) 0 0 0 2px inset,
        var(--color-bg-primary-inverse) 0 0 0 4px inset;
    }
  } @else {
    @if $inverse {
      box-shadow:
        var(--color-fg-primary) 0 0 0 2px,
        var(--color-bg-primary) 0 0 0 4px;
    } @else {
      box-shadow:
        var(--color-bg-primary) 0 0 0 2px,
        var(--color-fg-primary) 0 0 0 4px;
    }
  }
}
```

### `styles/base/_index.scss`

```scss
@forward 'document';
@forward 'layout';
```

### `styles/base/_document.scss`

```scss
*,
*::before,
*::after {
  position: relative;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizelegibility;
  margin: 0;
  padding: 0;
}

html,
body {
  max-width: 100vw;
  overscroll-behavior: none;
}

html {
  scroll-behavior: smooth;
}

body {
  color: var(--color-fg-primary);
  background-color: var(--color-bg-primary);
}

ul,
ol {
  list-style: none;
}

textarea {
  font-family: unset;
}
```

### `styles/base/_layout.scss`

```scss
:root {
  --layout-content-min: 375px;
  --layout-content-max: 1920px;
  --viewport-height: 100dvh;
  --layout-container-gutter: clamp(
    var(--space-4),
    -0.578rem + 6.731vw,
    var(--space-12)
  );
  --layout-grid-gutter: clamp(
    var(--space-6),
    1.257rem + 1.036vw,
    var(--space-9)
  );
}
```

### `styles/semantics/_index.scss`

```scss
@forward 'color';
```

### `styles/semantics/_color.scss`

```scss
:root {
  // Background
  --color-bg-primary: var(--color-neutral-200);
  --color-bg-secondary: var(--color-neutral-100);
  --color-bg-tertiary: var(--color-neutral-300);
  --color-bg-brand: var(--color-brand);
  --color-bg-primary-inverse: var(--color-neutral-900);
  --color-bg-secondary-inverse: var(--color-neutral-800);
  --color-bg-tertiary-inverse: var(--color-neutral-700);
  --color-bg-interactive: var(--alpha-dark-1);
  --color-bg-interactive-inverse: var(--color-neutral-700);
  --color-bg-interactive-hover: var(--color-neutral-700);
  --color-bg-interactive-inverse-hover: var(--color-neutral-100);

  // Foreground
  --color-fg-primary: var(--color-neutral-900);
  --color-fg-secondary: var(--alpha-dark-4);
  --color-fg-primary-inverse: var(--color-neutral-100);
  --color-fg-secondary-inverse: var(--alpha-light-4);
  --color-fg-onInteractive: var(--color-neutral-900);
  --color-fg-onInteractive-inverse: var(--color-neutral-100);
  --color-fg-onInteractive-hover: var(--color-neutral-100);
  --color-fg-onInteractive-inverse-hover: var(--color-neutral-900);
  --color-fg-interactive: var(--color-neutral-900);
  --color-fg-interactive-hover: var(--alpha-dark-4);
  --color-fg-interactive-inverse: var(--color-neutral-100);
  --color-fg-interactive-inverse-hover: var(--alpha-light-4);
  --color-fg-onBrand: var(--color-neutral-900);
  --color-fg-negative: var(--color-negative-700);
  --color-fg-positive: var(--color-positive-700);

  // Border
  --color-border-primary: var(--alpha-dark-2);
  --color-border-primary-inverse: var(--alpha-light-1);
  --color-border-interactive: var(--alpha-dark-2);
  --color-border-interactive-inverse: var(--alpha-light-1);
  --color-border-interactive-hover: var(--color-neutral-700);
  --color-border-interactive-inverse-hover: var(--color-neutral-100);
}
```

### `styles/utils/_index.scss`

```scss
/* Utility styles — add as needed */
```

### `scripts/check-file-sizes.sh`

```sh
#!/usr/bin/env sh
set -e

MAX_SIZE=6M

IGNORE_PATHS="
node_modules
.git
.next
out
public/storybook
coverage
build
"

EXCLUSIONS="
"

find_excludes=""
for dir in $IGNORE_PATHS; do
  [ -z "$dir" ] && continue
  find_excludes="$find_excludes ! -path ./$dir/*"
done
for file in $EXCLUSIONS; do
  [ -z "$file" ] && continue
  find_excludes="$find_excludes ! -path ./$file"
done

set -f
FILES=$(find . -type f -size +"$MAX_SIZE" $find_excludes -print)
set +f
if [ -n "$FILES" ]; then
  echo "Files over ${MAX_SIZE}:"
  echo "$FILES"
  exit 1
fi
```

## 1.10 Starter Pages

### `pages/_app.tsx`

```tsx
import type { AppProps } from 'next/app';
import '@/styles/global.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Component {...pageProps} />
    </main>
  );
}
```

### `pages/_document.tsx`

```tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### `pages/index.tsx`

```tsx
import HelloWorld from '@/components/HelloWorld';

const HomePage = () => {
  return <HelloWorld />;
};

export default HomePage;
```

## 1.11 Starter Component — HelloWorld

This component demonstrates all required patterns. Delete it once you've verified the setup works.

### `components/HelloWorld/index.tsx`

```tsx
import classNames from 'classnames/bind';
import styles from './HelloWorld.module.scss';

const cx = classNames.bind(styles);

interface HelloWorldProps {
  title?: string;
}

const HelloWorld = ({ title = 'Hello, World!' }: HelloWorldProps) => {
  return (
    <section className={cx('wrapper')}>
      <h1 className={cx('title')}>{title}</h1>
      <p className={cx('description')}>
        This project is set up and ready to build.
      </p>
    </section>
  );
};

export default HelloWorld;
```

### `components/HelloWorld/HelloWorld.module.scss`

```scss
@use '@/styles/mixins' as *;

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-6);
  background-color: var(--color-bg-primary);
  color: var(--color-fg-primary);
}

.title {
  margin-bottom: var(--space-4);

  @include breakpoint(m) {
    margin-bottom: var(--space-6);
  }
}

.description {
  color: var(--color-fg-secondary);
}
```

### `components/HelloWorld/HelloWorld.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import HelloWorld from './index';

describe('HelloWorld', () => {
  it('renders with default title', () => {
    render(<HelloWorld />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Hello, World!'
    );
  });

  it('renders with custom title', () => {
    render(<HelloWorld title="Custom Title" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Custom Title'
    );
  });

  it('renders description text', () => {
    render(<HelloWorld />);
    expect(
      screen.getByText('This project is set up and ready to build.')
    ).toBeInTheDocument();
  });
});
```

### `components/HelloWorld/HelloWorld.stories.ts`

```ts
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
```

## 1.12 Verification Checklist

Run these after setup to confirm everything works:

1. `just typecheck` — should pass with no errors
2. `just lint` — should pass (run `just lint-fix` first if needed)
3. `just test` — HelloWorld tests should pass (3 tests)
4. `just dev` — should start on localhost:3000, showing "Hello, World!"
5. `just storybook` — should start on localhost:6006, showing HelloWorld stories
6. `just check` — full quality gate should pass

---

# Part 2 — Agent Guidelines

> Keep this section permanently. It serves as the project's CLAUDE.md.

## Project Overview

This is a **Next.js** project using the **Pages Router**, **TypeScript** (strict mode), **SCSS Modules**, and **CSS custom properties** for theming.

**Task runner:** [just](https://github.com/casey/just) — run `just` to see all commands.

Key commands: `just dev`, `just build`, `just test`, `just typecheck`, `just lint-fix`, `just check`

## Code Style

### Imports

Organise in this order, separated by blank lines:

1. External dependencies (React first)
2. Internal imports using `@/` alias
3. Style imports last

Use `import type` for TypeScript-only imports.

### Formatting

- **Prettier**: single quotes, trailing commas (es5), 2-space indentation
- **Stylelint**: standard-scss with property ordering (custom-properties before declarations)
- **ESLint**: next/core-web-vitals + storybook plugin

### TypeScript

- Strict mode — no `any` without justification
- Prefer `interface` over `type` for object shapes
- Use `import type` where possible
- Explicit function return types

### React Components

- Arrow function syntax
- Props destructured with typed interface
- Use `cx()` from `classnames/bind` for class binding
- Export as default

### SCSS

- Use `@use` for imports (never `@import`)
- Always use CSS custom properties — never hardcode colours or spacing values
- Mobile-first responsive design with `@include breakpoint(m)` mixin
- Respect `prefers-reduced-motion` for animations

### Naming Conventions

| What             | Convention         | Example              |
| ---------------- | ------------------ | -------------------- |
| Components/files | PascalCase         | `Button.tsx`         |
| Utilities        | camelCase          | `formatDate.ts`      |
| Hooks            | `use` prefix       | `useBreakpoint.ts`   |
| CSS classes      | camelCase          | `.heroWrapper`       |
| CSS variables    | kebab-case         | `--color-fg-primary` |
| Tests            | `.test.tsx` suffix | `Button.test.tsx`    |

## Component Rules

### Required Files

Every component directory **must** contain all four files:

```
ComponentName/
├── index.tsx                    # Component export
├── ComponentName.module.scss    # Scoped styles
├── ComponentName.test.tsx       # Tests
└── ComponentName.stories.ts     # Storybook stories
```

### Testing

- Use React Testing Library (`render`, `screen`, `fireEvent`/`userEvent`)
- Mock `IntersectionObserver` is already configured in `jest.setup.js`
- Test rendering with expected roles and text content
- Mock child components when testing in isolation

### Storybook

- Use `satisfies Meta<typeof Component>` for type safety
- Add `tags: ['autodocs']` for auto-documentation
- Include meaningful story variants

## Architecture

### Pages Router

This project uses the **Pages Router** (not App Router). Do not use:

- `'use client'` or `'use server'` directives
- `app/` directory conventions
- Server Components or Server Actions

Use `getStaticProps` / `getStaticPaths` for data fetching.

### Navigation

- Internal links: always use Next.js `<Link>` component
- External links: use `<a href>` with appropriate attributes

### Data

- Content belongs in `data/` as JSON, not hardcoded in components
- Components render data — they don't define it

### Assets

- Images go in `public/images/` with appropriate subdirectories
- SVGs use `@svgr/webpack` — import as React components
- Never inline SVGs directly in component JSX

### Theming

- All colours use semantic CSS custom properties (`--color-fg-primary`, `--color-bg-secondary`, etc.)
- Never hardcode hex values in components or SCSS modules
- Theme definitions live in `styles/semantics/`

### Reuse

- Always check `components/` before creating new components
- Extract shareable patterns into `templates/`
- Share data by importing from a single source in `data/`

## Quality Gates

Run `just check` before committing. It runs:

1. TypeScript type checking
2. ESLint + Prettier + Stylelint
3. Full test suite
4. File size limits (6MB max)

All four must pass.
