import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '@/components/ui/text-area'; // Adjust the import path as necessary

describe('Textarea Component', () => {
  it('should render a textarea element', () => {
    render(<Textarea data-testid="test-textarea" />);
    const textareaElement = screen.getByTestId('test-textarea');
    expect(textareaElement).toBeInTheDocument();
    expect(textareaElement.tagName).toBe('TEXTAREA');
  });

  it('should apply default and custom classNames', () => {
    const customClass = 'my-custom-class';
    render(<Textarea data-testid="test-textarea" className={customClass} />);
    const textareaElement = screen.getByTestId('test-textarea');
    expect(textareaElement).toHaveClass('flex'); // Check for a default class
    expect(textareaElement).toHaveClass(customClass); // Check for the custom class
  });

  it('should accept and display placeholder text', () => {
    const placeholderText = 'Enter text here...';
    render(<Textarea placeholder={placeholderText} />);
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Textarea data-testid="test-textarea" disabled />);
    const textareaElement = screen.getByTestId('test-textarea');
    expect(textareaElement).toBeDisabled();
  });

  it('should forward the ref correctly', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Textarea data-testid="test-textarea" onChange={handleChange} value="" />);
    const textareaElement = screen.getByTestId('test-textarea');

    await user.type(textareaElement, 'Test input');
    expect(handleChange).toHaveBeenCalledTimes(10); // Once for each character typed
    // Note: Testing the actual value requires controlling the component state,
    // which is usually done in the parent component's test.
    // Here we just verify the onChange handler is called.
  });
});