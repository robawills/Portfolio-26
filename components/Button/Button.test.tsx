import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {IconName} from '@/components/Icon'

import {Button, ButtonType} from './index'

describe('Button', () => {
  it('renders a label inside a <button> by default', () => {
    render(<Button label="Submit" onClick={() => {}} />)
    const btn = screen.getByRole('button', {name: /submit/i})
    expect(btn.tagName).toBe('BUTTON')
  })

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<Button label="Click me" onClick={onClick} />)
    await user.click(screen.getByRole('button', {name: /click me/i}))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a link when href is provided', () => {
    render(<Button label="Go" href="/foo" />)
    const link = screen.getByRole('link', {name: /go/i})
    expect(link).toHaveAttribute('href', '/foo')
  })

  it('opens link in a new tab and merges rel attributes when newWindow', () => {
    render(<Button label="External" href="https://example.com" newWindow />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toEqual(expect.stringContaining('noopener'))
    expect(link.getAttribute('rel')).toEqual(expect.stringContaining('noreferrer'))
  })

  it('applies the chosen variant class', () => {
    const {container} = render(
      <Button label="X" type={ButtonType.SECONDARY} onClick={() => {}} />,
    )
    expect(container.querySelector('.secondary')).not.toBeNull()
  })

  it('renders leading and trailing icons', () => {
    render(
      <Button
        label="Both"
        leadingIcon={IconName.PLUS}
        trailingIcon={IconName.ARROW_UP}
        onClick={() => {}}
      />,
    )
    expect(screen.getAllByTestId('svg-mock')).toHaveLength(2)
  })

  it('disables button via aria-disabled when isDisabled and href provided', () => {
    render(<Button label="Disabled" href="/x" isDisabled />)
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true')
  })
})
