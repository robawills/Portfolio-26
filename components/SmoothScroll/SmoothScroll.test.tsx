import {render, screen} from '@testing-library/react'

import {SmoothScroll} from './index'

// Lenis spins up rAF + scroll listeners on real DOM — mock the React wrapper
// to a passthrough so we can verify children render without booting Lenis.
jest.mock('lenis/react', () => ({
  __esModule: true,
  ReactLenis: ({children}: {children: React.ReactNode}) => (
    <div data-testid="lenis-root">{children}</div>
  ),
}))

describe('SmoothScroll', () => {
  it('renders its children inside the Lenis root', () => {
    render(
      <SmoothScroll>
        <p>page content</p>
      </SmoothScroll>,
    )
    const root = screen.getByTestId('lenis-root')
    expect(root).toBeInTheDocument()
    expect(root).toContainElement(screen.getByText('page content'))
  })
})
