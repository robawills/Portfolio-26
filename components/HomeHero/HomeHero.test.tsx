import {render, screen} from '@testing-library/react'

import {HandPoseProvider} from '@/context/HandPose'

import {HomeHero} from './index'

// Hand3D pulls in r3f + drei + a GLB — mock them so the smoke test can mount.
jest.mock('@react-three/fiber', () => ({
  __esModule: true,
  Canvas: ({children}: {children: React.ReactNode}) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: () => {},
}))
jest.mock('@react-three/drei', () => ({
  __esModule: true,
  Center: ({children}: {children: React.ReactNode}) => <>{children}</>,
  Environment: () => null,
  useGLTF: Object.assign(
    () => ({scene: {traverse: () => {}}, animations: []}),
    {preload: () => {}},
  ),
}))

const setup = (
  props: {title?: string; description?: string} = {},
) =>
  render(
    <HandPoseProvider>
      <HomeHero
        title={props.title ?? 'Hello world'}
        description={props.description ?? 'Front-end with feeling.'}
      />
    </HandPoseProvider>,
  )

describe('HomeHero', () => {
  it('renders the title as an h1', () => {
    setup({title: 'Custom title'})
    expect(
      screen.getByRole('heading', {level: 1, name: /custom title/i}),
    ).toBeInTheDocument()
  })

  it('renders the description copy', () => {
    setup({description: 'Some lead paragraph.'})
    expect(screen.getByText('Some lead paragraph.')).toBeInTheDocument()
  })

  it('mounts the Hand3D canvas', () => {
    setup()
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument()
  })
})
