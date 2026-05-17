import {render, screen} from '@testing-library/react'

import {AboutHero} from './index'

describe('AboutHero', () => {
  it('renders the title as a level-one heading', () => {
    render(<AboutHero title="Hello world" />)
    const heading = screen.getByRole('heading', {level: 1})
    expect(heading).toHaveTextContent('Hello world')
  })

  it('forwards a custom className to the section', () => {
    const {container} = render(
      <AboutHero title="Hello" className="custom-class" />,
    )
    const section = container.querySelector('section')
    expect(section?.className).toContain('custom-class')
  })
})
