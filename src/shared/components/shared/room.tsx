'use client';

import React from 'react';
import Peer from 'simple-peer';
import { AlertCircleIcon } from 'lucide-react';
import { getUserName } from '@/lib/get-user-name';
import { useMicroStatus, useSocket, useSounds } from '@/shared/hooks';

import { ChatContainer } from './chat-container';
import { RoomVoiceMember } from './room-voice-member';
import { RoomControlPanel } from './room-control-panel';
import { Alert, AlertTitle, Container, Skeleton } from '../ui';

type SocketCallParams = {
  callerId: string;
  targetId: string;
  roomId: string;
  signal: Peer.SignalData;
};

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
  const { status } = useMicroStatus();

  const peersRef = React.useRef<{ id: string; peer: Peer.Instance }[]>([]);

  React.useEffect(() => {
    if (!socket) return;

    /* TODO: решить проблему с повторным переподключением WebRTC */

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        console.log('[Room] connected, socket.id =', socket.id);

        socket.emit('room:join', roomId);

        socket.on('room:joined', (users: string[]) => {
          console.log('Подключились пользователи:', users);
          setIsLoading(false);
          setMembers(users);
          play('join');

          users.forEach((userId) => {
            if (
              socket.id !== userId &&
              !peersRef.current.find((peer) => peer.id !== userId)
            ) {
              const speaker = new Peer({
                initiator: true,
                trickle: false,
                stream,
              });

              // Сценарий 1: мы звоним юзеру
              speaker.on('signal', (signal) => {
                console.log('Signal:', signal);
                console.log('1: Создан сигнал для юзера ' + socket.id);

                socket.emit('room:call', {
                  callerId: socket.id,
                  targetId: userId,
                  roomId,
                  signal,
                });
                peersRef.current.push({
                  id: userId,
                  peer: speaker,
                });
              });

              // Сценарий 2: нам звонит юзер
              socket.on(
                'room:called',
                ({
                  callerId,
                  targetId,
                  signal: callerSignal,
                }: SocketCallParams) => {
                  console.log('2: Юзер ' + callerId + ' звонит');

                  const listener = new Peer({
                    initiator: false,
                    trickle: false,
                    stream,
                  });

                  listener.signal(callerSignal);

                  listener
                    .on('signal', (signal) => {
                      console.log(
                        '3: Получили сигнал, отправляем ответ ' + callerId
                      );

                      socket.emit('room:answer', {
                        callerId: targetId,
                        targetId: callerId,
                        roomId,
                        signal,
                      });
                    })
                    .on('stream', (mediaStream) => {
                      console.log('4: Подключаем MediaStream', mediaStream);
                      const audio = document.querySelector('audio');
                      if (audio) {
                        (audio as HTMLMediaElement).srcObject = mediaStream;
                        audio
                          .play()
                          .catch((error) =>
                            console.error('Play audio error:', error)
                          );
                      }
                    });
                }
              );

              // Сценарий 3: отвечаем на звонок юзера, и звоним ему в ответ
              socket.on(
                'room:answered',
                ({ callerId, signal }: SocketCallParams) => {
                  const target = peersRef.current.find(
                    ({ id }) => id === callerId
                  );

                  if (target) {
                    target.peer.signal(signal);
                    console.log('5: Ответили юзеру ' + callerId);
                  }
                }
              );
            }
          });
        });
      })
      .catch((error) => {
        console.error('Пользователь не дал доступ к микрофону:', error);
      });

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
      setMembers((prev) => prev.filter((prev) => prev !== userId));

      const target = peersRef.current.find(({ id }) => id === userId);
      if (target) {
        target.peer.destroy();
      }

      peersRef.current = peersRef.current.filter(({ id }) => id !== userId);

      play('leave');
    };

    socket.on('room:message', handleMessage);
    socket.on('room:leave', handleLeave);

    return () => {
      peersRef.current.forEach(({ peer }) => peer.destroy());
      peersRef.current = [];

      socket.off('room:joined');
      socket.off('room:called');
      socket.off('room:answered');
      socket.off('room:message', handleMessage);
      socket.off('room:leave', handleLeave);
    };
  }, [socket, roomId]);

  return (
    <Container className='w-full h-full flex flex-col'>
      <audio controls></audio>
      {status === 'denied' && (
        <Alert
          variant='destructive'
          className='w-fit self-center bg-destructive/20 border-none'>
          <AlertCircleIcon />
          <AlertTitle>
            Вас не слышно. Разрешите браузеру использовать ваш микрофон!
          </AlertTitle>
        </Alert>
      )}
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
