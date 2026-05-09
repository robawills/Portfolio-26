import type {StorybookConfig} from '@storybook/nextjs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|tsx|mdx)'],
  addons: [],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (cfg) => {
    cfg.module = cfg.module ?? {}
    cfg.module.rules = cfg.module.rules ?? []

    // Mirror Next's SVGR-as-React-component handling so `import Plus from '...plus.svg'`
    // returns a component, not a URL.
    const fileLoaderRule = cfg.module.rules.find(
      (rule) => rule && typeof rule === 'object' && 'test' in rule && (rule.test as RegExp)?.test?.('.svg'),
    )
    if (fileLoaderRule && typeof fileLoaderRule === 'object') {
      ;(fileLoaderRule as {exclude?: RegExp}).exclude = /\.svg$/
    }
    cfg.module.rules.push({
      test: /\.svg$/,
      use: [{loader: '@svgr/webpack', options: {icon: true}}],
    })

    cfg.resolve = cfg.resolve ?? {}
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      '@': path.resolve(dirname, '..'),
    }

    return cfg
  },
}

export default config
