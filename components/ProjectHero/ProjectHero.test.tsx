import {render, screen} from '@testing-library/react'

import {ProjectHero} from './index'

describe('ProjectHero', () => {
  it('renders the title and description', () => {
    render(<ProjectHero title="Wella Company" description="Hero copy." />)
    expect(
      screen.getByRole('heading', {level: 1, name: 'Wella Company'}),
    ).toBeInTheDocument()
    expect(screen.getByText('Hero copy.')).toBeInTheDocument()
  })

  it('omits the links section when no links are provided', () => {
    render(<ProjectHero title="No links" description="Body." />)
    expect(screen.queryByText('Links')).not.toBeInTheDocument()
  })

  it('renders each link as an external anchor', () => {
    render(
      <ProjectHero
        title="Project"
        description="Body."
        links={[
          {title: 'Sebastian Professional', url: 'https://sebastian.example'},
          {title: 'Wella Pro', url: 'https://wellapro.example'},
        ]}
      />,
    )
    expect(screen.getByText('Links')).toBeInTheDocument()
    const link = screen.getByRole('link', {name: 'Sebastian Professional'})
    expect(link).toHaveAttribute('href', 'https://sebastian.example')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    expect(screen.getByRole('link', {name: 'Wella Pro'})).toBeInTheDocument()
  })
})
