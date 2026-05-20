import {render} from '@testing-library/react'

import {HandPoseProvider} from '@/context/HandPose'

import {Hand3D} from './index'

// r3f + drei need WebGL which jsdom can't provide. Mock to a smoke surface.
// Skip rendering Canvas children — they're r3f intrinsics (<ambientLight>,
// <group>, <primitive>…) that React DOM doesn't know, so rendering them would
// spam console.error.
jest.mock('@react-three/fiber', () => ({
  __esModule: true,
  Canvas: () => <div data-testid="r3f-canvas" />,
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

describe('Hand3D', () => {
  it('mounts inside HandPoseProvider without throwing', () => {
    const {getByTestId} = render(
      <HandPoseProvider>
        <Hand3D />
      </HandPoseProvider>,
    )
    expect(getByTestId('r3f-canvas')).toBeInTheDocument()
  })
})
