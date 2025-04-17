"use client";
import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import Alert from "./Alert";
import { Button } from "./ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMediaReady, setIsMediaReady] = useState(false); // State to track media readiness

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  }

  // https://getstream.io/video/docs/react/ui-cookbook/replacing-call-controls/
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    const initializeDevices = async () => {
      if (!call) return; // Ensure call exists

      try {
        if (isMicCamToggled) {
          await call.camera?.disable();
          await call.microphone?.disable();
        } else {
          // Attempt to enable devices
          await call.camera?.enable();
          await call.microphone?.enable();
        }
        // Set media ready only after attempting to enable/disable
        setIsMediaReady(true);
      } catch (error) {
        console.error('Failed to initialize devices:', error);
        // Optionally handle the error, maybe show a message to the user
        // Still set ready to true to allow UI to proceed, VideoPreview might handle internal errors
        setIsMediaReady(true);
      }
    };

    // Initialize devices when the component mounts or dependencies change
    initializeDevices();

    // Dependency array ensures this runs when call, camera, microphone, or toggle state changes
  }, [call, call?.camera, call?.microphone, isMicCamToggled]);

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      {/* Conditionally render VideoPreview only when media is ready */}
      {isMediaReady ? <VideoPreview /> : <div>Loading Preview...</div>} {/* Show loading or placeholder */}
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();

          setIsSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
