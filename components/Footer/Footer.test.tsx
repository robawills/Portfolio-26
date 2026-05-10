import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {Footer} from './index'

const mockScrollTo = jest.fn()

jest.mock('lenis/react', () => ({
  __esModule: true,
  useLenis: () => ({scrollTo: mockScrollTo}),
}))

describe('Footer', () => {
  beforeEach(() => {
    mockScrollTo.mockClear()
  })

  it('shows the current year next to the copyright mark', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(
      screen.getByText(new RegExp(`©\\s*${year}\\s*Rob Wills`)),
    ).toBeInTheDocument()
  })

  it('links out to the LinkedIn profile in a new tab', () => {
    render(<Footer />)
    const link = screen.getByRole('link', {name: 'LinkedIn'})
    expect(link).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/rob-wills-000839169/',
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('scrolls to top via Lenis when the back-to-top button is clicked', async () => {
    const user = userEvent.setup()
    render(<Footer />)
    await user.click(screen.getByRole('button', {name: /back to top/i}))
    expect(mockScrollTo).toHaveBeenCalledWith(0)
  })
})
