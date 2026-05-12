import {render, screen} from '@testing-library/react'

import {ProjectBody, type ProjectBodyBlock} from './index'

jest.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      fit: () => ({
        auto: () => ({url: () => 'mock://image'}),
      }),
    }),
  }),
}))

jest.mock('@/components/AboutBuild', () => ({
  __esModule: true,
  AboutBuild: ({signpost, description}: {signpost: string; description: string}) => (
    <div data-testid="about-build" data-signpost={signpost}>
      {description}
    </div>
  ),
}))

jest.mock('@/components/MediaGroup', () => ({
  __esModule: true,
  MediaGroup: ({children}: {children: React.ReactNode}) => (
    <div data-testid="media-group">{children}</div>
  ),
  MediaGroupImage: ({metaTitle, size}: {metaTitle: string; size: string}) => (
    <div data-testid="media-group-image" data-size={size}>
      {metaTitle}
    </div>
  ),
}))

const stockAsset = {_id: 'image-abc'}

describe('ProjectBody', () => {
  it('renders nothing when body is empty', () => {
    const {container: empty} = render(<ProjectBody />)
    expect(empty).toBeEmptyDOMElement()
    const {container: withEmptyArray} = render(<ProjectBody body={[]} />)
    expect(withEmptyArray).toBeEmptyDOMElement()
  })

  it('preserves block order across mixed types', () => {
    const body: ProjectBodyBlock[] = [
      {
        _type: 'aboutBuildBlock',
        _key: 'a',
        signpost: 'Build',
        description: 'First',
      },
      {
        _type: 'mediaGroupBlock',
        _key: 'm',
        items: [
          {_key: 'i1', size: 'full', image: {alt: 'Pic 1', asset: stockAsset}},
        ],
      },
      {
        _type: 'aboutBuildBlock',
        _key: 'b',
        signpost: 'Notes',
        description: 'Second',
      },
    ]
    render(<ProjectBody body={body} />)

    const rendered = Array.from(document.body.querySelectorAll('[data-testid]'))
    const types = rendered.map((el) => el.getAttribute('data-testid'))
    expect(types).toEqual([
      'about-build',
      'media-group',
      'media-group-image',
      'about-build',
    ])
  })

  it('forwards aboutBuild fields and falls back to "Build" signpost', () => {
    const body: ProjectBodyBlock[] = [
      {
        _type: 'aboutBuildBlock',
        _key: 'a',
        description: 'No signpost provided',
      },
    ]
    render(<ProjectBody body={body} />)
    const node = screen.getByTestId('about-build')
    expect(node).toHaveAttribute('data-signpost', 'Build')
    expect(node).toHaveTextContent('No signpost provided')
  })

  it('skips media-group items missing an asset', () => {
    const body: ProjectBodyBlock[] = [
      {
        _type: 'mediaGroupBlock',
        _key: 'm',
        items: [
          {_key: 'has', size: 'half', image: {alt: 'Has asset', asset: stockAsset}},
          {_key: 'missing', size: 'full', image: {alt: 'No asset'}},
        ],
      },
    ]
    render(<ProjectBody body={body} />)
    const images = screen.getAllByTestId('media-group-image')
    expect(images).toHaveLength(1)
    expect(images[0]).toHaveAttribute('data-size', 'half')
    expect(images[0]).toHaveTextContent('Has asset')
  })

  it('omits an empty media-group entirely', () => {
    const body: ProjectBodyBlock[] = [
      {
        _type: 'mediaGroupBlock',
        _key: 'm',
        items: [{_key: 'x', size: 'full', image: {alt: 'No asset'}}],
      },
    ]
    render(<ProjectBody body={body} />)
    expect(screen.queryByTestId('media-group')).not.toBeInTheDocument()
  })
})
