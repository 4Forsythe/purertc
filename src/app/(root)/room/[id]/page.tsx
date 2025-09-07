'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import { Room } from '@/shared/components';
import { SocketProvider } from '@/shared/context/socket-context';

export default function RoomPage(): React.JSX.Element {
  const { id } = useParams();

  return (
    <SocketProvider>
      <Room roomId={id as string} />
    </SocketProvider>
  );
}
