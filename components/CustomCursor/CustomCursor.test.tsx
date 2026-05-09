import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {IconName} from '@/components/Icon'
import {CursorProvider, useCursor} from '@/context/Cursor'

import {CustomCursor} from './index'

const Probe = () => {
  const {entered, icon} = useCursor()
  return (
    <span data-testid="probe">
      {entered ? 'entered' : 'idle'}-{icon ?? 'none'}
    </span>
  )
}

const setup = () =>
  render(
    <CursorProvider>
      <Probe />
      <CustomCursor icon={IconName.ARROW_UP}>
        <button type="button">target</button>
      </CustomCursor>
    </CursorProvider>,
  )

describe('CustomCursor', () => {
  it('renders its children', () => {
    setup()
    expect(screen.getByRole('button', {name: /target/i})).toBeInTheDocument()
  })

  it('sets entered + icon on mouse enter', async () => {
    const user = userEvent.setup()
    setup()
    await user.hover(screen.getByRole('button', {name: /target/i}))
    expect(screen.getByTestId('probe')).toHaveTextContent('entered-ArrowUp')
  })

  it('clears state on mouse leave', async () => {
    const user = userEvent.setup()
    setup()
    const target = screen.getByRole('button', {name: /target/i})
    await user.hover(target)
    await user.unhover(target)
    expect(screen.getByTestId('probe')).toHaveTextContent('idle-none')
  })
})
