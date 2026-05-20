import {render, screen} from '@testing-library/react'

import {AboutSkills} from './index'

describe('AboutSkills', () => {
  it('renders under the "Skills" signpost', () => {
    render(<AboutSkills skills={['TypeScript']} />)
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })

  it('renders one <li> per skill', () => {
    render(<AboutSkills skills={['TypeScript', 'React', 'Next.js']} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items.map((item) => item.textContent)).toEqual([
      'TypeScript',
      'React',
      'Next.js',
    ])
  })

  it('renders nothing when the skills list is empty', () => {
    const {container} = render(<AboutSkills skills={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
