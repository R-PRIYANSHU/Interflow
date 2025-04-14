import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MeetingModal from '../components/MeetingModal';

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  };
});

// Mock ui/dialog
// We only mock the parts needed for MeetingModal to render and interact
let mockOpenChange: (open: boolean) => void = () => {};
jest.mock('../components/ui/dialog', () => ({
  Dialog: ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
    mockOpenChange = onOpenChange; // Capture the onOpenChange handler
    return open ? <div data-testid="dialog">{children}</div> : null;
  },
  DialogContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="dialog-content" className={className}>{children}</div>
  ),
}));

describe('MeetingModal Component', () => {
  const mockOnClose = jest.fn();
  const mockHandleClick = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal Title',
    handleClick: mockHandleClick,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockHandleClick.mockClear();
  });

  it('should render the title', () => {
    render(<MeetingModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: defaultProps.title })).toBeInTheDocument();
  });

  it('should apply className to the title', () => {
    const testClassName = 'custom-title-class';
    render(<MeetingModal {...defaultProps} className={testClassName} />);
    expect(screen.getByRole('heading', { name: defaultProps.title })).toHaveClass(testClassName);
  });

  it('should render children when provided', () => {
    const childText = 'This is the child content';
    render(<MeetingModal {...defaultProps}><p>{childText}</p></MeetingModal>);
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('should render the image when image prop is provided', () => {
    const testImage = '/images/test.png';
    render(<MeetingModal {...defaultProps} image={testImage} />);
    const image = screen.getByRole('img', { name: 'checked' }); // Alt text is hardcoded in component
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', testImage);
  });

  it('should not render the image when image prop is not provided', () => {
    render(<MeetingModal {...defaultProps} />);
    // Query for any image, assuming 'checked' might not be the only alt text possibility if component changes
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

   it('should render the button with default text "Schedule Meeting"', () => {
    render(<MeetingModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Schedule Meeting/i })).toBeInTheDocument();
  });

  it('should render the button with provided buttonText', () => {
    const buttonText = 'Start Meeting Now';
    render(<MeetingModal {...defaultProps} buttonText={buttonText} />);
    expect(screen.getByRole('button', { name: new RegExp(buttonText) })).toBeInTheDocument();
  });

  it('should render the button icon when buttonIcon is provided', () => {
    const buttonIcon = '/icons/test-icon.svg';
    render(<MeetingModal {...defaultProps} buttonIcon={buttonIcon} />);
    const icon = screen.getByRole('img', { name: 'button icon' });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', buttonIcon);
  });

   it('should not render the button icon when buttonIcon is not provided', () => {
    render(<MeetingModal {...defaultProps} />);
    // Check specifically for the button icon alt text
    expect(screen.queryByAltText('button icon')).not.toBeInTheDocument();
  });

  it('should call handleClick when the button is clicked', () => {
    render(<MeetingModal {...defaultProps} buttonText="Click Me" />);
    fireEvent.click(screen.getByRole('button', { name: /Click Me/i }));
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Dialog onOpenChange is called with false', () => {
    render(<MeetingModal {...defaultProps} />);
    // Simulate the Dialog calling onOpenChange(false)
    mockOpenChange(false);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not render when isOpen is false', () => {
    render(<MeetingModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });
});