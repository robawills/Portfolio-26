import {render, screen} from '@testing-library/react'

import {MediaGroup, MediaGroupImage} from './index'

jest.mock('@/components/Image', () => ({
  __esModule: true,
  Image: ({src, alt}: {src: string; alt: string}) => (
    <div data-testid="mock-image" data-src={src} data-alt={alt} />
  ),
}))

describe('MediaGroup', () => {
  const baseImage = {
    src: 'https://example.com/image.jpg',
    metaTitle: 'Test Image',
  }

  it('renders wrapper and arbitrary children', () => {
    render(
      <MediaGroup>
        <p>Test Child</p>
      </MediaGroup>,
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('forwards src and alt onto the underlying Image', () => {
    render(
      <MediaGroup>
        <MediaGroupImage {...baseImage} size="half" />
      </MediaGroup>,
    )
    const image = screen.getByTestId('mock-image')
    expect(image).toHaveAttribute('data-src', baseImage.src)
    expect(image).toHaveAttribute('data-alt', baseImage.metaTitle)
  })

  it('applies the size-specific item modifier class', () => {
    const {container} = render(
      <MediaGroup>
        <MediaGroupImage {...baseImage} size="half" />
        <MediaGroupImage {...baseImage} size="full" />
        <MediaGroupImage {...baseImage} size="max" />
        <MediaGroupImage {...baseImage} size="mega" />
      </MediaGroup>,
    )
    const items = container.querySelectorAll('[class*="item--"]')
    expect(items[0].className).toMatch(/item--half/)
    expect(items[1].className).toMatch(/item--full/)
    expect(items[2].className).toMatch(/item--max/)
    expect(items[3].className).toMatch(/item--mega/)
  })
})
