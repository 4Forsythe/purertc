'use client';

import React from 'react';
import { getUserName } from '@/lib/get-user-name';
import { useSocket, useSounds } from '@/shared/hooks';

import { Container, Skeleton } from '../ui';
import { ChatContainer } from './chat-container';
import { RoomVoiceMember } from './room-voice-member';
import { RoomControlPanel } from './room-control-panel';

interface Props {
  roomId: string;
}

export const Room: React.FC<Props> = ({ roomId }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [members, setMembers] = React.useState<string[]>([]);
  const [messages, setMessages] = React.useState<
    {
      userId: string;
      text: string;
      timestamp: number;
    }[]
  >([]);

  const { play } = useSounds();
  const { socket } = useSocket();

  React.useEffect(() => {
    if (!socket) return;

    console.log('[Room] connected, socket.id =', socket.id);

    const handleJoined = (users: string[]) => {
      console.log('Подключились пользователи:', users);
      setIsLoading(false);
      setMembers(users);
      play('join');
    };

    const handleMessage = (message: {
      userId: string;
      text: string;
      timestamp: number;
    }) => {
      setMessages((prev) => [...prev, message]);
      play('message');
    };

    const handleLeave = (userId: string) => {
      console.log('Отключился пользователь:', userId);
      setMembers((prev) => prev.filter((id) => id !== userId));
      play('leave');
    };

    socket.emit('room:join', roomId);

    socket.on('room:joined', handleJoined);
    socket.on('room:message', handleMessage);
    socket.on('room:leave', handleLeave);

    return () => {
      socket.off('room:joined', handleJoined);
      socket.off('room:message', handleMessage);
      socket.off('room:leave', handleLeave);
    };
  }, [socket, roomId]);

  return (
    <Container className='w-full h-full flex flex-col'>
      <div className='my-14 h-full flex flex-col overflow-hidden'>
        <div className='gap-5 flex flex-none items-center justify-center'>
          {isLoading ? (
            <Skeleton className='w-sm h-64' />
          ) : (
            members.map((memberId) => (
              <RoomVoiceMember
                key={memberId}
                member={{
                  name:
                    socket?.id === memberId
                      ? 'Вы'
                      : getUserName(
                          members.filter((id) => id !== socket?.id),
                          memberId
                        ),
                }}
              />
            ))
          )}
        </div>
        <div className='my-8 flex flex-none items-center justify-center'>
          {isLoading ? (
            <Skeleton className='w-40 h-12' />
          ) : (
            <RoomControlPanel />
          )}
        </div>
        <ChatContainer
          members={members}
          messages={messages}
          roomId={roomId}
          userId={socket?.id}
        />
      </div>
    </Container>
  );
};
