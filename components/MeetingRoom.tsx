"use client";
import { useState, useEffect } from "react"; // Added useEffect
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
// Import Stream Chat components
import {
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  useChatContext, // Hook to get chat client
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css"; // Import Stream Chat CSS V2

import { useRouter, useSearchParams, useParams } from "next/navigation"; // Added useParams
import { Users, LayoutList, MessageSquare } from "lucide-react"; // Added MessageSquare icon

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Loader from "./Loader";
import EndCallButton from "./EndCallButton";
import { cn } from "@/lib/utils";
import { PenTool } from "lucide-react"; // Add PenTool import
import { createExcalidrawSession } from "@/lib/whiteboardSession";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter(); // Keep only one declaration
  const params = useParams(); // Get route params
  const meetingId = params?.id as string; // Extract meeting ID
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false); // State for chat visibility
  const { useCallCallingState } = useCallStateHooks();
  const { client: chatClient } = useChatContext(); // Get chat client from context
  // const { call } = useCall(); // Remove unused call object destructuring
  // chatClient.user?.

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const handleExcalidrawSession = async () => {
    if (!chatClient?.user?.name || isCreatingSession) return;

    setIsCreatingSession(true);
    try {
      const sessionUrl = await createExcalidrawSession(chatClient.user.name);
      const channel = chatClient.channel("messaging", meetingId);
      await channel.sendMessage({
        text: `Join Whiteboard session: ${sessionUrl}`,
      });
      window.open(sessionUrl, "_blank");
    } catch (error) {
      console.error("Failed to create Excalidraw session:", error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  // Ensure channel exists when component mounts and chat client is ready
  useEffect(() => {
    if (!chatClient || !meetingId || !chatClient.userID) return; // Ensure we have the user ID

    const currentUserId = chatClient.userID;

    // Create or get channel, explicitly adding the current user as a member.
    // This helps ensure the user has permissions, especially with default role settings.
    const channel = chatClient.channel("messaging", meetingId, {
      name: `Meeting Chat ${meetingId}`, // Optional: Give the channel a name
      members: [currentUserId], // Explicitly add the current user
    });

    // Although the <Channel> component often handles watching,
    // explicitly calling watch() can sometimes resolve initialization/permission issues faster.
    // We'll wrap it in an async function as watch() returns a Promise.
    const watchChannel = async () => {
      try {
        // Using create() ensures the channel exists and adds the user if they aren't a member
        // It implicitly watches the channel after creation/retrieval.
        await channel.create();
        // Alternatively, if create() doesn't suit the permission flow:
        // await channel.watch();
      } catch (error) {
        console.error("Error watching or creating channel:", error);
        // Handle error appropriately, maybe show a notification to the user
      }
    };

    watchChannel();

    // Cleanup function to stop watching when the component unmounts or dependencies change
    return () => {
      // channel.stopWatching(); // Stop watching to clean up resources
      // Note: Disconnecting the user in the onLeave handler might be sufficient,
      // but explicit stopWatching is safer if the component can re-render with different IDs.
      // Let's rely on disconnectUser for now to avoid potential double-cleanup issues.
    };

    // Optional: Add the current user as a member if not already handled by watching
    // This might be needed depending on Stream permission setup
    // async function ensureMembership() {
    //   const userId = chatClient?.userID;
    //   if (userId && !channel.state.members[userId]) {
    //     await channel.addMembers([userId]);
    //   }
    // }
    // ensureMembership();
  }, [chatClient, meetingId]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        {/* Participants Panel */}
        <div
          className={cn(
            "h-[calc(100vh-86px)] hidden ml-2 w-[320px] bg-dark-1 p-2 rounded-lg transition-all",
            {
              // Added base styles
              block: showParticipants, // Use block instead of show-block if that's a custom class
            }
          )}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
        {/* Chat Panel */}
        <div
          className={cn(
            "fixed right-0 top-0 h-screen w-[320px] bg-dark-1 p-2 rounded-l-lg transition-transform duration-300 ease-in-out transform translate-x-full z-10", // Base styles: hidden off-screen right
            { "translate-x-0": showChat } // Slide in when showChat is true
          )}
        >
          {chatClient &&
            meetingId && ( // Ensure client and ID are available
              <Channel channel={chatClient.channel("messaging", meetingId)}>
                <Window>
                  <div className="flex flex-col h-full">
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                  </div>
                </Window>
              </Channel>
            )}
          {/* Optional: Add a close button for the chat */}
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-2 right-2 text-white hover:text-gray-400"
          >
            &times; {/* Simple close icon */}
          </button>
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 py-2 bg-dark-1/80">
        {" "}
        {/* Added padding and background */}
        <CallControls
          onLeave={() => {
            chatClient?.disconnectUser(); // Disconnect chat user on leave
            router.push(`/`);
          }}
        />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger
              aria-label="Change layout"
              className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  "
            >
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button
          aria-label="Toggle participants"
          onClick={() => setShowParticipants((prev) => !prev)}
        >
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {/* Chat Toggle Button */}
        <button
          aria-label="Toggle chat"
          onClick={() => setShowChat((prev) => !prev)}
        >
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <MessageSquare size={20} className="text-white" />
          </div>
        </button>
        <button
          onClick={handleExcalidrawSession}
          disabled={isCreatingSession}
          aria-label="Open whiteboard"
          className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2">
            <PenTool size={20} className="text-white" />
            {isCreatingSession && <span className="text-xs">Creating...</span>}
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
