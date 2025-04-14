import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useChatContext } from 'stream-chat-react';
import { useCallStateHooks, CallingState } from '@stream-io/video-react-sdk';
import MeetingRoom from '@/components/MeetingRoom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  useParams: jest.fn()
}));

// Mock stream-chat-react
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(),
  Channel: ({ children }: { children: React.ReactNode }) => <div data-testid="stream-channel">{children}</div>,
  Window: ({ children }: { children: React.ReactNode }) => <div data-testid="stream-window">{children}</div>,
  ChannelHeader: () => <div>Channel Header</div>,
  MessageList: () => <div>Message List</div>,
  MessageInput: () => <div>Message Input</div>
}));

// Mock @stream-io/video-react-sdk
jest.mock('@stream-io/video-react-sdk', () => {
  // Define constants/mocks within the factory function scope
  const CallingState = { JOINED: 'joined' };

  // Mock EndCallButton to accept and call onLeave via onClick
  const MockEndCallButton = ({ onClick }: { onClick?: () => void }) => (
    <button aria-label="Leave" onClick={onClick}>Leave</button>
  );

  // Return the object containing all mocked exports
  return {
    useCallStateHooks: jest.fn().mockReturnValue({
      useCallCallingState: () => CallingState.JOINED,
      useLocalParticipant: () => ({
        isCallAdmin: true,
        userId: 'test-user-id',
        participant: {
          publishedTracks: ['camera', 'microphone'],
          isSpeaking: false
        }
      })
    }),
    useCall: jest.fn().mockReturnValue({
      leave: jest.fn(),
      end: jest.fn(),
      state: {
        createdBy: { id: 'test-user-id' }
      }
    }),
    CallingState: CallingState,
    PaginatedGridLayout: () => <div data-testid="grid-layout">Grid Layout</div>,
    SpeakerLayout: ({ participantsBarPosition }: { participantsBarPosition: string }) => (
      <div data-testid={`speaker-layout-${participantsBarPosition}`}>
        Speaker Layout {participantsBarPosition}
      </div>
    ),
    // Pass the onLeave prop down to MockEndCallButton's onClick
    CallControls: ({ onLeave }: { onLeave?: () => void }) => (
      <div>
        {/* Keep other buttons for other tests if needed, but they don't match component */}
        {/* <button aria-label="Grid">Grid</button> */}
        {/* <button aria-label="Participants">Participants</button> */}
        {/* <button aria-label="Chat">Chat</button> */}
        {/* <button aria-label="Whiteboard">Whiteboard</button> */}
        <MockEndCallButton onClick={onLeave} /> {/* Pass onLeave here */}
        <div>Call Controls Placeholder</div>
      </div>
    ),
    EndCallButton: MockEndCallButton, // Export the mock component
    CallParticipantsList: ({ onClose }: { onClose: () => void }) => (
      <div data-testid="participants-list">
        Participants List
        <button onClick={onClose}>Close</button>
      </div>
    ),
    CallStatsButton: () => <div>Call Stats</div>,
  };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));
// Define the actual mock function instance first

// Mock the module and the specific named export directly within the factory
jest.mock('@/lib/whiteboardSession', () => ({
  __esModule: true,
  createExcalidrawSession: jest.fn(), // Define the mock function here
}));

// Get a reference to the mock *after* jest.mock has run
const mockCreateSession = require('@/lib/whiteboardSession').createExcalidrawSession;


