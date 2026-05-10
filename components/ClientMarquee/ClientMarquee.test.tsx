import {render, screen} from '@testing-library/react'

import {ClientMarquee} from './index'

describe('ClientMarquee', () => {
  it('renders nothing when given an empty list', () => {
    const {container} = render(<ClientMarquee clients={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders each client name twice (visible + duplicated for the loop)', () => {
    render(<ClientMarquee clients={['Acme', 'Globex', 'Initech']} />)
    expect(screen.getAllByText('Acme')).toHaveLength(2)
    expect(screen.getAllByText('Globex')).toHaveLength(2)
    expect(screen.getAllByText('Initech')).toHaveLength(2)
  })

  it('labels the section for assistive tech', () => {
    render(<ClientMarquee clients={['Acme']} />)
    expect(screen.getByRole('region', {name: 'Clients'})).toBeInTheDocument()
  })
})
