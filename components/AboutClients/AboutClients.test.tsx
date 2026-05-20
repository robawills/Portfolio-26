import {render, screen} from '@testing-library/react'

import {AboutClients} from './index'

describe('AboutClients', () => {
  it('renders under the default "Brands I\'ve worked with" signpost', () => {
    render(<AboutClients clients={['Costa Coffee']} />)
    expect(screen.getByText("Brands I've worked with")).toBeInTheDocument()
  })

  it('renders one <li> per client', () => {
    render(<AboutClients clients={['Costa Coffee', 'Logitech', 'Zurich']} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items.map((item) => item.textContent)).toEqual([
      'Costa Coffee',
      'Logitech',
      'Zurich',
    ])
  })

  it('accepts a custom signpost', () => {
    render(<AboutClients clients={['Costa Coffee']} signpost="Clients" />)
    expect(screen.getByText('Clients')).toBeInTheDocument()
  })

  it('renders nothing when the clients list is empty', () => {
    const {container} = render(<AboutClients clients={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
