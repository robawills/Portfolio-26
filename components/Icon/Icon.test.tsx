import {render, screen} from '@testing-library/react'

import {Icon, IconName} from './index'

describe('Icon', () => {
  it('renders an svg-mock for the given name', () => {
    render(<Icon name={IconName.PLUS} />)
    expect(screen.getByTestId('icon-wrap')).toBeInTheDocument()
    expect(screen.getByTestId('svg-mock')).toBeInTheDocument()
  })

  it('forwards a custom aria-label and exposes the svg as an image', () => {
    render(<Icon name={IconName.PLUS} ariaLabel="Add item" />)
    const svg = screen.getByTestId('svg-mock')
    expect(svg).toHaveAttribute('aria-label', 'Add item')
    expect(svg).toHaveAttribute('role', 'img')
    expect(svg).not.toHaveAttribute('aria-hidden')
  })

  it('is decorative by default (hidden from assistive tech, no label)', () => {
    render(<Icon name={IconName.ARROW_OUT} />)
    const svg = screen.getByTestId('svg-mock')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('aria-label')
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
