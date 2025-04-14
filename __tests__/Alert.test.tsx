import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from '../components/Alert';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  };
});

describe('Alert Component', () => {
  const testTitle = 'Test Alert Title';
  const testIconUrl = '/icons/test-icon.svg';

  it('should render the title correctly', () => {
    render(<Alert title={testTitle} />);
    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });

  it('should render the icon when iconUrl is provided', () => {
    render(<Alert title={testTitle} iconUrl={testIconUrl} />);
    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', testIconUrl);
    expect(icon).toHaveAttribute('alt', 'icon');
  });

  it('should not render the icon when iconUrl is not provided', () => {
    render(<Alert title={testTitle} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render the "Back to Home" button with the correct link', () => {
    render(<Alert title={testTitle} />);
    const link = screen.getByRole('link', { name: /back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});