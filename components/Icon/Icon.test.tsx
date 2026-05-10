import {render, screen} from '@testing-library/react'

import {Icon, IconName} from './index'

describe('Icon', () => {
  it('renders an svg-mock for the given name', () => {
    render(<Icon name={IconName.PLUS} />)
    expect(screen.getByTestId('icon-wrap')).toBeInTheDocument()
    expect(screen.getByTestId('svg-mock')).toBeInTheDocument()
  })

  it('forwards a custom aria-label', () => {
    render(<Icon name={IconName.PLUS} ariaLabel="Add item" />)
    expect(screen.getByTestId('svg-mock')).toHaveAttribute('aria-label', 'Add item')
  })

  it('falls back to a generated aria-label of `<name> icon`', () => {
    render(<Icon name={IconName.ARROW_OUT} />)
    expect(screen.getByTestId('svg-mock')).toHaveAttribute('aria-label', 'ArrowOut icon')
  })

  it('applies the inverse color class', () => {
    const {container} = render(<Icon name={IconName.PLUS} color="inverse" />)
    expect(container.querySelector('.inverse')).not.toBeNull()
  })

  it('forwards a custom className', () => {
    const {container} = render(<Icon name={IconName.PLUS} className="myClass" />)
    expect(container.querySelector('.myClass')).not.toBeNull()
  })
})
