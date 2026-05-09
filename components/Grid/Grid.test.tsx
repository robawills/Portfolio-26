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

  it('renders as a div by default', () => {
    const {container} = render(<Grid>x</Grid>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('honours the polymorphic `as` prop', () => {
    const {container} = render(<Grid as="section">x</Grid>)
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })

  it('forwards className and style', () => {
    const {container} = render(
      <Grid className="custom" style={{background: 'red'}}>
        x
      </Grid>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom')
    expect(root.style.background).toBe('red')
  })
})
