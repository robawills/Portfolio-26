# Agent Guidelines

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
