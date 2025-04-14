import React from 'react';
import { render, screen } from '@testing-library/react';
import TestimonialCard from '@/components/ui/testimonial-card'; // Adjust import path if needed
import Image from 'next/image';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockPerson = {
  avatar: '/images/avatar-1.jpeg',
  name: 'John Doe',
  handle: 'johndoe',
  url: 'https://example.com/johndoe',
  text: 'This is a great testimonial!',
};

describe('TestimonialCard Component', () => {
  beforeEach(() => {
    render(<TestimonialCard person={mockPerson} />);
  });

  it('should render an anchor tag with correct href and target', () => {
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', mockPerson.url);
    expect(linkElement).toHaveAttribute('target', '_blank');
  });

  it('should render the person\'s avatar image', () => {
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockPerson.avatar);
    expect(imageElement).toHaveAttribute('alt', `${mockPerson.name}'s avatar`);
  });

  it('should render the person\'s name', () => {
    expect(screen.getByRole('heading', { name: mockPerson.name })).toBeInTheDocument();
  });

  it('should render the person\'s handle prefixed with @', () => {
    expect(screen.getByText(`@${mockPerson.handle}`)).toBeInTheDocument();
  });

  it('should render the testimonial text', () => {
    expect(screen.getByText(mockPerson.text)).toBeInTheDocument();
  });
});