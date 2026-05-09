import {render, screen} from '@testing-library/react'

import {ExpertiseDetailHero} from './index'

const baseProps = {
  signpost: 'Portfolio',
  title: 'Design Engineer',
  intro: 'Front-end with feeling.',
  image: {src: '/hero.jpg', alt: 'Hero image'},
}

describe('ExpertiseDetailHero', () => {
  it('renders the signpost label', () => {
    render(<ExpertiseDetailHero {...baseProps} />)
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
  })

  it('renders the title as an h1', () => {
    render(<ExpertiseDetailHero {...baseProps} />)
    expect(screen.getByRole('heading', {level: 1, name: /design engineer/i})).toBeInTheDocument()
  })

  it('renders the intro copy', () => {
    render(<ExpertiseDetailHero {...baseProps} />)
    expect(screen.getByText('Front-end with feeling.')).toBeInTheDocument()
  })

  it('renders the hero image with alt', () => {
    render(<ExpertiseDetailHero {...baseProps} />)
    expect(screen.getByAltText('Hero image')).toHaveAttribute('src', '/hero.jpg')
  })
})
