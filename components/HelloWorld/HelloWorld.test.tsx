import { render, screen } from '@testing-library/react';
import HelloWorld from './index';

describe('HelloWorld', () => {
  it('renders with default title', () => {
    render(<HelloWorld />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Hello, World!'
    );
  });

  it('renders with custom title', () => {
    render(<HelloWorld title="Custom Title" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Custom Title'
    );
  });

  it('renders description text', () => {
    render(<HelloWorld />);
    expect(
      screen.getByText('This project is set up and ready to build.')
    ).toBeInTheDocument();
  });
});
