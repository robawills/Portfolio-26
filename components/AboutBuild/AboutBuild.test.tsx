import {render, screen} from '@testing-library/react'

import {AboutBuild} from './index'

describe('AboutBuild', () => {
  it('renders the default signpost label', () => {
    render(<AboutBuild />)
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders a custom signpost when provided', () => {
    render(<AboutBuild signpost="Stack" />)
    expect(screen.getByText('Stack')).toBeInTheDocument()
  })

  it('renders the default tech-stack description', () => {
    render(<AboutBuild />)
    expect(screen.getByText(/Next\.js 16/)).toBeInTheDocument()
    expect(screen.getByText(/React Compiler/)).toBeInTheDocument()
  })

  it('renders custom description copy', () => {
    render(<AboutBuild description="Hand-crafted, reproducible, small." />)
    expect(
      screen.getByText('Hand-crafted, reproducible, small.'),
    ).toBeInTheDocument()
  })
})
