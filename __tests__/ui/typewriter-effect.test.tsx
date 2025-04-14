import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { TypewriterEffect, TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { motion } from 'framer-motion';

// Mock framer-motion hooks and components
jest.mock('framer-motion', () => {
  const originalModule = jest.requireActual('framer-motion');
  return {
    ...originalModule,
    useInView: jest.fn(() => true), // Assume component is always in view for testing
    useAnimate: jest.fn(() => [null, jest.fn()]), // Mock useAnimate to return a dummy ref and animate function
    motion: {
      ...originalModule.motion,
      // Render motion components as simple divs/spans, filtering out motion props
      div: jest.fn(({ children, initial, animate, transition, whileInView, ...props }) => <div {...props}>{children}</div>),
      span: jest.fn(({ children, initial, animate, transition, whileInView, ...props }) => <span {...props}>{children}</span>),
    },
  };
});

const mockWords = [
  { text: 'Hello' },
  { text: 'World', className: 'text-blue-500' },
];

describe('TypewriterEffect Component', () => {
  it('should render words split into characters', () => {
    render(<TypewriterEffect words={mockWords} />);

    // Check if characters are rendered within spans
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('e')).toBeInTheDocument();
    expect(screen.getAllByText('l').length).toBeGreaterThan(0); // Use getAllByText for repeated chars
    expect(screen.getAllByText('o').length).toBeGreaterThan(0); // Use getAllByText for repeated chars
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('r')).toBeInTheDocument();
    expect(screen.getByText('d')).toBeInTheDocument();

    // Check if specific class is applied to the second word's characters
    const worldChars = ['W', 'o', 'r', 'l', 'd'];
    worldChars.forEach(char => {
      // Find all instances of the character and check if at least one has the class
      const elements = screen.getAllByText(char);
      expect(elements.some(el => el.classList.contains('text-blue-500'))).toBe(true);
    });
  });

  it('should apply className to the main container', () => {
    const testClassName = 'custom-class';
    render(<TypewriterEffect words={mockWords} className={testClassName} />);
    const container = screen.getByText('H').closest('div[class*="text-base"]'); // Find the main container
    expect(container).toHaveClass(testClassName);
  });

  it('should render the cursor span', () => {
    render(<TypewriterEffect words={mockWords} />);
    // The cursor is an empty span, difficult to select directly. We check its parent.
    const container = screen.getByText('H').closest('div[class*="text-base"]');
    expect(container?.querySelector('span[class*="bg-blue-500"]')).toBeInTheDocument();
  });

   it('should apply cursorClassName to the cursor span', () => {
    const testCursorClassName = 'custom-cursor';
    render(<TypewriterEffect words={mockWords} cursorClassName={testCursorClassName} />);
    const container = screen.getByText('H').closest('div[class*="text-base"]');
    const cursor = container?.querySelector('span[class*="bg-blue-500"]');
    expect(cursor).toHaveClass(testCursorClassName);
  });
});

describe('TypewriterEffectSmooth Component', () => {
  it('should render words split into characters', () => {
    render(<TypewriterEffectSmooth words={mockWords} />);

    // Check if characters are rendered within spans
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('e')).toBeInTheDocument();
    // The previous diff already fixed these lines, but including again just in case.
    // If this part fails, it's okay as the lines should already be correct.
    expect(screen.getAllByText('l').length).toBeGreaterThan(0); // Use getAllByText for repeated chars
    expect(screen.getAllByText('o').length).toBeGreaterThan(0); // Use getAllByText for repeated chars
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('r')).toBeInTheDocument();
    expect(screen.getByText('d')).toBeInTheDocument();

     // Check if specific class is applied to the second word's characters
    const worldChars = ['W', 'o', 'r', 'l', 'd'];
    worldChars.forEach(char => {
      const elements = screen.getAllByText(char);
      expect(elements.some(el => el.classList.contains('text-blue-500'))).toBe(true);
    });
  });

  it('should apply className to the main container', () => {
    const testClassName = 'custom-smooth-class';
    render(<TypewriterEffectSmooth words={mockWords} className={testClassName} />);
    // Find the main container (the one with flex)
    const container = screen.getByText('H').closest('div[class*="flex"]');
    expect(container).toHaveClass(testClassName);
  });

  it('should render the cursor span', () => {
    render(<TypewriterEffectSmooth words={mockWords} />);
    const container = screen.getByText('H').closest('div[class*="flex"]');
    expect(container?.querySelector('span[class*="bg-blue-500"]')).toBeInTheDocument();
  });

   it('should apply cursorClassName to the cursor span', () => {
    const testCursorClassName = 'custom-smooth-cursor';
    render(<TypewriterEffectSmooth words={mockWords} cursorClassName={testCursorClassName} />);
    const container = screen.getByText('H').closest('div[class*="flex"]');
    const cursor = container?.querySelector('span[class*="bg-blue-500"]');
    expect(cursor).toHaveClass(testCursorClassName);
  });
});