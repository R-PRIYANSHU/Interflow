import React from 'react';
import { render, screen } from '@testing-library/react';
import Logo from '@/components/landingPage/navbar/Logo';

describe('Logo Component', () => {
  it('should render the SVG logo', () => {
    const { container } = render(<Logo />);
    // Check if the SVG element is rendered
    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeNull(); // Check if it exists
    if (svgElement) { // Type guard for TypeScript
      expect(svgElement).toBeInTheDocument();
      expect(svgElement.tagName.toLowerCase()).toBe('svg');
    }
  });
});