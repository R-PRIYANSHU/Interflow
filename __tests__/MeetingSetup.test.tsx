import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MeetingSetup from '../components/MeetingSetup';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';

// --- Mocks ---

// Mock Alert component
jest.mock('../components/Alert', () => {
  return ({ title, iconUrl }: { title: string; iconUrl?: string }) => (
    <div data-testid="alert">
      <h1>{title}</h1>
      {iconUrl && <img src={iconUrl} alt="icon" />}    </div>
  );
});

// Mock Stream SDK components
jest.mock('@stream-io/video-react-sdk', () => ({
  useCall: jest.fn(),
  useCallStateHooks: jest.fn(),
  VideoPreview: () => <div data-testid="video-preview">Video Preview</div>,
  DeviceSettings: () => <div data-testid="device-settings">Device Settings</div>,
}));

// Mock console.error to avoid cluttering test output for expected errors
const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

// --- Test Suite ---

describe('MeetingSetup Component', () => {
  let mockSetIsSetupComplete: jest.Mock;
  let mockCall: any;
  let mockUseCallStateHooks: any;

  beforeEach(() => {
    mockSetIsSetupComplete = jest.fn();

    // Reset mocks before each test
    (useCall as jest.Mock).mockClear();
    (useCallStateHooks as jest.Mock).mockClear();
    consoleErrorMock.mockClear();

    // Default mock implementations
    mockCall = {
      join: jest.fn(),
      camera: {
        enable: jest.fn().mockResolvedValue(undefined),
        disable: jest.fn().mockResolvedValue(undefined),
      },
      microphone: {
        enable: jest.fn().mockResolvedValue(undefined),
        disable: jest.fn().mockResolvedValue(undefined),
      },
    };

    mockUseCallStateHooks = {
      useCallStartsAt: jest.fn(() => undefined),
      useCallEndedAt: jest.fn(() => undefined),
    };

    (useCall as jest.Mock).mockReturnValue(mockCall);
    (useCallStateHooks as jest.Mock).mockReturnValue(mockUseCallStateHooks);
  });

  afterAll(() => {
    consoleErrorMock.mockRestore(); // Restore original console.error
  });

  it('should render Alert if call time has not arrived', () => {
    const futureDate = new Date(Date.now() + 60000); // 1 minute in the future
    mockUseCallStateHooks.useCallStartsAt.mockReturnValue(futureDate);
    render(<MeetingSetup setIsSetupComplete={mockSetIsSetupComplete} />);

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Your Meeting has not started yet/i })).toBeInTheDocument();
    expect(screen.queryByTestId('video-preview')).not.toBeInTheDocument();
  });

  it('should render Alert if call has ended', () => {
    const pastDate = new Date(Date.now() - 60000); // 1 minute in the past
    mockUseCallStateHooks.useCallEndedAt.mockReturnValue(pastDate);
    render(<MeetingSetup setIsSetupComplete={mockSetIsSetupComplete} />);

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /The call has been ended by the host/i })).toBeInTheDocument();
    expect(screen.getByAltText('icon')).toHaveAttribute('src', '/icons/call-ended.svg');
    expect(screen.queryByTestId('video-preview')).not.toBeInTheDocument();
  });

  it('should render loading state initially then the setup UI', async () => {
    render(<MeetingSetup setIsSetupComplete={mockSetIsSetupComplete} />);

    // Initially shows loading
    expect(screen.getByText(/Loading Preview.../i)).toBeInTheDocument();
    expect(screen.queryByTestId('video-preview')).not.toBeInTheDocument();

    // Wait for useEffect to run and set media ready
    await waitFor(() => {
      expect(screen.getByTestId('video-preview')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Loading Preview.../i)).not.toBeInTheDocument();
    expect(screen.getByTestId('device-settings')).toBeInTheDocument();
    expect(screen.getByLabelText(/Join with mic and camera off/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Join meeting/i })).toBeInTheDocument();
    // Check default device state (enabled)
    expect(mockCall.camera.enable).toHaveBeenCalled();
    expect(mockCall.microphone.enable).toHaveBeenCalled();
  });

   it('should disable mic/cam when checkbox is checked', async () => {
    render(<MeetingSetup setIsSetupComplete={mockSetIsSetupComplete} />);

    // Wait for initial setup
    await waitFor(() => {
      expect(screen.getByTestId('video-preview')).toBeInTheDocument();
    });

    // Clear initial enable calls
    mockCall.camera.enable.mockClear();
    mockCall.microphone.enable.mockClear();

    const checkbox = screen.getByLabelText(/Join with mic and camera off/i);
    await act(async () => {
       fireEvent.click(checkbox);
    });


    // Wait for useEffect triggered by state change
    await waitFor(() => {
      expect(mockCall.camera.disable).toHaveBeenCalledTimes(1);
      expect(mockCall.microphone.disable).toHaveBeenCalledTimes(1);
    });
     expect(mockCall.camera.enable).not.toHaveBeenCalled();
     expect(mockCall.microphone.enable).not.toHaveBeenCalled();
  });

  it('should call join and setIsSetupComplete on button click', async () => {
    render(<MeetingSetup setIsSetupComplete={mockSetIsSetupComplete} />);

    // Wait for setup UI
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Join meeting/i })).toBeInTheDocument();
    });

    const joinButton = screen.getByRole('button', { name: /Join meeting/i });
    fireEvent.click(joinButton);

    expect(mockCall.join).toHaveBeenCalledTimes(1);
    expect(mockSetIsSetupComplete).toHaveBeenCalledWith(true);
  });

  it('should handle device initialization errors gracefully', async () => {
    const error = new Error('Device access denied');
    mockCall.camera.enable.mockRejectedValue(error); // Simulate error

    render(<MeetingSetup setIsSetupComplete={mockSetIsSetupComplete} />);

    // Should still show loading initially
    expect(screen.getByText(/Loading Preview.../i)).toBeInTheDocument();

    // Wait for useEffect to attempt initialization and handle error
    await waitFor(() => {
      // Even with error, it should proceed to show the preview/settings
      expect(screen.getByTestId('video-preview')).toBeInTheDocument();
    });

    expect(consoleErrorMock).toHaveBeenCalledWith('Failed to initialize devices:', error);
    expect(screen.queryByText(/Loading Preview.../i)).not.toBeInTheDocument();
    expect(screen.getByTestId('device-settings')).toBeInTheDocument(); // Should still render UI
  });

   it('should throw error if not within StreamCall context', () => {
    (useCall as jest.Mock).mockReturnValue(null); // Simulate being outside context
    // Expect render to throw
    expect(() => render(<MeetingSetup setIsSetupComplete={mockSetIsSetupComplete} />))
      .toThrow('useStreamCall must be used within a StreamCall component.');
  });

});