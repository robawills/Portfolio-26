import {render, screen} from '@testing-library/react'

import {AboutBio} from './index'

describe('AboutBio', () => {
  it('renders under the "Bio" signpost', () => {
    render(<AboutBio bio="A single line." />)
    expect(screen.getByText('Bio')).toBeInTheDocument()
  })

  it('renders one <p> per paragraph, splitting on blank lines', () => {
    render(
      <AboutBio
        bio={`First paragraph.

Second paragraph.

Third paragraph.`}
      />,
    )
    expect(screen.getByText('First paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Third paragraph.')).toBeInTheDocument()
  })

  it('renders nothing when given empty or whitespace-only copy', () => {
    const {container} = render(<AboutBio bio={'   \n  \n  '} />)
    expect(container).toBeEmptyDOMElement()
  })
})
