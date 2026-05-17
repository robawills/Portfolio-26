import {render, screen} from '@testing-library/react'

import {AboutSection} from './index'

describe('AboutSection', () => {
  it('renders the signpost label', () => {
    render(
      <AboutSection signpost="Bio">
        <p>Body copy.</p>
      </AboutSection>,
    )
    expect(screen.getByText('Bio')).toBeInTheDocument()
  })

  it('renders the passed children', () => {
    render(
      <AboutSection signpost="Bio">
        <p>First paragraph.</p>
        <p>Second paragraph.</p>
      </AboutSection>,
    )
    expect(screen.getByText('First paragraph.')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
  })

  it('forwards a custom className to the section element', () => {
    const {container} = render(
      <AboutSection signpost="Bio" className="custom-class">
        <p>Body.</p>
      </AboutSection>,
    )
    const section = container.querySelector('section')
    expect(section?.className).toContain('custom-class')
  })
})
