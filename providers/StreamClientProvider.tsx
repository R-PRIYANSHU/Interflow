'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { useUser } from '@clerk/nextjs';

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamClientProvider = ({ children }: { children: ReactNode }) => { // Renamed provider for clarity
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const [chatClient, setChatClient] = useState<StreamChat>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (!API_KEY) throw new Error('Stream API key is missing');

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider,
    });

    const chatClientInstance = StreamChat.getInstance(API_KEY);
    // Note: StreamChat uses connectUser which handles token fetching internally if a tokenProvider is not explicitly passed during instantiation.
    // However, to ensure consistency and potentially reuse the same token logic, we'll connect manually after getting the token.
    // We need the token first. Let's fetch it using the provider.
    tokenProvider().then(token => {
      if (token) {
        chatClientInstance.connectUser(
          {
            id: user.id,
            name: user.username || user.id,
            image: user.imageUrl,
          },
          token // Use the same token fetched for video
        );
      }
    });


    setVideoClient(client);
    setChatClient(chatClientInstance);

  }, [user, isLoaded]); // Dependency array remains the same

  // Wait for both clients to be initialized
  if (!videoClient || !chatClient) return <Loader />;

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient}> {/* Wrap with Chat provider */}
        {children}
      </Chat>
    </StreamVideo>
  );
};

export default StreamClientProvider; // Export the renamed provider
