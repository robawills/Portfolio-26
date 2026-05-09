import {render, screen} from '@testing-library/react'

import {CursorProvider} from '@/context/Cursor'

import {Cursor} from './index'

describe('Cursor', () => {
  it('renders the cursor element when wrapped in CursorProvider', () => {
    // CursorProvider already renders <Cursor /> internally; just rendering it
    // should give us the floating element.
    render(
      <CursorProvider>
        <span>child</span>
      </CursorProvider>,
    )
    const cursors = screen.getAllByTestId('cursor-element')
    expect(cursors.length).toBeGreaterThan(0)
  })

  it('renders standalone when explicitly mounted', () => {
    render(<Cursor />)
    expect(screen.getByTestId('cursor-element')).toBeInTheDocument()
  })

  it('does not have the is-entered class until something hovers', () => {
    render(<Cursor />)
    const el = screen.getByTestId('cursor-element')
    expect(el.className).not.toContain('is-entered')
  })
})
