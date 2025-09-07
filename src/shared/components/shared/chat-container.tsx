import React from 'react';
import { getUserName } from '@/lib/get-user-name';

import { SendMessageForm } from '../forms';
import { ChatMessage } from './chat-message';

interface Props {
  members: string[];
  messages: {
    userId: string;
    text: string;
    timestamp: number;
  }[];
  roomId: string;
  userId?: string;
}

export const ChatContainer: React.FC<Props> = ({
  members,
  messages,
  roomId,
  userId,
}) => {
  const anchorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    anchorRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className='max-w-6xl w-full min-h-0 mx-auto p-5 gap-3.5 flex flex-1 flex-col border rounded-md overflow-hidden'>
      <div className='w-full min-h-0 mx-auto px-5 gap-5 flex flex-1 flex-col overflow-y-auto'>
        {messages.map((message) => {
          const username =
            userId === message.userId
              ? 'Вы'
              : getUserName(
                  members.filter((id) => id !== userId),
                  message.userId
                );

          return (
            <ChatMessage
              key={message.timestamp}
              type={username !== 'Вы' ? 'incoming' : 'default'}
              username={username}
              text={message.text}
              timestamp={new Date(message.timestamp)}
            />
          );
        })}
        <div ref={anchorRef} className='h-0'></div>
      </div>
      <SendMessageForm roomId={roomId} />
    </div>
  );
};
