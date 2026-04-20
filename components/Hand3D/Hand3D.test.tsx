import { render, screen } from '@testing-library/react';

import Hand3D from './index';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Center: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  ContactShadows: () => null,
  Environment: () => null,
  useGLTF: Object.assign(
    () => ({
      scene: { traverse: jest.fn(), clone: jest.fn().mockReturnThis() },
      animations: [],
    }),
    { preload: jest.fn() }
  ),
}));

describe('Hand3D', () => {
  it('renders canvases', () => {
    render(<Hand3D />);
    expect(screen.getAllByTestId('canvas').length).toBeGreaterThan(0);
  });

  it('accepts an optional className', () => {
    const { container } = render(<Hand3D className="custom" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