describe('MeetingRoom', () => {
  const mockRouter = { push: jest.fn() };
  const mockSearchParams = new URLSearchParams();
  const mockParams = { id: 'test-meeting-id' };
  const mockChatClient = {
    disconnectUser: jest.fn(),
    channel: jest.fn().mockReturnValue({
      sendMessage: jest.fn(),
      create: jest.fn().mockResolvedValue({})
    }),
    userID: 'test-user-id',
    user: { name: 'Test User' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateSession.mockClear(); // Clear the whiteboard mock too
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useParams as jest.Mock).mockReturnValue(mockParams);
    (useChatContext as jest.Mock).mockReturnValue({ client: mockChatClient });
    (useCallStateHooks as jest.Mock).mockReturnValue({
      useCallCallingState: () => CallingState.JOINED,
      useLocalParticipant: () => ({ // Add this mock back
        isCallAdmin: true,
        userId: 'test-user-id',
        participant: {
          publishedTracks: ['camera', 'microphone'],
          isSpeaking: false
        }
      })
    });
  });

  it('renders the meeting room with default layout', () => {
    render(<MeetingRoom />);
    expect(screen.getByTestId('speaker-layout-right')).toBeInTheDocument();
  });

  it('renders speaker layout by default and layout button exists', () => {
    render(<MeetingRoom />);

    // Check default layout
    expect(screen.getByTestId('speaker-layout-right')).toBeInTheDocument();

    // Check that the trigger button exists
    const layoutTrigger = screen.getByRole('button', { name: /change layout/i });
    expect(layoutTrigger).toBeInTheDocument();
    // We won't try to interact with the dropdown items due to JSDOM limitations
  });

  it('toggles participants panel when participants button is clicked', () => {
    render(<MeetingRoom />);

    // Find the button that actually toggles participants (contains Users icon)
    // It might be better to add an aria-label="Toggle Participants" to this button in the component
    const participantsButton = screen.getByRole('button', { name: /toggle participants/i }); // Adjust selector based on actual button attributes
    fireEvent.click(participantsButton);

    const participantsList = screen.getByTestId('participants-list');
    expect(participantsList).toBeVisible(); // Check visibility initially

    // Find the close button *within* the participants list
    const closeButton = within(participantsList).getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Check that the list is no longer visible
    // Check that the list does not have the 'block' class which makes it visible
    expect(participantsList).not.toHaveClass('block');
  });

  it('toggles chat panel when chat button is clicked', () => {
    render(<MeetingRoom />);

    // Find the button that actually toggles chat (contains MessageSquare icon)
    // Add aria-label="Toggle Chat" in component for better testing
    const chatButton = screen.getByRole('button', { name: /toggle chat/i }); // Adjust selector
    fireEvent.click(chatButton);

    expect(screen.getByTestId('stream-channel')).toBeVisible(); // Check visibility
    expect(screen.getByText('Channel Header')).toBeInTheDocument();
    expect(screen.getByText('Message List')).toBeInTheDocument();
    expect(screen.getByText('Message Input')).toBeInTheDocument();
  });

  it('disconnects user and redirects when leaving the meeting', () => {
    render(<MeetingRoom />);

    // The leave button is now correctly mocked inside CallControls and calls onLeave
    const leaveButton = screen.getByRole('button', { name: /leave/i });
    fireEvent.click(leaveButton);

    // Assertions should now pass because the MockEndCallButton calls the onLeave prop
    expect(mockChatClient.disconnectUser).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('creates whiteboard session when whiteboard button is clicked', async () => {
    // Configure the mock for this specific test
    mockCreateSession.mockResolvedValue('https://excalidraw.com/session/123');
    global.window = Object.create(window);
    Object.defineProperty(window, 'open', { value: jest.fn() });

    render(<MeetingRoom />);

    // Find the button that actually triggers the whiteboard (contains PenTool icon)
    // Add aria-label="Open Whiteboard" in component for better testing
    const whiteboardButton = screen.getByRole('button', { name: /open whiteboard/i }); // Adjust selector
    fireEvent.click(whiteboardButton);

    // Assertions should now pass because the correct function is mocked and button clicked
    expect(mockChatClient.channel).toHaveBeenCalledWith('messaging', 'test-meeting-id');
    await expect(mockCreateSession).toHaveBeenCalledWith('Test User'); // mockCreateSession now correctly mocks createExcalidrawSession
  });
});

// Helper import for within query
import { within } from '@testing-library/react';