import {render, screen} from '@testing-library/react'

import type {ProjectCardProps} from '@/components/ProjectCard'

import {ProjectGrid} from './index'

const projects: ProjectCardProps[] = [
  {
    href: '/projects/a',
    title: 'Alpha',
    description: 'A',
    image: {src: '/a.jpg', alt: 'a'},
  },
  {
    href: '/projects/b',
    title: 'Beta',
    description: 'B',
    image: {src: '/b.jpg', alt: 'b'},
  },
  {
    href: '/projects/c',
    title: 'Gamma',
    description: 'C',
    image: {src: '/c.jpg', alt: 'c'},
  },
]

describe('ProjectGrid', () => {
  it('renders one card per project', () => {
    render(<ProjectGrid projects={projects} />)
    expect(screen.getAllByTestId('grid-item')).toHaveLength(projects.length)
  })

  it('renders each project title in the trigger', () => {
    render(<ProjectGrid projects={projects} />)
    expect(screen.getByRole('button', {name: /alpha/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /beta/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /gamma/i})).toBeInTheDocument()
  })

  it('renders no items for an empty list', () => {
    render(<ProjectGrid projects={[]} />)
    expect(screen.queryByTestId('grid-item')).toBeNull()
  })
})
