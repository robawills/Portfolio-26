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
