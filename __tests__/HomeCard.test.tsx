import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeCard from '../components/HomeCard';

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  };
});

describe('HomeCard Component', () => {
  const testProps = {
    img: '/icons/test-image.svg',
    title: 'Test Title',
    description: 'Test Description',
    handleClick: jest.fn(),
    className: 'extra-class',
    iconBgColor: 'bg-test-color',
  };

  beforeEach(() => {
    // Reset mock before each test
    testProps.handleClick.mockClear();
  });

  it('should render the image with correct src and alt', () => {
    render(<HomeCard {...testProps} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', testProps.img);
    expect(image).toHaveAttribute('alt', testProps.title); // Alt text should be the title
  });

  it('should render the title correctly', () => {
    render(<HomeCard {...testProps} />);
    expect(screen.getByRole('heading', { name: testProps.title })).toBeInTheDocument();
  });

  it('should render the description correctly', () => {
    render(<HomeCard {...testProps} />);
    expect(screen.getByText(testProps.description)).toBeInTheDocument();
  });

  it('should apply the icon background color class', () => {
    render(<HomeCard {...testProps} />);
    // The image is inside the div with the background color
    const iconContainer = screen.getByRole('img').parentElement;
    expect(iconContainer).toHaveClass(testProps.iconBgColor);
  });

  it('should apply the additional className', () => {
    render(<HomeCard {...testProps} />);
    // The section element is the root element of the component
    const section = screen.getByRole('heading', { name: testProps.title }).closest('section');
    expect(section).toHaveClass(testProps.className);
  });

  it('should call handleClick when clicked', () => {
    render(<HomeCard {...testProps} />);
    const section = screen.getByRole('heading', { name: testProps.title }).closest('section');
    if (section) {
      fireEvent.click(section);
      expect(testProps.handleClick).toHaveBeenCalledTimes(1);
    } else {
      throw new Error('Section element not found');
    }
  });

  it('should render without crashing if handleClick is not provided', () => {
    const { handleClick, ...propsWithoutClick } = testProps;
    render(<HomeCard {...propsWithoutClick} />);
    const section = screen.getByRole('heading', { name: testProps.title }).closest('section');
     if (section) {
      // Clicking should not throw an error
      expect(() => fireEvent.click(section)).not.toThrow();
    } else {
      throw new Error('Section element not found');
    }
  });
});