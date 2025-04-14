import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'sonner';
import MeetingCard from '@/components/MeetingCard';

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

// Mock next/image since it's not available in test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('MeetingCard', () => {
  const mockProps = {
    title: 'Test Meeting',
    date: '2024-03-15 10:00 AM',
    icon: '/icons/upcoming.svg',
    handleClick: jest.fn(),
    link: 'https://test-meeting-link.com',
    buttonText: 'Join Meeting',
    buttonIcon1: '/icons/join-meeting.svg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders meeting card with correct information', () => {
    render(<MeetingCard {...mockProps} />);
    
    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
    expect(screen.getByText('2024-03-15 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Join Meeting')).toBeInTheDocument();
  });

  it('shows ongoing badge when isOngoing is true', () => {
    render(<MeetingCard {...mockProps} isOngoing={true} />);
    
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('does not show ongoing badge when isOngoing is false', () => {
    render(<MeetingCard {...mockProps} isOngoing={false} />);
    
    expect(screen.queryByText('Ongoing')).not.toBeInTheDocument();
  });

  it('calls handleClick when primary button is clicked', () => {
    render(<MeetingCard {...mockProps} />);
    
    const joinButton = screen.getByText('Join Meeting');
    fireEvent.click(joinButton);
    
    expect(mockProps.handleClick).toHaveBeenCalledTimes(1);
  });

  it('copies link and shows toast when copy link button is clicked', async () => {
    // Mock clipboard API
    const mockClipboard = {
      writeText: jest.fn(),
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    render(<MeetingCard {...mockProps} />);
    
    const copyButton = screen.getByText('Copy Link');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockProps.link);
    expect(toast.success).toHaveBeenCalledWith('Link Copied');
  });

  it('does not show buttons when isPreviousMeeting is true', () => {
    render(<MeetingCard {...mockProps} isPreviousMeeting={true} />);
    
    expect(screen.queryByText('Join Meeting')).not.toBeInTheDocument();
    expect(screen.queryByText('Copy Link')).not.toBeInTheDocument();
  });
});