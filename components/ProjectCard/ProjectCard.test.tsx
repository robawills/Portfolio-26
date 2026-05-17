import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {ProjectCard, type ProjectCardProps} from './index'

const baseProps: ProjectCardProps = {
  href: '/projects/atlas',
  title: 'Mountain Atlas',
  description: 'A study of cartography.',
  image: {src: '/cover.jpg', alt: 'Cover'},
  tags: ['Maps', 'Editorial'],
  links: [{label: 'Site', href: 'https://example.com'}],
}

describe('ProjectCard', () => {
  it('renders the trigger label with the project title', () => {
    render(<ProjectCard {...baseProps} />)
    expect(screen.getByRole('button', {name: /mountain atlas/i})).toBeInTheDocument()
  })

  it('renders the cover image link to the project page', () => {
    render(<ProjectCard {...baseProps} />)
    const links = screen.getAllByRole('link', {name: /view mountain atlas/i})
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link).toHaveAttribute('href', '/projects/atlas')
    }
  })

  it('opens the panel when the trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<ProjectCard {...baseProps} />)
    await user.click(screen.getByRole('button', {name: /mountain atlas/i}))
    expect(screen.getByRole('dialog', {hidden: true})).toHaveAttribute(
      'data-state',
      'open',
    )
  })

  it('renders tags and external links inside the panel', () => {
    render(<ProjectCard {...baseProps} />)
    expect(screen.getByText('Maps')).toBeInTheDocument()
    expect(screen.getByText('Editorial')).toBeInTheDocument()
    expect(screen.getByRole('link', {name: /site/i})).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })

  it('renders both image variants when mobileImage is provided', () => {
    render(
      <ProjectCard
        {...baseProps}
        mobileImage={{src: '/mobile.jpg', alt: 'Mobile cover'}}
      />,
    )
    expect(screen.getByAltText('Cover')).toBeInTheDocument()
    expect(screen.getByAltText('Mobile cover')).toBeInTheDocument()
  })
})
