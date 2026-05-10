import {render, screen} from '@testing-library/react'

import {Grid} from './index'

describe('Grid', () => {
  it('renders its children', () => {
    render(
      <Grid>
        <span>One</span>
        <span>Two</span>
      </Grid>,
    )
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('wraps the polymorphic element in a wrapper div', () => {
    const {container} = render(<Grid>x</Grid>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.nodeName).toBe('DIV')
    expect(wrapper.className).toContain('gridWrap')
  })

  it('renders as a div by default for the inner grid element', () => {
    const {container} = render(<Grid>x</Grid>)
    const inner = container.firstChild?.firstChild as HTMLElement
    expect(inner.nodeName).toBe('DIV')
    expect(inner.className).toContain('grid')
  })

  it('honours the polymorphic `as` prop on the inner element', () => {
    const {container} = render(<Grid as="section">x</Grid>)
    const inner = container.firstChild?.firstChild as HTMLElement
    expect(inner.nodeName).toBe('SECTION')
  })

  it('forwards className and style onto the inner grid element', () => {
    const {container} = render(
      <Grid className="custom" style={{background: 'red'}}>
        x
      </Grid>,
    )
    const inner = container.firstChild?.firstChild as HTMLElement
    expect(inner.className).toContain('custom')
    expect(inner.style.background).toBe('red')
  })
})
