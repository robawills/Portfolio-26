import {render, screen} from '@testing-library/react'

import {Image} from './index'

describe('Image', () => {
  it('renders the alt text', () => {
    render(<Image src="/foo.jpg" alt="Test alt" fill sizes="100vw" />)
    expect(screen.getByAltText('Test alt')).toBeInTheDocument()
  })

  it('passes the src through', () => {
    render(<Image src="/photo.jpg" alt="x" fill sizes="100vw" />)
    expect(screen.getByAltText('x')).toHaveAttribute('src', '/photo.jpg')
  })

  it('renders a placeholder by default', () => {
    render(<Image src="/x.jpg" alt="x" fill sizes="100vw" />)
    expect(screen.getByTestId('placeholder-default')).toBeInTheDocument()
  })

  it('applies a focal-point CSS variable for a string focalPoint', () => {
    render(<Image src="/x.jpg" alt="x" fill sizes="100vw" focalPoint="top" />)
    const img = screen.getByAltText('x')
    expect(img.getAttribute('style')).toEqual(
      expect.stringContaining('--focal-point-mobile'),
    )
  })

  it('applies a per-breakpoint focal-point object', () => {
    render(
      <Image
        src="/x.jpg"
        alt="x"
        fill
        sizes="100vw"
        focalPoint={{mobile: 'top', desktop: 'bottom'}}
      />,
    )
    const style = screen.getByAltText('x').getAttribute('style') ?? ''
    expect(style).toEqual(expect.stringContaining('--focal-point-mobile'))
    expect(style).toEqual(expect.stringContaining('--focal-point-desktop'))
  })
})
