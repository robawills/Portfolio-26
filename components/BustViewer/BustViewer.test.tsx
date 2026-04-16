import { render, screen } from '@testing-library/react';

import BustViewer from './index';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  useGLTF: Object.assign(() => ({ scene: {} }), { preload: jest.fn() }),
}));

describe('BustViewer', () => {
  it('renders the canvas', () => {
    render(<BustViewer />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('accepts an optional className', () => {
    const { container } = render(<BustViewer className="custom" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
