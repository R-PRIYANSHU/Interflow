import React from 'react';
import { render, screen } from '@testing-library/react';
import CallToValue from '@/components/landingPage/CallToValue';

// Mock the Button component as it's imported from ui and might have its own complexities
jest.mock('@/components/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('CallToValue Component', () => {
  it('should render the heading, paragraph, and button', () => {
    render(<CallToValue />);

    // Check for heading
    expect(
      screen.getByRole('heading', { name: /Start Your Free Meeting Today/i })
    ).toBeInTheDocument();

    // Check for paragraph
    expect(
      screen.getByText(/Experience the power of seamless video conferencing./i)
    ).toBeInTheDocument();

    // Check for button
    expect(
      screen.getByRole('button', { name: /Get Started/i })
    ).toBeInTheDocument();
  });
});