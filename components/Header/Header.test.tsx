import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {HandPoseProvider} from '@/context/HandPose'

import {Header} from './index'

jest.mock('gsap', () => ({
  __esModule: true,
  default: {set: jest.fn(), to: jest.fn()},
  set: jest.fn(),
  to: jest.fn(),
}))

const setup = () =>
  render(
    <HandPoseProvider>
      <Header />
    </HandPoseProvider>,
  )

describe('Header', () => {
  it('renders the desktop nav links', () => {
    setup()
    expect(screen.getByRole('link', {name: /work/i})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: /about/i})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: /contact/i})).toBeInTheDocument()
  })

  it('renders the mobile menu toggle in its closed state', () => {
    setup()
    const toggle = screen.getByRole('button', {name: /open menu/i})
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles the drawer open when clicked', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole('button', {name: /open menu/i}))
    expect(screen.getByRole('button', {name: /close menu/i})).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
